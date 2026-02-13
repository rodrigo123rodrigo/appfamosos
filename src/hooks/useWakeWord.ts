"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface WakeWordConfig {
  wakeWords: string[];
  lang?: string;
  sensitivity?: number;
  onWakeWordDetected?: (word: string) => void;
}

interface UseWakeWordReturn {
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  detectedWord: string | null;
  supported: boolean;
}

export default function useWakeWord(
  config: WakeWordConfig
): UseWakeWordReturn {
  const [isListening, setIsListening] = useState(false);
  const [detectedWord, setDetectedWord] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const isProcessingRef = useRef(false);

  const supported =
    typeof window !== "undefined" &&
    !!(
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    );

  const {
    wakeWords = ["hey clarify", "oye clarify", "clarify"],
    lang = "es-MX",
    sensitivity = 0.7,
    onWakeWordDetected,
  } = config;

  const checkForWakeWord = useCallback(
    (transcript: string): string | null => {
      const normalized = transcript.toLowerCase().trim();

      for (const wakeWord of wakeWords) {
        const normalizedWakeWord = wakeWord.toLowerCase();
        
        // Búsqueda exacta
        if (normalized.includes(normalizedWakeWord)) {
          return wakeWord;
        }

        // Búsqueda con tolerancia (similarity)
        const words = normalized.split(/\s+/);
        const wakeWordParts = normalizedWakeWord.split(/\s+/);

        for (let i = 0; i <= words.length - wakeWordParts.length; i++) {
          const segment = words.slice(i, i + wakeWordParts.length).join(" ");
          const similarity = calculateSimilarity(segment, normalizedWakeWord);
          
          if (similarity >= sensitivity) {
            return wakeWord;
          }
        }
      }

      return null;
    },
    [wakeWords, sensitivity]
  );

  const startListening = useCallback(() => {
    if (!supported || isListening) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;

    recognition.onresult = (event: any) => {
      if (isProcessingRef.current) return;

      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript;

      console.log("[WakeWord] Escuchando:", transcript);

      const detected = checkForWakeWord(transcript);
      if (detected && result.isFinal) {
        isProcessingRef.current = true;
        setDetectedWord(detected);
        
        if (onWakeWordDetected) {
          onWakeWordDetected(detected);
        }

        // Reset después de 2 segundos
        setTimeout(() => {
          isProcessingRef.current = false;
          setDetectedWord(null);
        }, 2000);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("[WakeWord Error]", event.error);
      if (event.error === "no-speech" || event.error === "audio-capture") {
        // Reintentar automáticamente
        setTimeout(() => {
          if (isListening) {
            try {
              recognition.start();
            } catch (e) {
              console.warn("Reconocimiento ya iniciado");
            }
          }
        }, 1000);
      }
    };

    recognition.onend = () => {
      if (isListening) {
        // Reiniciar automáticamente para escucha continua
        try {
          recognition.start();
        } catch (e) {
          console.warn("Reconocimiento ya iniciado");
        }
      }
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
      setIsListening(true);
      console.log("[WakeWord] Wake word detection iniciado. Palabras:", wakeWords);
    } catch (e) {
      console.error("[WakeWord] Error al iniciar:", e);
    }
  }, [supported, isListening, lang, wakeWords, checkForWakeWord, onWakeWordDetected]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
    setDetectedWord(null);
    isProcessingRef.current = false;
    console.log("[WakeWord] Wake word detection detenido");
  }, []);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  return {
    isListening,
    startListening,
    stopListening,
    detectedWord,
    supported,
  };
}

// Función auxiliar para calcular similitud entre strings
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

// Distancia de Levenshtein para similitud de strings
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}
