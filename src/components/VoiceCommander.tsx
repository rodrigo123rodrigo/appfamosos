"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import useGeminiActions, { ActionResult } from "../hooks/useGeminiActions";
import useSpeechRecognition from "../hooks/useSpeechRecognition";
import useTextToSpeech from "../hooks/useTextToSpeech";
import useWakeWord from "../hooks/useWakeWord";
import { socialMediaService } from "../services/socialMediaService";

type Phase = 
  | "sleeping"      // Esperando wake word
  | "idle"          // Despierto, esperando comando
  | "listening"     // Escuchando comando
  | "dictating"     // Modo dictado activo
  | "processing"    // Procesando con Gemini
  | "confirming"    // Esperando confirmación
  | "speaking"      // Hablando (TTS)
  | "publishing"    // Publicando en redes
  | "success"
  | "error";

export default function VoiceCommander() {
  const [phase, setPhase] = useState<Phase>("sleeping");
  const [feedback, setFeedback] = useState("");
  const [showPanel, setShowPanel] = useState(false);
  const [dictatedContent, setDictatedContent] = useState("");
  const [publishPlatforms, setPublishPlatforms] = useState<string[]>([]);
  const [history, setHistory] = useState<
    { role: "user" | "assistant"; text: string; timestamp: Date }[]
  >([]);

  const { dispatch } = useGeminiActions();
  const { status, transcript, start, stop, supported } =
    useSpeechRecognition("es-MX");
  const { speak, stop: stopSpeaking, isSpeaking } = useTextToSpeech();
  
  const {
    isListening: wakeWordActive,
    startListening: startWakeWord,
    stopListening: stopWakeWord,
    detectedWord,
  } = useWakeWord({
    wakeWords: ["hey clarify", "oye clarify", "clarify", "ok clarify"],
    lang: "es-MX",
    sensitivity: 0.65,
  });

  const prevTranscript = useRef("");
  const isDictating = useRef(false);

  /* ── Wake word detection ────────────────────────────────── */
  useEffect(() => {
    if (detectedWord && phase === "sleeping") {
      console.log("[VoiceCommander] Wake word detected:", detectedWord);
      setPhase("idle");
      speak("¿En qué puedo ayudarte?", { rate: 1.15 }).then(() => {
        start(); // Iniciar reconocimiento de voz
      });
      addHistory("assistant", "Sistema activado. ¿Qué necesitas?");
    }
  }, [detectedWord, phase, speak, start]);

  /* ── React to speech status ─────────────────────────────── */
  useEffect(() => {
    if (status === "listening" && phase !== "dictating") {
      setPhase("listening");
    }
    if (status === "error") {
      setPhase("error");
      setFeedback("No pude escuchar. Intenta de nuevo.");
      speak("No pude escuchar. Intenta de nuevo.");
      setTimeout(() => setPhase("idle"), 2500);
    }
  }, [status, phase, speak]);

  /* ── React to TTS speaking ──────────────────────────────── */
  useEffect(() => {
    if (isSpeaking && phase !== "processing" && phase !== "publishing") {
      setPhase("speaking");
    }
  }, [isSpeaking, phase]);

  /* ── Handle custom events ───────────────────────────────── */
  useEffect(() => {
    const handleReadback = async (e: CustomEvent) => {
      const { content } = e.detail;
      setDictatedContent(content);
      setPhase("confirming");
      
      await speak(`He escrito lo siguiente: ${content}. ¿Es correcto? Di "publicar" para confirmar o "no" para descartar.`, {
        rate: 1.1
      });
      
      setPhase("idle");
      start(); // Esperar respuesta
    };

    const handlePublish = async (e: CustomEvent) => {
      const { content, platforms } = e.detail;
      setPhase("publishing");
      setFeedback(`Publicando en ${platforms.join(", ")}...`);
      
      try {
        const results = await socialMediaService.publish({
          content,
          platforms,
        });

        const successCount = results.filter(r => r.success).length;
        const message = `¡Listo! Publicado exitosamente en ${successCount} plataforma${successCount > 1 ? "s" : ""}.`;
        
        setPhase("success");
        setFeedback(message);
        addHistory("assistant", message);
        await speak(message, { rate: 1.15 });
        
        setTimeout(() => setPhase("sleeping"), 4000);
      } catch (error) {
        setPhase("error");
        const errorMsg = "Error al publicar. Intenta nuevamente.";
        setFeedback(errorMsg);
        await speak(errorMsg);
        setTimeout(() => setPhase("idle"), 3000);
      }
    };

    window.addEventListener("clarifypro:readback", handleReadback as EventListener);
    window.addEventListener("clarifypro:publish", handlePublish as EventListener);

    return () => {
      window.removeEventListener("clarifypro:readback", handleReadback as EventListener);
      window.removeEventListener("clarifypro:publish", handlePublish as EventListener);
    };
  }, [speak, start]);

  /* ── When transcript arrives, send to Gemini ────────────── */
  useEffect(() => {
    if (!transcript || transcript === prevTranscript.current) return;
    prevTranscript.current = transcript;

    addHistory("user", transcript);
    
    // Check if we're in dictating mode
    const dictationData = localStorage.getItem("clarifypro_dictation");
    if (dictationData) {
      isDictating.current = true;
      setPhase("dictating");
    }

    processTranscript(transcript);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript]);

  const addHistory = (role: "user" | "assistant", text: string) => {
    setHistory((h) => [...h, { role, text, timestamp: new Date() }]);
  };

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
          await speak(data.error);
          addHistory("assistant", `Error: ${data.error}`);
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
          await speak(replyText, { rate: 1.15 });
          addHistory("assistant", replyText);
          setTimeout(() => setPhase("idle"), 2000);
          return;
        }

        /* If starting dictation */
        if (fnName === "dictateStatement" && args.mode === "start") {
          isDictating.current = true;
          setPhase("dictating");
          setDictatedContent("");
          const message = "Perfecto, estoy escuchando. Dicta tu aclaración.";
          setFeedback(message);
          await speak(message, { rate: 1.15 });
          addHistory("assistant", message);
          start(); // Continuar escuchando
          return;
        }

        /* If appending to dictation */
        if (fnName === "dictateStatement" && args.mode === "append") {
          const content = args.content || "";
          setDictatedContent(prev => prev + (prev ? " " : "") + content);
          setPhase("dictating");
          const message = "Continúa...";
          setFeedback(message);
          start(); // Continuar escuchando sin hablar
          return;
        }

        /* If finishing dictation */
        if (fnName === "dictateStatement" && args.mode === "finish") {
          isDictating.current = false;
          // El resto lo maneja el evento clarifypro:readback
        }

        /* Execute the action */
        const result: ActionResult = dispatch(fnName, args);

        setPhase(result.ok ? "success" : "error");
        setFeedback(result.message);
        await speak(result.message, { rate: 1.15 });
        addHistory("assistant", result.message);
        
        setTimeout(() => {
          setPhase("sleeping");
          stopWakeWord();
          setTimeout(() => startWakeWord(), 1000);
        }, 3000);
      } catch (err: any) {
        setPhase("error");
        const errorMsg = "Error de conexión.";
        setFeedback(errorMsg);
        await speak(errorMsg);
        setTimeout(() => setPhase("idle"), 3000);
      }
    },
    [dispatch, speak, start, stopWakeWord, startWakeWord],
  );

  /* ── Toggle microphone ──────────────────────────────────── */
  const toggleMic = () => {
    if (phase === "sleeping") {
      // Activar manualmente
      setPhase("idle");
      speak("Sistema activado. ¿Qué necesitas?", { rate: 1.15 });
      start();
    } else if (phase === "listening" || phase === "dictating") {
      stop();
      stopSpeaking();
      setPhase("idle");
    } else if (phase === "idle" || phase === "success" || phase === "error") {
      start();
    }
  };

  /* ── Initialize wake word on mount ──────────────────────── */
  useEffect(() => {
    if (supported) {
      console.log("[VoiceCommander] Iniciando wake word detection...");
      startWakeWord();
    }

    return () => {
      stopWakeWord();
      stop();
      stopSpeaking();
    };
  }, [supported, startWakeWord, stopWakeWord, stop, stopSpeaking]);

  /* ── Render ─────────────────────────────────────────────── */

  const phaseColors: Record<Phase, string> = {
    sleeping: "bg-[#2D3748] border-2 border-[#C0C5CE]",
    idle: "bg-gradient-to-br from-[#D4A574] to-[#F7E7CE]",
    listening: "bg-[#D4A574] shadow-[0_0_20px_rgba(212,165,116,0.6)]",
    dictating: "bg-[#2D8659] animate-pulse shadow-[0_0_20px_rgba(45,134,89,0.6)]",
    processing: "bg-[#1A2332] animate-spin-slow border-2 border-[#D4A574]",
    confirming: "bg-[#D4A574] shadow-[0_0_20px_rgba(212,165,116,0.8)]",
    speaking: "bg-gradient-to-br from-[#1A2332] to-[#2D3748] border-2 border-[#D4A574]",
    publishing: "bg-gradient-to-br from-[#2D8659] to-[#D4A574] animate-spin-slow",
    success: "bg-[#2D8659]",
    error: "bg-[#A73636]",
  };

  const phaseIcons: Record<Phase, React.ReactNode> = {
    sleeping: <SleepIcon />,
    idle: <MicIcon />,
    listening: <WaveIcon />,
    dictating: <DictateIcon />,
    processing: <SpinnerIcon />,
    confirming: <QuestionIcon />,
    speaking: <SpeakerIcon />,
    publishing: <UploadIcon />,
    success: <CheckIcon />,
    error: <XIcon />,
  };

  const phaseLabels: Record<Phase, string> = {
    sleeping: "Esperando palabra clave...",
    idle: "Listo para escuchar",
    listening: "Escuchando...",
    dictating: "Dictando aclaración...",
    processing: "Procesando...",
    confirming: "Esperando confirmación...",
    speaking: "Hablando...",
    publishing: "Publicando...",
    success: "¡Completado!",
    error: "Error",
  };

  return (
    <>
      {/* ── Feedback toast ────────────────────────────────── */}
      {feedback && phase !== "idle" && phase !== "sleeping" && (
        <div className="fixed bottom-24 right-6 z-[60] max-w-sm rounded-2xl bg-[#1A2332]/95 border border-[#D4A574] px-5 py-4 text-sm text-[#FFFFFF] shadow-[0_8px_24px_rgba(212,165,116,0.3)] backdrop-blur-xl animate-fade-in">
          <div className="font-semibold mb-1 text-[#D4A574]">{phaseLabels[phase]}</div>
          <div className="text-[#E5E9F0]">{feedback}</div>
        </div>
      )}

      {/* ── Dictation content display ─────────────────────── */}
      {isDictating.current && dictatedContent && (
        <div className="fixed bottom-24 left-6 z-[60] max-w-md rounded-2xl bg-[#1A2332]/95 border border-[#2D8659] px-5 py-4 shadow-[0_8px_24px_rgba(45,134,89,0.3)] backdrop-blur-xl animate-fade-in">
          <div className="text-[#2D8659] font-semibold mb-2 flex items-center gap-2">
            <span className="text-lg">📝</span>
            <span>Dictando:</span>
          </div>
          <div className="text-white text-sm leading-relaxed">{dictatedContent}</div>
        </div>
      )}

      {/* ── Conversation panel ────────────────────────────── */}
      {showPanel && (
        <div className="fixed bottom-24 right-6 z-[60] w-96 max-h-[32rem] rounded-2xl bg-[#0F1419] border-2 border-[#D4A574] shadow-[0_16px_48px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden animate-fade-in">
          <div className="px-5 py-4 bg-gradient-to-r from-[#D4A574] to-[#F7E7CE] text-[#0F1419] font-bold flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="text-2xl">🎤</span>
              <span>Voice Commander</span>
            </span>
            <button
              onClick={() => setShowPanel(false)}
              className="text-[#0F1419]/70 hover:text-[#0F1419] text-xl transition"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#1A2332]/40">
            {history.length === 0 && (
              <div className="text-[#C0C5CE] text-sm text-center py-8">
                <p className="font-semibold mb-2">Di la palabra clave:</p>
                <p className="text-[#D4A574] text-lg font-bold">&quot;Hey Clarify&quot;</p>
                <p className="text-[#C0C5CE]/70 mt-2 text-xs">o presiona el botón ↓</p>
              </div>
            )}
            {history.map((msg, i) => (
              <div
                key={i}
                className={`text-sm px-4 py-3 rounded-xl max-w-[85%] shadow-lg backdrop-blur-sm ${
                  msg.role === "user"
                    ? "bg-[#2D3748]/80 border border-[#C0C5CE]/30 text-[#E5E9F0] ml-auto"
                    : "bg-[#D4A574]/20 border border-[#D4A574]/40 text-white mr-auto"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {!supported && (
            <div className="px-4 py-3 bg-[#A73636]/20 border-t border-[#A73636] text-[#FFFFFF] text-xs text-center">
              ⚠️ Tu navegador no soporta reconocimiento de voz. Usa Chrome.
            </div>
          )}

          <div className="px-4 py-3 bg-[#1A2332] border-t border-[#D4A574]/30 text-xs text-[#C0C5CE] text-center">
            Estado: <span className="font-semibold text-[#D4A574]">{phaseLabels[phase]}</span>
          </div>
        </div>
      )}

      {/* ── Floating buttons ──────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-[70] flex flex-col items-center gap-3">
        {/* Panel toggle */}
        <button
          onClick={() => setShowPanel((v) => !v)}
          className="w-10 h-10 rounded-full bg-[#1A2332] border-2 border-[#D4A574] text-[#D4A574] text-lg flex items-center justify-center hover:bg-[#2D3748] hover:scale-110 transition-all shadow-[0_4px_16px_rgba(212,165,116,0.3)]"
          title="Abrir historial de comandos"
        >
          💬
        </button>

        {/* Main mic button */}
        <button
          onClick={toggleMic}
          disabled={phase === "processing" || phase === "publishing"}
          className={`
            w-20 h-20 rounded-full flex items-center justify-center
            text-white shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition-all duration-300
            ${phaseColors[phase]}
            ${phase === "processing" || phase === "publishing" ? "cursor-wait" : "cursor-pointer hover:scale-110 active:scale-95"}
          `}
          title={phaseLabels[phase]}
        >
          {phaseIcons[phase]}
        </button>

        {/* Wake word indicator */}
        {phase === "sleeping" && (
          <div className="text-[#C0C5CE] text-xs text-center max-w-[120px] animate-pulse">
            Di &quot;Hey Clarify&quot;
          </div>
        )}
      </div>
    </>
  );
}

/* ── Inline SVG icons ─────────────────────────────────────── */

function SleepIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
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
      width="32"
      height="32"
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

function DictateIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
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

function QuestionIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" x2="12.01" y1="17" y2="17" />
    </svg>
  );
}

function SpeakerIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
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
      width="32"
      height="32"
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
