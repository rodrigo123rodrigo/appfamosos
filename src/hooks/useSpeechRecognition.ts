"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type SpeechStatus = "idle" | "listening" | "error";

interface UseSpeechRecognitionReturn {
  status: SpeechStatus;
  transcript: string;
  start: () => void;
  stop: () => void;
  supported: boolean;
}

export default function useSpeechRecognition(
  lang = "en-US", // 🇺🇸 Por defecto inglés para el mercado de USA
): UseSpeechRecognitionReturn {
  const [status, setStatus] = useState<SpeechStatus>("idle");
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  const supported =
    typeof window !== "undefined" &&
    !!(
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    );

  const getRecognition = useCallback(() => {
    if (recognitionRef.current) return recognitionRef.current;
    if (!supported) return null;

    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition: any = new SR();

    // CONFIGURACIÓN PROFESIONAL
    recognition.continuous = true;    // Se detiene al detectar silencio (Modo Live)
    recognition.interimResults = true; // Permite ver resultados en tiempo real
    recognition.lang = lang;           // Usa el lenguaje que le pasamos (en-US)
    recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      const text = result[0].transcript;

      if (result.isFinal) {
        setTranscript(text); // 🚀 Esto dispara a Gemini automáticamente
      }
    };

    recognition.onerror = (event: any) => {
      console.error("[SpeechRecognition Error]", event.error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2000);
    };

    recognition.onend = () => {
      setStatus((prev) => (prev === "listening" ? "idle" : prev));
    };

    recognitionRef.current = recognition;
    return recognition;
  }, [lang, supported]);

  const start = useCallback(() => {
    const rec = getRecognition();
    if (!rec) return;
    setTranscript("");
    setStatus("listening");
    try {
      rec.start();
    } catch (e) {
      console.warn("Recognition already started");
    }
  }, [getRecognition]);

  const stop = useCallback(() => {
    const rec = recognitionRef.current;
    if (rec) {
      rec.stop();
    }
    setStatus("idle");
  }, []);

  useEffect(() => () => {
    recognitionRef.current?.abort();
  }, []);

  return { status, transcript, start, stop, supported };
}