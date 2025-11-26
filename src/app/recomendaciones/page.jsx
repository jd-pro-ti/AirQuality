'use client';

import React, { useState, useRef, useEffect } from 'react';

import { Send, User, Bot, Sparkles, Trash2 } from 'lucide-react';

export default function RecomendacionesIA() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "¡Hola! Soy tu asistente de calidad del aire. Puedo ayudarte con recomendaciones personalizadas sobre contaminación, salud y prevención. ¿En qué puedo asistirte hoy?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Simular respuestas de IA
  const simulateAIResponse = (userMessage) => {
    const responses = [
      "Basándome en los datos actuales de calidad del aire, te recomiendo evitar actividades al aire libre durante las horas pico de contaminación (generalmente entre 12pm y 6pm).",
      "Para proteger tu salud respiratoria, considera usar mascarilla cuando los niveles de PM2.5 superen los 35 µg/m³, especialmente si tienes condiciones preexistentes.",
      "Los niveles actuales de ozono están dentro del rango moderado. Es buen momento para ventilar tu hogar por la mañana temprano cuando la contaminación es menor.",
      "He analizado las tendencias recientes y parece que la calidad del aire mejorará durante el fin de semana. Podrías planificar actividades al aire libre para esos días.",
      "Te sugiero instalar purificadores de aire con filtros HEPA en espacios cerrados, especialmente si vives en zonas con alta concentración de partículas PM2.5.",
      "Según los datos históricos, esta época del año suele presentar mayores niveles de polen y contaminantes. Personas alérgicas deben tomar precauciones adicionales.",
      "Recomiendo el uso de la aplicación móvil para recibir alertas en tiempo real cuando la calidad del aire empeore en tu ubicación específica.",
      "Para mejorar la calidad del aire interior, considera tener plantas como potus, palma areca y lengua de tigre que ayudan a purificar el ambiente."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;

    // Agregar mensaje del usuario
    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simular delay de IA
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        text: simulateAIResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: "¡Hola! Soy tu asistente de calidad del aire. Puedo ayudarte con recomendaciones personalizadas sobre contaminación, salud y prevención. ¿En qué puedo asistirte hoy?",
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
  };

  const suggestedQuestions = [
    "¿Cómo protejo mi salud con la calidad del aire actual?",
    "Recomendaciones para hacer ejercicio hoy",
    "¿Es seguro ventilar mi casa?",
    "Consejos para personas con asma"
  ];

  const handleSuggestionClick = (question) => {
    setInputMessage(question);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">

      
      <main className="min-h-[calc(100vh-140px)] w-full flex flex-col items-center py-8 px-4 md:px-8">
        
        {/* Encabezado */}
        <div className="text-center mb-8 w-full max-w-4xl">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                Asistente IA - Calidad del Aire
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mt-3">
                Obtén recomendaciones personalizadas basadas en datos en tiempo real
              </p>
            </div>
          </div>
        </div>

        {/* Contenedor principal del chat */}
        <div className="flex flex-col w-full max-w-4xl h-[600px] bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          
          {/* Header del chat */}
          <div className="bg-white dark:bg-gray-800 px-6 py-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-gray-900 dark:text-white font-semibold text-lg">Asistente de Calidad del Aire</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">En línea • Basado en datos en tiempo real</p>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Limpiar conversación"
            >
              <Trash2 size={20} />
            </button>
          </div>

          {/* Área de mensajes */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50 dark:bg-gray-900/30">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${
                  message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Avatar */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  message.sender === 'user' 
                    ? 'bg-blue-600' 
                    : 'bg-gray-600'
                }`}>
                  {message.sender === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>

                {/* Mensaje */}
                <div className={`max-w-[70%] ${
                  message.sender === 'user' ? 'text-right' : 'text-left'
                }`}>
                  <div className={`inline-block px-4 py-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
                  } shadow-sm`}>
                    <p className="text-lg leading-relaxed">{message.text}</p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                    {message.timestamp.toLocaleTimeString('es-MX', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            ))}

            {/* Mensaje de carga */}
            {isLoading && (
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gray-600">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="max-w-[70%]">
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Preguntas sugeridas */}
          {messages.length === 1 && (
            <div className="px-6 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Preguntas sugeridas:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(question)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input de mensaje */}
          <form onSubmit={handleSendMessage} className="p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-4">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Escribe tu pregunta sobre calidad del aire..."
                className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-lg"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
              >
                <Send size={20} />
                <span className="hidden sm:inline">Enviar</span>
              </button>
            </div>
          </form>
        </div>

        {/* Información adicional */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Basado en Datos Reales</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Analiza información en tiempo real de estaciones de monitoreo</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
              <User className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Recomendaciones Personalizadas</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Sugerencias adaptadas a tu ubicación y perfil de salud</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 text-center">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Bot className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">IA Especializada</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Algoritmos entrenados específicamente en calidad del aire</p>
          </div>
        </div>
      </main>

    </div>
  );
}