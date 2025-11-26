'use client';
import { useState, useEffect } from 'react';
import Loader from '@/components/Loader';

export default function Home() {
  const [location, setLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [aqiData, setAqiData] = useState(null);
  const [activeView, setActiveView] = useState('actual');
  const [predictionData, setPredictionData] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setAqiData({
        aqi: 45,
        level: 'Buena',
        levelColor: 'text-green-600',
        levelBg: 'bg-green-500',
        pollutants: {
          pm25: 12,
          pm10: 20,
          no2: 25,
          o3: 40,
        },
        location: 'Ciudad de México',
        lastUpdated: 'Actualizado hace 5 min'
      });

      // Datos de predicción simulados
      setPredictionData({
        today: [
          { hour: '06:00', aqi: 35, level: 'Buena', pm25: 10 },
          { hour: '09:00', aqi: 42, level: 'Buena', pm25: 14 },
          { hour: '12:00', aqi: 55, level: 'Moderada', pm25: 18 },
          { hour: '15:00', aqi: 48, level: 'Buena', pm25: 15 },
          { hour: '18:00', aqi: 38, level: 'Buena', pm25: 12 },
          { hour: '21:00', aqi: 32, level: 'Buena', pm25: 9 },
        ],
        week: [
          { day: 'Lun', aqi: 45, level: 'Buena', trend: 'stable' },
          { day: 'Mar', aqi: 52, level: 'Moderada', trend: 'up' },
          { day: 'Mié', aqi: 48, level: 'Buena', trend: 'down' },
          { day: 'Jue', aqi: 61, level: 'Moderada', trend: 'up' },
          { day: 'Vie', aqi: 55, level: 'Moderada', trend: 'down' },
          { day: 'Sáb', aqi: 42, level: 'Buena', trend: 'down' },
          { day: 'Dom', aqi: 38, level: 'Buena', trend: 'down' },
        ],
        insights: [
          "Se espera aumento de PM2.5 durante horas pico",
          "Condiciones favorables para dispersión de contaminantes",
          "Recomendado uso de transporte público el jueves"
        ]
      });
      
      setIsLoading(false);
    };

    initializeApp();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Buscando:', searchQuery);
      // Aquí iría la búsqueda real
    }
  };

  const getAqiColor = (aqi) => {
    if (aqi <= 50) return 'text-green-600 bg-green-100';
    if (aqi <= 100) return 'text-yellow-600 bg-yellow-100';
    if (aqi <= 150) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getLevelColor = (level) => {
    switch(level) {
      case 'Buena': return 'text-green-600';
      case 'Moderada': return 'text-yellow-600';
      case 'No saludable': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-300">
      {/* Header con búsqueda */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Calidad del Aire
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {activeView === 'actual' 
                ? 'Monitoreo en tiempo real de la calidad del aire en tu ubicación'
                : 'Pronósticos y tendencias de la calidad del aire para los próximos días'
              }
            </p>
          </div>

          {/* Barra de búsqueda */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="relative group mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition-all duration-300"></div>
              <div className="relative flex gap-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-600/50 p-2">
                <div className="flex-grow relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar ciudad, estado o código postal..."
                    className="w-full h-14 pl-12 pr-4 text-base bg-transparent border-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-0"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 bg-gradient-to-r text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/20 shadow-lg flex items-center gap-2"
                >
                  <span>Buscar</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Botones de cambio de vista */}
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setActiveView('actual')}
                className={`px-6 py-2 font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/20 shadow-lg ${
                  activeView === 'actual'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-blue-500/25'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                📊 Estado Actual
              </button>
              <button
                onClick={() => setActiveView('predicciones')}
                className={`px-6 py-2 font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/20 shadow-lg ${
                  activeView === 'predicciones'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-blue-500/25'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                🔮 Predicciones
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal - OCUPANDO TODA LA PANTALLA */}
      <main className="flex-1">
        {activeView === 'actual' ? (
          /* Vista Estado Actual - COMPACTA Y COMPLETA */
          <div className="w-full min-h-[calc(100vh-280px)] bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start h-full">
                
                {/* Información de calidad del aire */}
                <div className="space-y-6 h-full">
                  {/* Tarjeta de estado actual */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 h-full">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Estado Actual
                      </h2>
                      <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                        {aqiData.lastUpdated}
                      </span>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${aqiData.levelBg} shadow-lg`}></div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                          Calidad {aqiData.level}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-base text-gray-600 dark:text-gray-300">
                        <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Ubicación: <span className="font-semibold text-gray-900 dark:text-white">{aqiData.location}</span></span>
                      </div>
                    </div>
                  </div>

                  {/* Contaminantes */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                      Contaminantes Principales
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">PM2.5</span>
                          <span className="text-sm font-bold text-green-600">12 µg/m³</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 shadow-inner">
                          <div className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full shadow-lg" style={{ width: '30%' }}></div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">PM10</span>
                          <span className="text-sm font-bold text-yellow-600">20 µg/m³</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 shadow-inner">
                          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full shadow-lg" style={{ width: '50%' }}></div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">NO₂</span>
                          <span className="text-sm font-bold text-orange-600">25 µg/m³</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 shadow-inner">
                          <div className="bg-gradient-to-r from-orange-400 to-orange-500 h-2 rounded-full shadow-lg" style={{ width: '40%' }}></div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">O₃</span>
                          <span className="text-sm font-bold text-blue-600">40 µg/m³</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 shadow-inner">
                          <div className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full shadow-lg" style={{ width: '60%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gráfica AQI */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 h-full">
                  <div className="text-center h-full flex flex-col justify-center">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                      Índice de Calidad del Aire (AQI)
                    </h3>
                    
                    <div className="relative w-56 h-56 mx-auto mb-6">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl font-black text-gray-900 dark:text-white mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">45</div>
                          <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">AQI</div>
                        </div>
                      </div>
                      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" className="dark:stroke-gray-600"/>
                        <circle 
                          cx="50" cy="50" r="45" 
                          fill="none" 
                          stroke="url(#gradient)" 
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray="283"
                          strokeDashoffset="155"
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#3b82f6" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full shadow-lg"></div>
                        <span className="text-base font-bold text-gray-900 dark:text-white">
                          Calidad del Aire - Buena
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        Los niveles de contaminación se encuentran dentro de los límites seguros para actividades al aire libre
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Vista Predicciones - COMPACTA Y COMPLETA */
          <div className="w-full min-h-[calc(100vh-280px)] bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="space-y-6">
                {/* Resumen de Predicción */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Resumen de Predicción - Próximos 7 Días
                    </h2>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Actualizado: 08:00 AM
                      </span>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800/30">
                      <div className="text-xl font-black text-green-600 dark:text-green-400">4</div>
                      <div className="text-xs font-semibold text-gray-600 dark:text-gray-300">Días Buenos</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800/30">
                      <div className="text-xl font-black text-yellow-600 dark:text-yellow-400">3</div>
                      <div className="text-xs font-semibold text-gray-600 dark:text-gray-300">Días Moderados</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800/30">
                      <div className="text-xl font-black text-blue-600 dark:text-blue-400">85%</div>
                      <div className="text-xs font-semibold text-gray-600 dark:text-gray-300">Precisión</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl border border-purple-200 dark:border-purple-800/30">
                      <div className="text-xl font-black text-purple-600 dark:text-purple-400">↓2.5</div>
                      <div className="text-xs font-semibold text-gray-600 dark:text-gray-300">Tendencia PM2.5</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Predicción Horaria para Hoy */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                      📅 Predicción Horaria - Hoy
                    </h3>
                    <div className="space-y-3">
                      {predictionData.today.map((hour, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-gray-900 dark:text-white w-12 text-sm">{hour.hour}</span>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getAqiColor(hour.aqi)}`}>
                              AQI {hour.aqi}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`text-sm font-semibold ${getLevelColor(hour.level)}`}>
                              {hour.level}
                            </span>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              PM2.5: {hour.pm25} µg/m³
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Gráfica de Tendencia Semanal */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                      📈 Tendencia Semanal
                    </h3>
                    <div className="space-y-4">
                      {predictionData.week.map((day, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900 dark:text-white w-8 text-sm">{day.day}</span>
                          <div className="flex-1 mx-3">
                            <div className="relative h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className={`absolute top-0 left-0 h-full rounded-full ${
                                  day.aqi <= 50 ? 'bg-green-500' :
                                  day.aqi <= 100 ? 'bg-yellow-500' :
                                  'bg-orange-500'
                                }`}
                                style={{ width: `${(day.aqi / 150) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 w-20 justify-end">
                            <span className={`text-sm font-semibold ${getLevelColor(day.level)}`}>
                              {day.aqi}
                            </span>
                            {day.trend === 'up' && (
                              <svg className="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                              </svg>
                            )}
                            {day.trend === 'down' && (
                              <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                              </svg>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Insights y Métricas */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                      🎯 Insights de Predicción
                    </h3>
                    <div className="space-y-3">
                      {predictionData.insights.map((insight, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800/30">
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{insight}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                      📊 Métricas del Modelo
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Precisión General</span>
                          <span className="text-xs font-bold text-green-600">85%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">PM2.5 Prediction</span>
                          <span className="text-xs font-bold text-blue-600">88%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                          <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '88%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Confianza 24h</span>
                          <span className="text-xs font-bold text-purple-600">92%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                          <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '92%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}