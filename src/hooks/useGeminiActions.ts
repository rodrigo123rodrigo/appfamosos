"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

/* ── Types ────────────────────────────────────────────────── */

export interface ActionResult {
  ok: boolean;
  action: string;
  message: string;
}

export type ActionFn = (...args: any[]) => ActionResult | Promise<ActionResult>;

export interface ActionMap {
  [name: string]: ActionFn;
}

/* ── Tool definitions exposed to Gemini ───────────────────── */

export const toolDefinitions = [
  {
    name: "navigateTo",
    description:
      "Navega a una ruta dentro de la aplicación. Rutas disponibles: /, /dashboard, /clarifications, /categories, /verified, /media, /login, /signup, /demo, /pricing, /dashboard/new, /dashboard/metrics, /dashboard/press-kit, /dashboard/rumors, /dashboard/statements, /help, /contact, /docs, /privacy, /terms, /security, /api",
    parameters: {
      type: "object",
      properties: {
        route: {
          type: "string",
          description: "Ruta de la aplicación a la que navegar.",
        },
      },
      required: ["route"],
    },
  },
  {
    name: "createDraft",
    description:
      "Crea un borrador de aclaración y navega al editor. El asistente genera el texto con tono profesional y defensivo.",
    parameters: {
      type: "object",
      properties: {
        content: {
          type: "string",
          description: "Texto del borrador de aclaración.",
        },
        tone: {
          type: "string",
          enum: ["profesional", "defensivo", "neutral", "urgente"],
          description: "Tono del comunicado.",
        },
      },
      required: ["content", "tone"],
    },
  },
  {
    name: "dictateStatement",
    description:
      "Inicia el proceso de dictado de una nueva aclaración. El usuario dictará el contenido y el sistema lo escribirá.",
    parameters: {
      type: "object",
      properties: {
        mode: {
          type: "string",
          enum: ["start", "append", "finish"],
          description: "Modo: start (iniciar nuevo), append (agregar más), finish (terminar y confirmar)",
        },
        content: {
          type: "string",
          description: "Contenido dictado por el usuario (cuando mode es append o finish)",
        },
      },
      required: ["mode"],
    },
  },
  {
    name: "confirmAndPublish",
    description:
      "Confirma el contenido dictado y lo publica en las redes sociales conectadas.",
    parameters: {
      type: "object",
      properties: {
        platforms: {
          type: "array",
          items: { type: "string" },
          description: "Plataformas donde publicar: twitter, instagram, facebook, linkedin",
        },
        confirmed: {
          type: "boolean",
          description: "Si el usuario confirmó que el contenido es correcto",
        },
      },
      required: ["platforms", "confirmed"],
    },
  },
  {
    name: "readAloud",
    description:
      "Lee en voz alta un texto usando TTS (Text-to-Speech) del navegador.",
    parameters: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "Texto que se leerá en voz alta.",
        },
      },
      required: ["text"],
    },
  },
  {
    name: "togglePrivacy",
    description:
      "Activa o desactiva el modo incógnito / privacidad del usuario.",
    parameters: {
      type: "object",
      properties: {
        enabled: {
          type: "boolean",
          description: "true para activar modo privado, false para desactivar.",
        },
      },
      required: ["enabled"],
    },
  },
];

/* ── Hook ─────────────────────────────────────────────────── */

export default function useGeminiActions() {
  const router = useRouter();

  /* 1. navigateTo ─────────────────────────────────────────── */
  const navigateTo = useCallback(
    (route: string): ActionResult => {
      const allowed = [
        "/",
        "/dashboard",
        "/clarifications",
        "/categories",
        "/verified",
        "/media",
        "/login",
        "/signup",
        "/demo",
        "/pricing",
        "/dashboard/new",
        "/dashboard/metrics",
        "/dashboard/press-kit",
        "/dashboard/rumors",
        "/dashboard/statements",
        "/help",
        "/contact",
        "/docs",
        "/privacy",
        "/terms",
        "/security",
        "/api",
      ];

      if (!allowed.includes(route)) {
        return {
          ok: false,
          action: "navigateTo",
          message: `Ruta no válida: ${route}`,
        };
      }

      router.push(route);
      return {
        ok: true,
        action: "navigateTo",
        message: `Navegando a ${route}`,
      };
    },
    [router],
  );

  /* 2. createDraft ────────────────────────────────────────── */
  const createDraft = useCallback(
    (content: string, tone: string): ActionResult => {
      // Persist draft in localStorage so it survives tab/browser close
      localStorage.setItem(
        "clarifypro_draft",
        JSON.stringify({ content, tone, createdAt: new Date().toISOString() }),
      );
      router.push("/dashboard/new");
      return {
        ok: true,
        action: "createDraft",
        message: `Borrador creado con tono "${tone}". Abriendo editor…`,
      };
    },
    [router],
  );

  /* 3. readAloud (TTS) ────────────────────────────────────── */
  const readAloud = useCallback((text: string): ActionResult => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      return {
        ok: false,
        action: "readAloud",
        message: "TTS no disponible en este navegador.",
      };
    }
    window.speechSynthesis.cancel(); // stop anything already playing
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-MX";
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
    return {
      ok: true,
      action: "readAloud",
      message: "Leyendo en voz alta…",
    };
  }, []);

  /* 4. togglePrivacy ──────────────────────────────────────── */
  const togglePrivacy = useCallback((enabled: boolean): ActionResult => {
    localStorage.setItem("clarifypro_privacy", JSON.stringify(enabled));
    // dispatch a custom event so other components can react
    window.dispatchEvent(
      new CustomEvent("clarifypro:privacy", { detail: { enabled } }),
    );
    return {
      ok: true,
      action: "togglePrivacy",
      message: enabled
        ? "Modo incógnito activado."
        : "Modo incógnito desactivado.",
    };
  }, []);

  /* 5. dictateStatement ───────────────────────────────────── */
  const dictateStatement = useCallback((mode: string, content?: string): ActionResult => {
    const currentDraft = localStorage.getItem("clarifypro_dictation");
    
    if (mode === "start") {
      localStorage.setItem("clarifypro_dictation", JSON.stringify({
        content: "",
        startedAt: new Date().toISOString(),
        mode: "dictating"
      }));
      return {
        ok: true,
        action: "dictateStatement",
        message: "Perfecto, estoy escuchando. Dicta tu aclaración.",
      };
    }

    if (mode === "append" && content) {
      const draft = currentDraft ? JSON.parse(currentDraft) : { content: "" };
      draft.content += (draft.content ? " " : "") + content;
      localStorage.setItem("clarifypro_dictation", JSON.stringify(draft));
      return {
        ok: true,
        action: "dictateStatement",
        message: "Agregado. Continúa dictando o di 'terminar' cuando acabes.",
      };
    }

    if (mode === "finish") {
      const draft = currentDraft ? JSON.parse(currentDraft) : { content: "" };
      const finalContent = content ? draft.content + " " + content : draft.content;
      
      localStorage.setItem("clarifypro_final_draft", JSON.stringify({
        content: finalContent,
        createdAt: new Date().toISOString(),
        tone: "profesional"
      }));
      localStorage.removeItem("clarifypro_dictation");
      
      // Disparar evento para que VoiceCommander lea el contenido
      window.dispatchEvent(
        new CustomEvent("clarifypro:readback", { detail: { content: finalContent } }),
      );
      
      return {
        ok: true,
        action: "dictateStatement",
        message: `He escrito: "${finalContent}". ¿Es correcto? Di "publicar" para confirmar o "rehacer" para empezar de nuevo.`,
      };
    }

    return {
      ok: false,
      action: "dictateStatement",
      message: "Modo no válido para dictateStatement",
    };
  }, []);

  /* 6. confirmAndPublish ──────────────────────────────────── */
  const confirmAndPublish = useCallback(async (platforms: string[], confirmed: boolean): Promise<ActionResult> => {
    if (!confirmed) {
      localStorage.removeItem("clarifypro_final_draft");
      return {
        ok: true,
        action: "confirmAndPublish",
        message: "Borrador descartado. Di 'nueva aclaración' para empezar de nuevo.",
      };
    }

    const draftData = localStorage.getItem("clarifypro_final_draft");
    if (!draftData) {
      return {
        ok: false,
        action: "confirmAndPublish",
        message: "No hay borrador para publicar.",
      };
    }

    const draft = JSON.parse(draftData);
    
    // Guardar para publicación
    localStorage.setItem("clarifypro_publish_queue", JSON.stringify({
      content: draft.content,
      platforms: platforms.length > 0 ? platforms : ["twitter", "instagram"],
      scheduledAt: new Date().toISOString()
    }));

    // Disparar evento de publicación
    window.dispatchEvent(
      new CustomEvent("clarifypro:publish", { 
        detail: { 
          content: draft.content, 
          platforms: platforms.length > 0 ? platforms : ["twitter", "instagram"]
        } 
      }),
    );

    localStorage.removeItem("clarifypro_final_draft");
    
    return {
      ok: true,
      action: "confirmAndPublish",
      message: `¡Perfecto! Publicando en ${platforms.join(", ")}. Tu aclaración se está compartiendo ahora.`,
    };
  }, []);

  /* ── Action map for the dispatcher ──────────────────────── */
  const actions: ActionMap = useMemo(
    () => ({
      navigateTo: (args: { route: string }) => navigateTo(args.route),
      createDraft: (args: { content: string; tone: string }) =>
        createDraft(args.content, args.tone),
      readAloud: (args: { text: string }) => readAloud(args.text),
      togglePrivacy: (args: { enabled: boolean }) =>
        togglePrivacy(args.enabled),
      dictateStatement: (args: { mode: string; content?: string }) =>
        dictateStatement(args.mode, args.content),
      confirmAndPublish: (args: { platforms: string[]; confirmed: boolean }) =>
        confirmAndPublish(args.platforms, args.confirmed),
    }),
    [navigateTo, createDraft, readAloud, togglePrivacy, dictateStatement, confirmAndPublish],
  );

  /** Dispatch a Gemini function-call result */
  const dispatch = useCallback(
    (functionName: string, args: Record<string, any>): ActionResult => {
      const fn = actions[functionName];
      if (!fn) {
        return {
          ok: false,
          action: functionName,
          message: `Acción desconocida: ${functionName}`,
        };
      }
      return fn(args) as ActionResult;
    },
    [actions],
  );

  return { actions, dispatch, toolDefinitions };
}
