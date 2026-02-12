"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import useGeminiActions, { ActionResult } from "../hooks/useGeminiActions";
import useSpeechRecognition from "../hooks/useSpeechRecognition";

type Phase = "idle" | "listening" | "processing" | "success" | "error";

export default function VoiceCommander() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [feedback, setFeedback] = useState("");
  const [showPanel, setShowPanel] = useState(false);
  const [history, setHistory] = useState<
    { role: "user" | "assistant"; text: string }[]
  >([]);

  const { dispatch } = useGeminiActions();
  const { status, transcript, start, stop, supported } =
    useSpeechRecognition("es-MX");

  const prevTranscript = useRef("");

  /* ── React to speech status ─────────────────────────────── */
  useEffect(() => {
    if (status === "listening") setPhase("listening");
    if (status === "error") {
      setPhase("error");
      setFeedback("No pude escuchar. Intenta de nuevo.");
      setTimeout(() => setPhase("idle"), 2500);
    }
  }, [status]);

  /* ── When transcript arrives, send to Gemini ────────────── */
  useEffect(() => {
    if (!transcript || transcript === prevTranscript.current) return;
    prevTranscript.current = transcript;

    setHistory((h) => [...h, { role: "user", text: transcript }]);
    processTranscript(transcript);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript]);

  const processTranscript = useCallback(
    async (text: string) => {
      setPhase("processing");
      setFeedback("Procesando…");

      try {
        const res = await fetch("/api/voice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript: text }),
        });

        const data = await res.json();

        if (data.error) {
          setPhase("error");
          setFeedback(data.error);
          setHistory((h) => [
            ...h,
            { role: "assistant", text: `Error: ${data.error}` },
          ]);
          setTimeout(() => setPhase("idle"), 3000);
          return;
        }

        const fnName: string = data.function ?? data.action ?? "";
        const args: Record<string, any> = data.args ?? {};

        /* Special "reply" action → just show the text */
        if (fnName === "reply") {
          const replyText = args.text ?? "Sin respuesta.";
          setPhase("success");
          setFeedback(replyText);
          setHistory((h) => [...h, { role: "assistant", text: replyText }]);
          setTimeout(() => setPhase("idle"), 4000);
          return;
        }

        /* Execute the action */
        const result: ActionResult = dispatch(fnName, args);

        setPhase(result.ok ? "success" : "error");
        setFeedback(result.message);
        setHistory((h) => [...h, { role: "assistant", text: result.message }]);
        setTimeout(() => setPhase("idle"), 3000);
      } catch (err: any) {
        setPhase("error");
        setFeedback("Error de conexión.");
        setTimeout(() => setPhase("idle"), 3000);
      }
    },
    [dispatch],
  );

  /* ── Toggle microphone ──────────────────────────────────── */
  const toggleMic = () => {
    if (phase === "listening") {
      stop();
      setPhase("idle");
    } else if (phase === "idle" || phase === "success" || phase === "error") {
      start();
    }
  };

  /* ── Render ─────────────────────────────────────────────── */

  const phaseColors: Record<Phase, string> = {
    idle: "bg-[#D4AF37]",
    listening: "bg-[#D4AF37] animate-pulse shadow-[0_0_24px_rgba(212,175,55,0.6)]",
    processing: "bg-[#B8941F] animate-spin-slow",
    success: "bg-emerald-500",
    error: "bg-red-500",
  };

  const phaseIcons: Record<Phase, React.ReactNode> = {
    idle: <MicIcon />,
    listening: <WaveIcon />,
    processing: <SpinnerIcon />,
    success: <CheckIcon />,
    error: <XIcon />,
  };

  return (
    <>
      {/* ── Feedback toast ────────────────────────────────── */}
      {feedback && phase !== "idle" && (
        <div className="fixed bottom-24 right-6 z-[60] max-w-xs rounded-xl bg-black/90 px-4 py-3 text-sm text-white shadow-lg backdrop-blur animate-fade-in">
          {feedback}
        </div>
      )}

      {/* ── Conversation panel ────────────────────────────── */}
      {showPanel && (
        <div className="fixed bottom-24 right-6 z-[60] w-80 max-h-96 rounded-2xl bg-white border border-gray-200 shadow-2xl flex flex-col overflow-hidden animate-fade-in">
          <div className="px-4 py-3 bg-[#D4AF37] text-white font-semibold flex items-center justify-between">
            <span>🎙 Voice Commander</span>
            <button
              onClick={() => setShowPanel(false)}
              className="text-white/80 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {history.length === 0 && (
              <p className="text-gray text-sm text-center py-4">
                Presiona el micrófono y di un comando.<br />
                Ej: &quot;Llévame al dashboard&quot;
              </p>
            )}
            {history.map((msg, i) => (
              <div
                key={i}
                className={`text-sm px-3 py-2 rounded-lg max-w-[90%] ${
                  msg.role === "user"
                    ? "bg-[#F0E5C9] text-black ml-auto"
                    : "bg-gray-100 text-black mr-auto"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {!supported && (
            <div className="px-4 py-2 bg-red-50 text-red-700 text-xs text-center">
              Tu navegador no soporta reconocimiento de voz. Usa Chrome.
            </div>
          )}
        </div>
      )}

      {/* ── Floating button ───────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-[70] flex flex-col items-center gap-2">
        {/* Panel toggle */}
        <button
          onClick={() => setShowPanel((v) => !v)}
          className="w-8 h-8 rounded-full bg-black/20 text-white text-xs flex items-center justify-center hover:bg-black/40 transition"
          title="Abrir historial de comandos"
        >
          💬
        </button>

        {/* Main mic button */}
        <button
          onClick={toggleMic}
          disabled={phase === "processing"}
          className={`
            w-16 h-16 rounded-full flex items-center justify-center
            text-white shadow-lg transition-all duration-300
            ${phaseColors[phase]}
            ${phase === "processing" ? "cursor-wait" : "cursor-pointer hover:scale-110 active:scale-95"}
          `}
          title={
            phase === "idle"
              ? "Presiona para hablar"
              : phase === "listening"
                ? "Escuchando…"
                : phase === "processing"
                  ? "Procesando…"
                  : ""
          }
        >
          {phaseIcons[phase]}
        </button>
      </div>
    </>
  );
}

/* ── Inline SVG icons ─────────────────────────────────────── */

function MicIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  );
}

function WaveIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12h2" />
      <path d="M6 8v8" />
      <path d="M10 4v16" />
      <path d="M14 6v12" />
      <path d="M18 8v8" />
      <path d="M22 12h-2" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="animate-spin"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
