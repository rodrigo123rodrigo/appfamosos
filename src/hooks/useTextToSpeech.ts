"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface TextToSpeechOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: string;
}

interface UseTextToSpeechReturn {
  speak: (text: string, options?: TextToSpeechOptions) => Promise<void>;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  isSpeaking: boolean;
  isPaused: boolean;
  supported: boolean;
  voices: SpeechSynthesisVoice[];
}

export default function useTextToSpeech(): UseTextToSpeechReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const supported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  // Cargar voces disponibles
  useEffect(() => {
    if (!supported) return;

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [supported]);

  const speak = useCallback(
    async (text: string, options?: TextToSpeechOptions): Promise<void> => {
      if (!supported) {
        console.warn("Text-to-Speech no soportado en este navegador");
        return;
      }

      return new Promise((resolve, reject) => {
        // Cancelar cualquier audio en progreso
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utteranceRef.current = utterance;

        // Configuración
        utterance.lang = options?.lang || "es-MX";
        utterance.rate = options?.rate || 1.1;
        utterance.pitch = options?.pitch || 1;
        utterance.volume = options?.volume || 1;

        // Intentar encontrar una voz específica
        if (options?.voice) {
          const selectedVoice = voices.find(
            (v) => v.name.toLowerCase().includes(options.voice!.toLowerCase())
          );
          if (selectedVoice) utterance.voice = selectedVoice;
        } else {
          // Intentar encontrar una voz en español
          const spanishVoice = voices.find(
            (v) => v.lang.startsWith("es")
          );
          if (spanishVoice) utterance.voice = spanishVoice;
        }

        // Eventos
        utterance.onstart = () => {
          setIsSpeaking(true);
          setIsPaused(false);
        };

        utterance.onend = () => {
          setIsSpeaking(false);
          setIsPaused(false);
          resolve();
        };

        utterance.onerror = (event) => {
          setIsSpeaking(false);
          setIsPaused(false);
          console.error("Error en TTS:", event);
          reject(event);
        };

        utterance.onpause = () => {
          setIsPaused(true);
        };

        utterance.onresume = () => {
          setIsPaused(false);
        };

        // Hablar
        window.speechSynthesis.speak(utterance);
      });
    },
    [supported, voices]
  );

  const stop = useCallback(() => {
    if (supported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  }, [supported]);

  const pause = useCallback(() => {
    if (supported && isSpeaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [supported, isSpeaking]);

  const resume = useCallback(() => {
    if (supported && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, [supported, isPaused]);

  return {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    isPaused,
    supported,
    voices,
  };
}
