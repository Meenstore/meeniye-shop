import nodemailer from "nodemailer";

async function test() {
  const t = nodemailer.createTransport({
    host: "ssl0.ovh.net",
    port: 465,
    secure: true,
    auth: {
      user: "contact@meeniye.com",
      pass: "03012022Miala",
    },
  });

  try {
    console.log("🔍 Test de connexion SMTP OVH...");
    await t.verify();
    console.log("✅ SMTP OK - Le serveur répond et l'authentification fonctionne !");
  } catch (e) {
    console.error("❌ SMTP ERREUR:", e);
  }
}

test();
