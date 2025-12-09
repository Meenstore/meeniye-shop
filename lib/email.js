import nodemailer from 'nodemailer';

/**
 * Créer un transporteur SMTP pour OVH
 */
export function createTransporter() {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD;

  // Vérifier que toutes les variables sont configurées
  if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword) {
    console.warn('⚠️ Configuration SMTP incomplète. Mode dev activé.');
    return null;
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(smtpPort),
    secure: parseInt(smtpPort) === 465, // true pour le port 465, false pour les autres
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
  });
}

/**
 * Envoyer un email via SMTP OVH
 */
export async function sendEmail({ from, to, subject, html, replyTo }) {
  const transporter = createTransporter();

  // Mode développement : simuler l'envoi
  if (!transporter) {
    console.log('📧 [DEV MODE] Email simulé:', {
      from,
      to,
      subject,
      replyTo,
      html: html.substring(0, 100) + '...'
    });
    return { success: true, messageId: 'dev-mode-' + Date.now() };
  }

  // Mode production : envoyer vraiment
  try {
    const info = await transporter.sendMail({
      from: from || process.env.SMTP_USER,
      to,
      subject,
      html,
      replyTo: replyTo || from,
    });

    console.log('✅ Email envoyé avec succès:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
    throw error;
  }
}
