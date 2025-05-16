const DEFAULT_REDIRECT = 'https://error.example.com/404';
const ORIGIN_BASE_URL = 'https://v2board.example.com';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;
    const params = url.searchParams;

    if ('/api/v1/client/subscribe' !== path) return Response.redirect(DEFAULT_REDIRECT, 302);
    if (!params.has('token')) return Response.redirect(DEFAULT_REDIRECT, 302);

    const allowedParams = ['token', 'flag'];
    for (const param of params.keys()) {
      if (!allowedParams.includes(param)) return Response.redirect(DEFAULT_REDIRECT, 302);
    }

    return await fetch(
      `${ORIGIN_BASE_URL}/api/v1/client/subscribe?${params.toString()}`,
      {
        ...request,
        cf: {
          cacheEverything: true,
          cacheTtl: 60,
          cacheKey: `__prk_v2board_proxy_${path}?${params.toString()}`
        }
      }
    );
  }
};
