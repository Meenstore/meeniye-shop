import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Créer une instance Redis
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Configuration du rate limiting
// 10 requêtes par 10 secondes = protection anti-spam raisonnable
export const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: '@meeniye/ratelimit',
});

// Helper function pour vérifier le rate limit
export async function checkRateLimit(request, identifier = null) {
  // Utiliser l'IP comme identifiant par défaut
  const ip = identifier || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';

  try {
    const { success, limit, reset, remaining } = await ratelimit.limit(ip);

    return {
      success,
      limit,
      reset,
      remaining,
      ip
    };
  } catch (error) {
    console.error('Rate limit check error:', error);
    // En cas d'erreur Redis, on laisse passer (fail open)
    // Mieux vaut laisser passer que bloquer tout le monde
    return {
      success: true,
      limit: 10,
      reset: Date.now() + 10000,
      remaining: 10,
      ip,
      error: true
    };
  }
}
