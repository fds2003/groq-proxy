const OPENAI_API_HOST = "api.groq.com";

export default {
  async fetch(request) {
    try {
      const url = new URL(request.url);

      if (url.pathname === "/") {
        return new Response(`${url.origin}/openai/v1`, { status: 200 });
      }

      url.host = OPENAI_API_HOST;

      const newRequest = new Request(url.toString(), {
        method: request.method,
        headers: request.headers,
        body: request.body,
      });

      return await fetch(newRequest);
    } catch (e) {
      return new Response(e.stack, { status: 500 });
    }
  },
};
