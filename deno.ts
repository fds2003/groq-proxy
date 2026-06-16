const OPENAI_API_HOST = "api.groq.com";

Deno.serve(async (request) => {
  try {
    const url = new URL(request.url);

    if (url.pathname === "/") {
      return new Response(`${url.origin}/openai/v1`, { status: 200 });
    }

    url.host = OPENAI_API_HOST;

    const newRequest = new Request(url.toString(), {
      headers: request.headers,
      method: request.method,
      body: request.body,
      redirect: "follow",
    });
    return await fetch(newRequest);
  } catch (e) {
    return new Response(e.stack, { status: 500 });
  }
});
