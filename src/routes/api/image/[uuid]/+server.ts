import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, fetch }) => {
  const { uuid } = params;

  const response = await fetch(
    `https://ochre.lib.uchicago.edu/ochre/v2/ochre.php?uuid=${uuid}&format=preview`
  );

  if (!response.ok) {
    return new Response("Image not found", { status: 404 });
  }

  return new Response(response.body, {
    headers: {
      "Content-Type":
        response.headers.get("Content-Type") ?? "image/jpeg"
    }
  });
};