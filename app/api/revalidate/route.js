import crypto from 'crypto';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

/**
 * API endpoint pour recevoir les webhooks Shopify
 * et déclencher un redéploiement Cloudflare Pages
 */
export async function POST(request) {
  try {
    // 1. Vérifier la signature HMAC du webhook Shopify (sécurité)
    const hmac = request.headers.get('x-shopify-hmac-sha256');
    const body = await request.text();

    const secret = process.env.SHOPIFY_WEBHOOK_SECRET;

    if (secret && hmac) {
      const hash = crypto
        .createHmac('sha256', secret)
        .update(body)
        .digest('base64');

      if (hash !== hmac) {
        console.error('Invalid HMAC signature');
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
    }

    // 2. Déclencher un nouveau déploiement Cloudflare Pages
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const projectName = process.env.CLOUDFLARE_PROJECT_NAME;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;

    if (!accountId || !projectName || !apiToken) {
      console.error('Missing Cloudflare environment variables');
      return NextResponse.json(
        { error: 'Configuration error' },
        { status: 500 }
      );
    }

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
