import { NextResponse } from 'next/server';

export const runtime = 'edge';

/**
 * Vérifier la signature HMAC avec Web Crypto API (compatible edge runtime)
 */
async function verifyShopifyWebhook(body, hmacHeader, secret) {
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
  const hashBase64 = btoa(String.fromCharCode(...hashArray));

  return hashBase64 === hmacHeader;
}

/**
 * API endpoint pour recevoir les webhooks Shopify
 * et déclencher un redéploiement Cloudflare Pages
 */
export async function POST(request) {
  try {
    // 1. Vérifier la signature HMAC du webhook Shopify (sécurité)
    const hmacHeader = request.headers.get('x-shopify-hmac-sha256');
    const body = await request.text();

    const secret = process.env.SHOPIFY_WEBHOOK_SECRET;

    if (secret && hmacHeader) {
      const isValid = await verifyShopifyWebhook(body, hmacHeader, secret);

      if (!isValid) {
        console.error('Invalid HMAC signature');
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
    }

    // 2. Déclencher un nouveau déploiement via Deploy Hook
    const deployHookUrl = process.env.CLOUDFLARE_DEPLOY_HOOK_URL;

    if (!deployHookUrl) {
      console.error('Missing CLOUDFLARE_DEPLOY_HOOK_URL');
      return NextResponse.json(
        { error: 'Configuration error' },
        { status: 500 }
      );
    }

    // Appeler le Deploy Hook de Cloudflare Pages
    const response = await fetch(deployHookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Cloudflare API error:', error);
      return NextResponse.json(
        { error: 'Failed to trigger deployment' },
        { status: 500 }
      );
    }

    const data = await response.json();
    console.log('Deployment triggered:', data);

    return NextResponse.json({
      success: true,
      message: 'Deployment triggered successfully',
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
