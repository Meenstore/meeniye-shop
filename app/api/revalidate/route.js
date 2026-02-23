import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

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
 * API endpoint sécurisé avec On-Demand Revalidation
 */
export async function POST(request) {
  try {
    const hmacHeader = request.headers.get('x-shopify-hmac-sha256');
    const topic = request.headers.get('x-shopify-topic');
    const secret = process.env.SHOPIFY_WEBHOOK_SECRET;

    // 1. SÉCURITÉ : Si une info manque, on bloque TOUT DE SUITE.
    if (!secret) {
      console.error('Server configuration error: Missing SHOPIFY_WEBHOOK_SECRET');
      return NextResponse.json({ error: 'Server config error' }, { status: 500 });
    }

    if (!hmacHeader) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    if (!topic) {
      return NextResponse.json({ error: 'Missing topic' }, { status: 400 });
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

    // 3. Parser le payload pour obtenir le handle
    let data;
    try {
      data = JSON.parse(body);
    } catch (error) {
      console.error('Failed to parse webhook body:', error);
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const revalidatedPaths = [];

    // 4. On-Demand Revalidation basée sur le topic
    if (topic.startsWith('products/')) {
      // Toujours revalider la page d'accueil et le catalogue produits
      revalidatePath('/', 'page');
      revalidatedPaths.push('/');
      revalidatePath('/products', 'page');
      revalidatedPaths.push('/products');

      // Si c'est une mise à jour/création, revalider la page produit spécifique
      if ((topic === 'products/update' || topic === 'products/create') && data.handle) {
        revalidatePath(`/products/${data.handle}`, 'page');
        revalidatedPaths.push(`/products/${data.handle}`);
      }

      // Si le produit a des tags/collections, on pourrait aussi revalider les collections
      if (data.tags && Array.isArray(data.tags)) {
        data.tags.forEach(tag => {
          revalidatePath(`/collections/${tag}`, 'page');
          revalidatedPaths.push(`/collections/${tag}`);
        });
      }
    }

    if (topic.startsWith('collections/')) {
      // Revalider la page d'accueil
      revalidatePath('/', 'page');
      revalidatedPaths.push('/');

      // Revalider la page collection spécifique
      if (data.handle) {
        revalidatePath(`/collections/${data.handle}`, 'page');
        revalidatedPaths.push(`/collections/${data.handle}`);
      }
    }

    console.log(`[Webhook] Topic: ${topic}, Revalidated paths:`, revalidatedPaths);

    return NextResponse.json({
      success: true,
      message: 'On-demand revalidation triggered',
      topic,
      revalidatedPaths,
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}