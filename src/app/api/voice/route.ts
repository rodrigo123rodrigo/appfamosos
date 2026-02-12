import { NextRequest, NextResponse } from "next/server";

/* ── System prompt ──────────────────────────────────────────── */

const SYSTEM_INSTRUCTION = `Eres el asistente operativo de una celebridad dentro de la plataforma ClarifyPro.
Tu trabajo NO es conversar, es EJECUTAR.

REGLAS:
1. Si el usuario pide una acción, devuelve EXCLUSIVAMENTE un JSON con la estructura:
   { "function": "<nombre>", "args": { ... } }
2. Si te pide redactar un comunicado o borrador, usa createDraft con tono profesional y defensivo.
3. Si te pide navegar, usa navigateTo con la ruta correcta.
4. Si te pide leer algo en voz alta, usa readAloud.
5. Si te pide activar/desactivar privacidad, usa togglePrivacy.
6. Si la intención no es clara o es una pregunta informativa, responde con:
   { "function": "reply", "args": { "text": "<tu respuesta breve>" } }

HERRAMIENTAS DISPONIBLES:
- navigateTo({ route: string })
  Rutas: /, /dashboard, /clarifications, /categories, /verified, /media,
         /login, /signup, /demo, /pricing, /dashboard/new, /dashboard/metrics,
         /dashboard/press-kit, /dashboard/rumors, /dashboard/statements,
         /help, /contact, /docs, /privacy, /terms, /security, /api
- createDraft({ content: string, tone: "profesional"|"defensivo"|"neutral"|"urgente" })
- readAloud({ text: string })
- togglePrivacy({ enabled: boolean })

NUNCA respondas fuera de formato JSON. NUNCA uses markdown. Solo JSON puro.`;

/* ── POST handler ───────────────────────────────────────────── */

export async function POST(req: NextRequest) {
  try {
    const { transcript } = await req.json();

    if (!transcript || typeof transcript !== "string") {
      return NextResponse.json(
        { error: "transcript is required" },
        { status: 400 },
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    /* ── If no API key → local fallback intent parser ───────── */
    if (!apiKey) {
      const result = localIntentParser(transcript);
      return NextResponse.json(result);
    }

    /* ── Call Gemini API ────────────────────────────────────── */
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
          contents: [
            {
              role: "user",
              parts: [{ text: transcript }],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 512,
          },
        }),
      },
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("[Gemini API error]", errText);
      // Fall back to local parser on API error
      const result = localIntentParser(transcript);
      return NextResponse.json(result);
    }

    const geminiData = await geminiRes.json();
    const rawText =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    /* Try to parse Gemini's JSON response */
    try {
      const cleaned = rawText.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      return NextResponse.json(parsed);
    } catch {
      // If Gemini didn't return valid JSON, treat as reply
      return NextResponse.json({
        function: "reply",
        args: { text: rawText.trim() || "No entendí la instrucción." },
      });
    }
  } catch (err: any) {
    console.error("[Voice API]", err);
    return NextResponse.json(
      { error: err.message ?? "Internal error" },
      { status: 500 },
    );
  }
}

/* ── Local intent parser (works without API key) ────────────── */

function localIntentParser(transcript: string): {
  function: string;
  args: Record<string, any>;
} {
  const t = transcript.toLowerCase().trim();

  /* Navigation intents */
  const navMap: Record<string, string> = {
    inicio: "/",
    home: "/",
    principal: "/",
    dashboard: "/dashboard",
    panel: "/dashboard",
    aclaraciones: "/clarifications",
    aclaracion: "/clarifications",
    categorías: "/categories",
    categorias: "/categories",
    verificados: "/verified",
    medios: "/media",
    prensa: "/media",
    login: "/login",
    "iniciar sesión": "/login",
    "iniciar sesion": "/login",
    registro: "/signup",
    registrar: "/signup",
    "crear cuenta": "/signup",
    demo: "/demo",
    precios: "/pricing",
    planes: "/pricing",
    "nueva aclaración": "/dashboard/new",
    "nueva aclaracion": "/dashboard/new",
    "nuevo borrador": "/dashboard/new",
    métricas: "/dashboard/metrics",
    metricas: "/dashboard/metrics",
    "kit de prensa": "/dashboard/press-kit",
    rumores: "/dashboard/rumors",
    "mis aclaraciones": "/dashboard/statements",
    ayuda: "/help",
    contacto: "/contact",
    documentación: "/docs",
    documentacion: "/docs",
    privacidad: "/privacy",
    términos: "/terms",
    terminos: "/terms",
    seguridad: "/security",
    api: "/api",
    perfil: "/dashboard",
  };

  for (const [keyword, route] of Object.entries(navMap)) {
    if (t.includes(keyword)) {
      return { function: "navigateTo", args: { route } };
    }
  }

  /* Privacy toggle */
  if (t.includes("incógnito") || t.includes("incognito") || t.includes("privacidad")) {
    const enable = !t.includes("desactiv") && !t.includes("apag");
    return { function: "togglePrivacy", args: { enabled: enable } };
  }

  /* Read aloud intent */
  if (t.includes("lee") || t.includes("leer") || t.includes("leerme") || t.includes("voz alta")) {
    return {
      function: "readAloud",
      args: {
        text: "Esta es una prueba del sistema de lectura en voz alta de ClarifyPro.",
      },
    };
  }

  /* Draft / redactar intent */
  if (
    t.includes("redact") ||
    t.includes("escrib") ||
    t.includes("borrador") ||
    t.includes("comunicado") ||
    t.includes("aclar")
  ) {
    return {
      function: "createDraft",
      args: {
        content: `Comunicado oficial: ${transcript}`,
        tone: "profesional",
      },
    };
  }

  /* Fallback reply */
  return {
    function: "reply",
    args: {
      text: `Entendido: "${transcript}". ¿Quieres que navegue a alguna sección o redacte un comunicado?`,
    },
  };
}
