'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, Trash2, MapPin } from 'lucide-react';
import { apiServices } from '@/services/api';

export default function RecomendacionesIA() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "¡Hola! Soy tu asistente de calidad del aire. Puedo ayudarte con recomendaciones personalizadas sobre contaminación, salud y prevención. ¿De qué ciudad te gustaría obtener información?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState('');
  const [cityConfirmed, setCityConfirmed] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Función para obtener recomendaciones de la API
  const getAIRecommendations = async (ciudad, tipoConsulta = 'general') => {
    try {
      let response;
      
      switch (tipoConsulta) {
        case 'contaminantes':
          response = await apiServices.recomendaciones.analizarContaminantes(ciudad);
          return response.analisis || `Análisis de contaminantes para ${ciudad}: No disponible temporalmente.`;
        
        case 'rapidas':
          response = await apiServices.recomendaciones.obtenerRecomendacionesRapidas(ciudad);
          return response.recomendacionPrincipal || `Recomendaciones rápidas para ${ciudad}: Consulta no disponible.`;
        
        case 'general':
        default:
          response = await apiServices.recomendaciones.obtenerRecomendaciones(ciudad);
          return response.recomendaciones || `Recomendaciones para ${ciudad}: No disponibles en este momento.`;
      }
    } catch (error) {
      console.error('Error obteniendo recomendaciones:', error);
      return `Lo siento, hubo un error al obtener datos para ${ciudad}. La ciudad podría no estar en nuestra base de datos o hay un problema de conexión.`;
    }
  };

  // Función para detectar el tipo de consulta del usuario
  const detectQueryType = (message) => {
    const messageLower = message.toLowerCase();
    
    if (messageLower.includes('contaminante') || messageLower.includes('partículas') || 
        messageLower.includes('pm2.5') || messageLower.includes('pm10') || 
        messageLower.includes('análisis') || messageLower.includes('analisis')) {
      return 'contaminantes';
    }
    
    if (messageLower.includes('rápida') || messageLower.includes('rapida') || 
        messageLower.includes('resumen') || messageLower.includes('breve') ||
        messageLower.includes('quick') || messageLower.includes('fast')) {
      return 'rapidas';
    }
    
    return 'general';
  };

  // Función SIMPLIFICADA - acepta cualquier ciudad
  const extractCityFromMessage = (message) => {
    // Si el mensaje es corto (probablemente solo el nombre de una ciudad)
    if (message.trim().split(' ').length <= 4 && message.length <= 30) {
      return message.trim();
    }
    
    // Buscar patrones comunes de mención de ciudad
    const cityPatterns = [
      /(?:en|para|de|sobre)\s+([^,.!?]{1,30})/i,
      /calidad del aire en (.+)/i,
      /recomendaciones para (.+)/i
    ];
    
    for (const pattern of cityPatterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    
    // Si no se detecta patrón específico, asumir que es una consulta general sin ciudad nueva
    return null;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      let aiResponseText = '';
      let detectedCity = currentCity;
      let newCityDetected = false;

      // Si no hay ciudad confirmada o el usuario menciona una nueva ciudad
      if (!cityConfirmed || userInput.toLowerCase().includes('cambiar') || userInput.toLowerCase().includes('otra')) {
        const extractedCity = extractCityFromMessage(userInput);
        
        if (extractedCity) {
          detectedCity = extractedCity;
          setCurrentCity(extractedCity);
          newCityDetected = true;
          
          // Confirmar automáticamente la ciudad
          setCityConfirmed(true);
          aiResponseText = `¡Perfecto! Analizaré la calidad del aire para ${extractedCity}. `;
        }
      }

      // Si tenemos una ciudad confirmada, obtener recomendaciones reales
      if (detectedCity && cityConfirmed) {
        const queryType = detectQueryType(userInput);
        const recommendations = await getAIRecommendations(detectedCity, queryType);
        
        if (newCityDetected) {
          aiResponseText += recommendations;
        } else {
          aiResponseText = recommendations;
        }
      } 
      // Si no hay ciudad detectada
      else if (!detectedCity) {
        aiResponseText = "Por favor, menciona el nombre de una ciudad para que pueda darte recomendaciones específicas sobre la calidad del aire. Por ejemplo: 'Ciudad de México', 'Guadalajara', 'Monterrey', etc.";
      }

      const aiResponse = {
        id: messages.length + 2,
        text: aiResponseText,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error en el chat:', error);
      const errorResponse = {
        id: messages.length + 2,
        text: "Lo siento, hubo un error al procesar tu solicitud. Por favor, intenta de nuevo más tarde.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: "¡Hola! Soy tu asistente de calidad del aire. Puedo ayudarte con recomendaciones personalizadas sobre contaminación, salud y prevención. ¿De qué ciudad te gustaría obtener información?",
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
    setCurrentCity('');
    setCityConfirmed(false);
  };

  const suggestedQuestions = [
    "Calidad del aire en Maravatio",
    "Recomendaciones para Lázaro Cárdenas",
    "Contaminantes en Morelia",
    "Consejos para personas con asma"
  ];

  const handleSuggestionClick = (question) => {
    setInputMessage(question);
  };

  // Función para cambiar ciudad manualmente
  const changeCity = () => {
    setCurrentCity('');
    setCityConfirmed(false);
    setMessages(prev => [...prev, {
      id: prev.length + 1,
      text: "Por favor, escribe el nombre de la nueva ciudad que te interesa.",
      sender: 'bot',
      timestamp: new Date()
    }]);
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
                Obtén recomendaciones para cualquier ciudad
              </p>
            </div>
          </div>

          {/* Indicador de ciudad actual */}
          {currentCity && (
            <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-md border border-gray-200 dark:border-gray-700">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Ciudad actual: <span className="text-blue-600 dark:text-blue-400">{currentCity}</span>
              </span>
              <button
                onClick={changeCity}
                className="text-xs text-gray-500 hover:text-gray-700 ml-2"
              >
                Cambiar
              </button>
            </div>
          )}
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
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {currentCity ? `Analizando: ${currentCity}` : 'En línea • Cualquier ciudad disponible'}
                </p>
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
                    <p className="text-lg leading-relaxed whitespace-pre-line">{message.text}</p>
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
                    <div className="flex items-center gap-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Consultando datos de calidad del aire...
                      </span>
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
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Ejemplos de consultas:</p>
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
                placeholder={
                  currentCity 
                    ? `Escribe tu pregunta sobre ${currentCity}...`
                    : "Escribe el nombre de una ciudad o tu pregunta..."
                }
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
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Cualquier Ciudad</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Consulta datos de calidad del aire para cualquier ciudad disponible</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
              <User className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Recomendaciones Reales</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Basado en datos actuales de estaciones de monitoreo</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
              <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Fácil Cambio</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Cambia de ciudad en cualquier momento</p>
          </div>
        </div>
      </main>
    </div>
  );
}