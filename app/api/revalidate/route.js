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

    // DEBUG: Testons TOUTES les variables
    const allVars = {
      CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
      CLOUDFLARE_PROJECT_NAME: process.env.CLOUDFLARE_PROJECT_NAME,
      CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN,
      SHOPIFY_WEBHOOK_SECRET: process.env.SHOPIFY_WEBHOOK_SECRET,
      NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
      NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN
    };

    const varsStatus = {};
    for (const [key, value] of Object.entries(allVars)) {
      varsStatus[key] = value ? 'present' : 'missing';
    }

    // Retourner le status de toutes les variables
    return NextResponse.json({
      message: 'Variables test',
      variables: varsStatus
    });

    // Appeler l'API Cloudflare pour créer un nouveau déploiement
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}/deployments`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Déclencher un redéploiement de la branche production
          production_branch: 'main',
        }),
      }
    );

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
