const NPM_REGISTRY = 'https://registry.npmjs.org';
const NPM_MIRROR = 'https://npm.example.com';

export default {
  async fetch(request) {
    const url = request.url.replace(NPM_MIRROR, NPM_REGISTRY);
    const response = await fetch(url, {
      ...request,
      cf: {
        cacheEverything: true,
        cacheTtlByStatus: {
          [200 - 299]: 3600
        }
      }
    });
    if (url.includes('/-/')) return response;
    const body = (await response.text()).replaceAll(NPM_REGISTRY, NPM_MIRROR);
    return new Response(body, response);
  }
};
