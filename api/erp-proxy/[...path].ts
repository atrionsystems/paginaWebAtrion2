import type { VercelRequest, VercelResponse } from "@vercel/node";

const ERP_URL = process.env.ERP_URL || "https://atrion-core.vercel.app";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const segments = Array.isArray(req.query.path) ? req.query.path : [req.query.path || ""];
  const path = segments.join("/");

  const search = req.url?.includes("?") ? "?" + req.url.split("?")[1] : "";
  const targetUrl = `${ERP_URL}/contabilidad/api/${path}/${search}`;

  const headers: Record<string, string> = {
    "content-type": "application/json",
  };
  if (req.headers.authorization) {
    headers["authorization"] = req.headers.authorization as string;
  }

  const body =
    req.method !== "GET" && req.method !== "HEAD"
      ? JSON.stringify(req.body)
      : undefined;

  try {
    const upstream = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
    });

    const text = await upstream.text();
    res.status(upstream.status).send(text);
  } catch {
    res.status(502).json({ detail: "Error connecting to ERP service." });
  }
}
