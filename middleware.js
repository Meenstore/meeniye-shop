import { NextResponse } from 'next/server';

export function middleware(request) {
  // Les webhooks Shopify envoient un HMAC vérifié dans le handler,
  // pas besoin de CSRF pour cette route
  if (request.nextUrl.pathname === '/api/revalidate') {
    return NextResponse.next();
  }

  // Protection CSRF simple : vérifier l'origine des requêtes POST
  if (request.method === 'POST') {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');

    // Vérifier que la requête vient du même domaine
    // En dev : origin peut être null, on autorise
    if (origin && host && !origin.includes(host)) {
      console.log(`CSRF attempt blocked - Origin: ${origin}, Host: ${host}`);
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
}

// Appliquer uniquement aux routes API (pas aux pages)
export const config = {
  matcher: '/api/:path*',
};
