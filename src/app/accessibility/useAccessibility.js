'use client';
import { useState, useEffect, useRef } from 'react';

export const useAccessibility = () => {
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [isReading, setIsReading] = useState(false);

  // Usar useRef en lugar de useState (evita el warning de React)
  const speechSynthesisRef = useRef(null);

  useEffect(() => {
    // Inicializar speech synthesis
    speechSynthesisRef.current = window.speechSynthesis;

    // Cargar configuración guardada del localStorage
    const savedFontSize = localStorage.getItem('accessibility-fontSize');
    const savedHighContrast = localStorage.getItem('accessibility-highContrast');

    if (savedFontSize) {
      setFontSize(Number(savedFontSize));
      document.documentElement.style.fontSize = `${savedFontSize}%`;
    }

    if (savedHighContrast === 'true') {
      setHighContrast(true);
      document.documentElement.classList.add('high-contrast');
    }

    // Limpiar al desmontar
    return () => {
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
    };
  }, []);

  const updateFontSize = (newSize) => {
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}%`;
    localStorage.setItem('accessibility-fontSize', newSize.toString());
  };

  const toggleHighContrast = () => {
    const newHighContrast = !highContrast;
    setHighContrast(newHighContrast);

    if (newHighContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    localStorage.setItem('accessibility-highContrast', newHighContrast.toString());
  };

  // Funcionalidad de lectura
  const readPageContent = () => {
    const synth = speechSynthesisRef.current;
    if (!synth) return;

    if (isReading) {
      synth.cancel();
      setIsReading(false);
      return;
    }

    const mainContent = document.querySelector('main');
    if (!mainContent) return;

    const text = mainContent.innerText || mainContent.textContent;
    const cleanText = text
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s¡!¿?.,;:áéíóúÁÉÍÓÚñÑ]/gi, '')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsReading(true);
    utterance.onend = () => setIsReading(false);
    utterance.onerror = () => setIsReading(false);

    synth.speak(utterance);
  };

  const stopReading = () => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
    }
    setIsReading(false);
  };

  const resetAccessibility = () => {
    updateFontSize(100);
    setHighContrast(false);
    document.documentElement.classList.remove('high-contrast');
    stopReading();
    localStorage.removeItem('accessibility-fontSize');
    localStorage.removeItem('accessibility-highContrast');
  };

  return {
    fontSize,
    highContrast,
    isReading,
    updateFontSize,
    toggleHighContrast,
    readPageContent,
    stopReading,
    resetAccessibility
  };
};
