import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
import { checkRateLimit } from '@/lib/ratelimit';

// Schema de validation Zod
const contactSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(100),
  email: z.string().email('Email invalide'),
  sujet: z.enum(['produit', 'commande', 'livraison', 'retour', 'autre'], {
    errorMap: () => ({ message: 'Sujet invalide' })
  }),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères').max(2000)
});

export async function POST(request) {
  try {
    // Vérifier le rate limiting en premier
    const rateLimitResult = await checkRateLimit(request);

    if (!rateLimitResult.success) {
      console.log(`⚠️ Rate limit exceeded for IP: ${rateLimitResult.ip}`);
      return NextResponse.json(
        {
          error: 'Trop de requêtes. Veuillez patienter avant de réessayer.',
          retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000)
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimitResult.reset).toISOString(),
          }
        }
      );
    }

    // Récupérer et parser le body
    const body = await request.json();

    // Valider avec Zod
    const validatedData = contactSchema.parse(body);

    // Vérifier si Resend est configuré
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey || resendApiKey === 'your_resend_api_key_here') {
      // Mode développement : on log juste les données
      console.log('📧 [DEV MODE] Email qui serait envoyé:', {
        from: 'noreply@meeniye.com',
        to: 'contact@meeniye.com',
        subject: `[${validatedData.sujet.toUpperCase()}] Message de ${validatedData.nom}`,
        replyTo: validatedData.email,
        message: validatedData.message
      });

      return NextResponse.json({
        success: true,
        message: 'Mode développement : email simulé avec succès'
      });
    }

    // Mode production : envoyer vraiment l'email
    const resend = new Resend(resendApiKey);

    const { data, error } = await resend.emails.send({
      from: 'noreply@meeniye.com',
      to: 'contact@meeniye.com', // Sera remplacé par l'email pro réel
      subject: `[${validatedData.sujet.toUpperCase()}] Message de ${validatedData.nom}`,
      replyTo: validatedData.email,
      html: `
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom :</strong> ${validatedData.nom}</p>
        <p><strong>Email :</strong> ${validatedData.email}</p>
        <p><strong>Sujet :</strong> ${validatedData.sujet}</p>
        <hr />
        <p><strong>Message :</strong></p>
        <p>${validatedData.message.replace(/\n/g, '<br>')}</p>
      `
    });

    if (error) {
      console.error('❌ Erreur Resend:', error);
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi de l\'email' },
        { status: 500 }
      );
    }

    console.log('✅ Email envoyé avec succès:', data);

    return NextResponse.json({
      success: true,
      message: 'Email envoyé avec succès'
    });

  } catch (error) {
    // Erreur de validation Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Données invalides',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    // Autres erreurs
    console.error('❌ Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue. Veuillez réessayer.' },
      { status: 500 }
    );
  }
}
