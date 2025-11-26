'use client';

import React, { useState } from 'react';

import { Play, Pause, X, BookOpen, AirVent, AlertTriangle, Heart, Settings } from 'lucide-react';

// ✅ Definimos las secciones de capacitación específicas para Calidad del Aire
const secciones = [
  {
    titulo: "¿Qué son los Contaminantes?",
    descripcion: "Aprende sobre los diferentes tipos de contaminantes que medimos.",
    icon: AirVent,
    detalles: [
      "PM2.5: Partículas muy pequeñas (2.5 micrómetros) que pueden entrar profundamente en los pulmones. Provienen de vehículos, industrias y quema de combustibles.",
      "PM10: Partículas más grandes (10 micrómetros) que afectan las vías respiratorias superiores. Provienen de polvo, construcción y actividades industriales.",
      "NO₂ (Dióxido de Nitrógeno): Gas tóxico de color rojizo que irrita el sistema respiratorio. Principalmente de vehículos y fábricas.",
      "O₃ (Ozono): Gas que protege en la atmósfera alta pero es dañino a nivel del suelo. Se forma por reacción de contaminantes con la luz solar.",
      "SO₂ (Dióxido de Azufre): Gas que afecta respiratorio y causa lluvia ácida. De industrias y quema de combustibles fósiles.",
    ],
  },
  {
    titulo: "Niveles de Calidad del Aire",
    descripcion: "Entiende qué significa cada color en nuestro sistema.",
    icon: AlertTriangle,
    detalles: [
      "🟢 VERDE (0-50): CALIDAD BUENA - Aire satisfactorio, riesgo mínimo. Actividades normales al aire libre.",
      "🟡 AMARILLO (51-100): CALIDAD MODERADA - Calidad aceptable. Personas sensibles deben considerar reducir actividades intensas.",
      "🔴 ROJO (101-500): CALIDAD NO SALUDABLE - Todos pueden sentir efectos. Evitar actividades prolongadas al aire libre.",
    ],
  },
  {
    titulo: "Recomendaciones de Salud",
    descripcion: "Cómo protegerte según los niveles de contaminación.",
    icon: Heart,
    detalles: [
      "🟢 EN VERDE: Disfruta actividades normales al aire libre sin preocupaciones. Ideal para ejercicio y recreación.",
      "🟡 EN AMARILLO: Personas con asma, niños y adultos mayores deben tomar precauciones. Reducir ejercicio intenso al aire libre.",
      "🔴 EN ROJO: Todos deben reducir actividades al aire libre. Usar mascarilla, ventilar espacios cerrados y evitar ejercicio exterior.",
    ],
  },
  {
    titulo: "Cómo Usar el Sistema",
    descripcion: "Guía rápida para navegar en la plataforma.",
    icon: Settings,
    detalles: [
      "BARRA DE BÚSQUEDA: Escribe tu ciudad o código postal para ver la calidad del aire en tu zona.",
      "BOTONES DE VISTA: Cambia entre 'Estado Actual' y 'Predicciones' según lo que necesites.",
      "GRÁFICA AQI: El círculo grande muestra el índice general de calidad del aire actual.",
      "CONTAMINANTES: Revisa los niveles específicos de cada contaminante con sus barras de progreso.",
      "PREDICCIONES: Consulta cómo estará la calidad del aire en las próximas horas y días.",
    ],
  },
];

export default function CapacitacionIA() {
  const [selected, setSelected] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [speaking, setSpeaking] = useState(false);

  // ✅ Función de voz IA (más lenta y clara)
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-MX';
      utterance.rate = 0.9; // más despacio
      utterance.pitch = 1;
      utterance.onend = () => setSpeaking(false);
      setSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const nextStep = () => {
    if (selected && currentStep < selected.detalles.length - 1) {
      setCurrentStep(currentStep + 1);
      speakText(selected.detalles[currentStep + 1]);
    }
  };

  const prevStep = () => {
    if (selected && currentStep > 0) {
      setCurrentStep(currentStep - 1);
      speakText(selected.detalles[currentStep - 1]);
    }
  };

  const openSeccion = (sec) => {
    setSelected(sec);
    setCurrentStep(0);
    speakText(sec.detalles[0]);
  };

  const closeModal = () => {
    setSelected(null);
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      
      {/* CONTENIDO PRINCIPAL - OCUPA TODO EL ESPACIO DISPONIBLE */}
      <main className="min-h-[calc(100vh-140px)] w-full flex flex-col items-center py-8 px-4 md:px-8">
        
        {/* Título con icono */}
        <div className="text-center mb-12 w-full max-w-6xl">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Capacitación - Calidad del Aire
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mt-3 max-w-3xl mx-auto">
                Aprende sobre contaminantes, niveles de calidad del aire y cómo usar nuestro sistema
              </p>
            </div>
          </div>
        </div>

        {/* Tarjetas - Grid responsivo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl mb-12">
          {secciones.map((sec, idx) => {
            const IconComponent = sec.icon;
            return (
              <div
                key={idx}
                onClick={() => openSeccion(sec)}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 group h-full min-h-[200px] flex flex-col justify-center"
              >
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors flex-shrink-0">
                    <IconComponent className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{sec.titulo}</h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">{sec.descripcion}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Información adicional */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 w-full max-w-6xl">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            💡 Datos Importantes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-base text-gray-600 dark:text-gray-300">
            <div className="space-y-3">
              <p><strong className="text-green-600">PM2.5:</strong> Partículas finas que penetran profundamente en los pulmones</p>
              <p><strong className="text-yellow-600">PM10:</strong> Partículas que afectan vías respiratorias superiores</p>
            </div>
            <div className="space-y-3">
              <p><strong className="text-orange-600">NO₂:</strong> Gas que causa irritación respiratoria</p>
              <p><strong className="text-blue-600">O₃:</strong> Ozono a nivel del suelo, dañino para la salud</p>
            </div>
            <div className="space-y-3">
              <p><strong className="text-purple-600">AQI:</strong> Índice que combina todos los contaminantes</p>
              <p><strong className="text-gray-600">Colores:</strong> Guía visual rápida para tomar decisiones</p>
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          ></div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-11/12 max-w-2xl shadow-2xl relative z-10 flex flex-col gap-6 max-h-[80vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              onClick={closeModal}
            >
              <X size={28} />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                {React.createElement(selected.icon, { className: "w-6 h-6 text-blue-600 dark:text-blue-400" })}
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{selected.titulo}</h2>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-6">
              <p className="text-gray-700 dark:text-gray-300 text-xl leading-relaxed">
                {selected.detalles[currentStep]}
              </p>
            </div>

            {/* Botones navegación */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center gap-2 text-lg"
              >
                ← Anterior
              </button>

              <div className="flex items-center gap-6">
                <span className="text-gray-500 dark:text-gray-400 text-lg">
                  {currentStep + 1} de {selected.detalles.length}
                </span>
                
                {/* Botón de voz IA */}
                {speaking ? (
                  <button
                    onClick={() => window.speechSynthesis.cancel()}
                    className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 transition flex items-center gap-2 text-lg"
                  >
                    <Pause size={20} /> Detener
                  </button>
                ) : (
                  <button
                    onClick={() => speakText(selected.detalles[currentStep])}
                    className="bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 transition flex items-center gap-2 text-lg"
                  >
                    <Play size={20} /> Escuchar
                  </button>
                )}
              </div>

              <button
                onClick={nextStep}
                disabled={currentStep === selected.detalles.length - 1}
                className="bg-blue-500 text-white px-6 py-3 rounded-xl disabled:opacity-50 hover:bg-blue-600 transition flex items-center gap-2 text-lg"
              >
                Siguiente →
              </button>
            </div>

            {/* Indicador de progreso */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mt-6">
              <div 
                className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / selected.detalles.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}