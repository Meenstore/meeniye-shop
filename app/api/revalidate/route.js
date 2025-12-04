import { NextResponse } from 'next/server';

export const runtime = 'edge';

/**
 * Comparaison sécurisée (Constant-Time) pour éviter les Timing Attacks
 */
function secureCompare(a, b) {
  const aBuffer = new TextEncoder().encode(a);
  const bBuffer = new TextEncoder().encode(b);
  
  if (aBuffer.byteLength !== bBuffer.byteLength) return false;

  let result = 0;
  for (let i = 0; i < aBuffer.byteLength; i++) {
    result |= aBuffer[i] ^ bBuffer[i];
  }
  return result === 0;
}

/**
 * Générer la signature HMAC
 */
async function generateSignature(body, secret) {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(body);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  const hashArray = Array.from(new Uint8Array(signature));
  return btoa(String.fromCharCode(...hashArray));
}

/**
 * API endpoint sécurisé
 */
export async function POST(request) {
  try {
    const hmacHeader = request.headers.get('x-shopify-hmac-sha256');
    const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
    const deployHookUrl = process.env.CLOUDFLARE_DEPLOY_HOOK_URL;

    // 1. SÉCURITÉ : Si une info manque, on bloque TOUT DE SUITE.
    if (!secret || !deployHookUrl) {
      console.error('Server configuration error: Missing env vars');
      return NextResponse.json({ error: 'Server config error' }, { status: 500 });
    }

    if (!hmacHeader) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    // 2. Vérification de la signature
    const body = await request.text();
    const generatedSignature = await generateSignature(body, secret);

    // Comparaison sécurisée (pas de === simple)
    const isValid = secureCompare(generatedSignature, hmacHeader);

    if (!isValid) {
      console.error('Invalid HMAC signature - Attack attempt?');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // --- À partir d'ici, c'est officiellement Shopify ---

    // 3. Déclencher le déploiement Cloudflare
    const response = await fetch(deployHookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}) // Parfois requis par Cloudflare
    });

    if (!response.ok) {
      console.error('Cloudflare Deployment Failed');
      return NextResponse.json({ error: 'Failed to trigger deployment' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Deployment triggered successfully',
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}