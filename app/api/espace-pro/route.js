import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
import { checkRateLimit } from '@/lib/ratelimit';

// Schema de validation Zod
const espaceProSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(100),
  prenom: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères').max(100),
  entreprise: z.string().min(2, 'Le nom de l\'entreprise doit contenir au moins 2 caractères').max(200),
  email: z.string().email('Email invalide'),
  telephone: z.string().regex(/^[\d\s\+\-\(\)]+$/, 'Numéro de téléphone invalide').min(10).max(20),
  typeProfessionnel: z.enum(['salon-afro', 'barbier', 'spa', 'distributeur', 'autre'], {
    errorMap: () => ({ message: 'Type de professionnel invalide' })
  }),
  message: z.string().min(20, 'Le message doit contenir au moins 20 caractères').max(2000)
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
    const validatedData = espaceProSchema.parse(body);

    // Vérifier si Resend est configuré
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey || resendApiKey === 'your_resend_api_key_here') {
      // Mode développement : on log juste les données
      console.log('📧 [DEV MODE] Email Espace Pro qui serait envoyé:', {
        from: 'noreply@meeniye.com',
        to: 'pro@meeniye.com', // Email dédié espace pro (ou contact@)
        subject: `[ESPACE PRO] Demande de ${validatedData.entreprise}`,
        replyTo: validatedData.email,
        data: validatedData
      });

      return NextResponse.json({
        success: true,
        message: 'Mode développement : email simulé avec succès'
      });
    }

    // Mode production : envoyer vraiment l'email
    const resend = new Resend(resendApiKey);

    // Mapper le type de professionnel pour l'affichage
    const typeProMap = {
      'salon-afro': 'Salon de coiffure afro',
      'barbier': 'Barbier',
      'spa': 'Spa / Institut',
      'distributeur': 'Distributeur / Revendeur',
      'autre': 'Autre'
    };

    const { data, error } = await resend.emails.send({
      from: 'noreply@meeniye.com',
      to: 'contact@meeniye.com', // Ou pro@meeniye.com si email dédié
      subject: `[ESPACE PRO] Demande de ${validatedData.entreprise}`,
      replyTo: validatedData.email,
      html: `
        <h2>Nouvelle demande Espace Professionnel</h2>

        <h3>Informations du contact</h3>
        <p><strong>Nom :</strong> ${validatedData.nom}</p>
        <p><strong>Prénom :</strong> ${validatedData.prenom}</p>
        <p><strong>Email :</strong> ${validatedData.email}</p>
        <p><strong>Téléphone :</strong> ${validatedData.telephone}</p>

        <h3>Informations professionnelles</h3>
        <p><strong>Entreprise / Salon :</strong> ${validatedData.entreprise}</p>
        <p><strong>Type de professionnel :</strong> ${typeProMap[validatedData.typeProfessionnel]}</p>

        <hr />

        <h3>Message</h3>
        <p>${validatedData.message.replace(/\n/g, '<br>')}</p>

        <hr />
        <p><em>Email envoyé depuis le formulaire Espace Pro de meeniye.com</em></p>
      `
    });

    if (error) {
      console.error('❌ Erreur Resend:', error);
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi de l\'email' },
        { status: 500 }
      );
    }

    console.log('✅ Email Espace Pro envoyé avec succès:', data);

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
