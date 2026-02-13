import { NextRequest, NextResponse } from "next/server";

/* ── System prompt ──────────────────────────────────────────── */

const SYSTEM_INSTRUCTION = `Eres el asistente de voz inteligente de ClarifyPro, la plataforma premium para celebridades y managers.
Tu misión es EJECUTAR ACCIONES de forma fluida y natural, optimizando el tiempo de los usuarios.

IDENTIDAD DE LA MARCA:
- Premium, moderna y exclusiva
- Colores: Negro cyberpunk (#0D0D0D), Cyan neón (#00F0FF), Magenta (#FF006E), Púrpura (#7700FF)
- Diseño futurista con efectos de glow neón
- Para celebridades, managers y equipos profesionales

FLUJO COMPLETO DE DICTADO (LO MÁS IMPORTANTE):

1. INICIO: Cuando el usuario diga "nueva aclaración", "quiero hacer una aclaración", "declaración nueva", etc.
   → { "function": "dictateStatement", "args": { "mode": "start" } }

2. ESCUCHA: Después de iniciar, CADA frase del usuario es contenido:
   → { "function": "dictateStatement", "args": { "mode": "append", "content": "<todo lo que dijo>" } }

3. FINALIZAR: Cuando diga "terminar", "listo", "eso es todo", "publicar":
   → { "function": "dictateStatement", "args": { "mode": "finish", "content": "<últimas palabras si las hay>" } }

4. CONFIRMACIÓN: El sistema leerá el texto. Si confirma con "sí", "correcto", "publicar":
   → { "function": "confirmAndPublish", "args": { "platforms": ["twitter", "instagram", "facebook"], "confirmed": true } }

5. RECHAZO: Si dice "no", "incorrecto", "rehacer":
   → { "function": "confirmAndPublish", "args": { "platforms": [], "confirmed": false } }

NAVEGACIÓN:
cuando el usuario pida ir a dashboard, nueva aclaración, métricas, etc.:
- navigateTo({ route: "/dashboard" })
- navigateTo({ route: "/dashboard/new" })
- navigateTo({ route: "/dashboard/metrics" })
etc.

BORRADOR TRADICIONAL:
Si pide "redactar un comunicado sobre X" (sin usar flujo de dictado):
- createDraft({ content: "<generar texto profesional>", tone: "profesional" })

OTRAS ACCIONES:
- readAloud({ text: "..." }) para leer algo
- togglePrivacy({ enabled: true/false }) para privacidad

FORMATO DE RESPUESTA:
SIEMPRE JSON puro, NUNCA markdown:
{ "function": "<nombre>", "args": { ... } }

Si la intención no es clara:
{ "function": "reply", "args": { "text": "¿Qué necesitas hacer?" } }

EJEMPLOS:

Usuario: "Quiero hacer una nueva aclaración"
→ { "function": "dictateStatement", "args": { "mode": "start" } }

Usuario: "Hoy salió un rumor falso sobre mí y quiero aclarar que no es verdad"
→ { "function": "dictateStatement", "args": { "mode": "append", "content": "Hoy salió un rumor falso sobre mí y quiero aclarar que no es verdad" } }

Usuario: "Terminar"
→ { "function": "dictateStatement", "args": { "mode": "finish" } }

Usuario: "Sí, publicar en todo"
→ { "function": "confirmAndPublish", "args": { "platforms": ["twitter", "instagram", "facebook"], "confirmed": true } }

Usuario: "Llévame al dashboard"
→ { "function": "navigateTo", "args": { "route": "/dashboard" } }

NUNCA uses markdown, NUNCA agregues explicaciones fuera del JSON. SOLO JSON.`;

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

  /* Dictation flow - START */
  if (
    t.includes("nueva aclaración") ||
    t.includes("nueva aclaracion") ||
    t.includes("hacer una aclaración") ||
    t.includes("hacer una aclaracion") ||
    t.includes("quiero aclarar") ||
    t.includes("declaración nueva") ||
    t.includes("declaracion nueva") ||
    t.includes("nuevo comunicado")
  ) {
    return { function: "dictateStatement", args: { mode: "start" } };
  }

  /* Dictation flow - FINISH */
  if (
    t === "terminar" ||
    t === "listo" ||
    t === "eso es todo" ||
    t === "ya está" ||
    t === "ya esta" ||
    t.includes("finalizar dictado")
  ) {
    return { function: "dictateStatement", args: { mode: "finish" } };
  }

  /* Confirmation - PUBLISH */
  if (
    (t.includes("sí") || t.includes("si") || t.includes("correcto") || t.includes("publicar")) &&
    (t.includes("publicar") || t.includes("confirmar") || t.length < 15)
  ) {
    const platforms = [];
    if (t.includes("twitter")) platforms.push("twitter");
    if (t.includes("instagram")) platforms.push("instagram");
    if (t.includes("facebook")) platforms.push("facebook");
    if (t.includes("linkedin")) platforms.push("linkedin");
    
    // Si no especifica, publicar en todas
    if (platforms.length === 0) {
      platforms.push("twitter", "instagram", "facebook");
    }

    return { 
      function: "confirmAndPublish", 
      args: { platforms, confirmed: true } 
    };
  }

  /* Confirmation - REJECT */
  if (
    t.includes("no") && (t.includes("incorrecto") || t.includes("mal") || t.includes("rehacer") || t.includes("otra vez")) ||
    t === "no" ||
    t.includes("cancelar") ||
    t.includes("descartar")
  ) {
    return { 
      function: "confirmAndPublish", 
      args: { platforms: [], confirmed: false } 
    };
  }

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
    "editor": "/dashboard/new",
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
        text: "Sistema de lectura en voz alta de ClarifyPro activado.",
      },
    };
  }

  /* Draft / redactar intent (traditional way, not dictation) */
  if (
    (t.includes("redact") ||
    t.includes("escrib") ||
    t.includes("borrador") ||
    t.includes("comunicado")) &&
    !t.includes("nueva") &&
    !t.includes("quiero")
  ) {
    return {
      function: "createDraft",
      args: {
        content: `Comunicado oficial: ${transcript}`,
        tone: "profesional",
      },
    };
  }

  /* IF IN DICTATION MODE - treat everything as append */
  // This will be handled by checking localStorage in the client
  // But for safety, if nothing else matches and it's a long sentence, append it
  if (t.length > 20 && !t.includes("?")) {
    return {
      function: "dictateStatement",
      args: { mode: "append", content: transcript },
    };
  }

  /* Fallback reply */
  return {
    function: "reply",
    args: {
      text: `Escuché: "${transcript}". Di "nueva aclaración" para dictar, o "dashboard" para navegar.`,
    },
  };
}
