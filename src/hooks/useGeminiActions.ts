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

  /* ── Action map for the dispatcher ──────────────────────── */
  const actions: ActionMap = useMemo(
    () => ({
      navigateTo: (args: { route: string }) => navigateTo(args.route),
      createDraft: (args: { content: string; tone: string }) =>
        createDraft(args.content, args.tone),
      readAloud: (args: { text: string }) => readAloud(args.text),
      togglePrivacy: (args: { enabled: boolean }) =>
        togglePrivacy(args.enabled),
    }),
    [navigateTo, createDraft, readAloud, togglePrivacy],
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
