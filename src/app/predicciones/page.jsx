'use client';
import { useState } from 'react';
import Loader from '@/components/Loader';
import { 
  usePrediction, 
  getAqiLevel, 
  getAqiColor, 
  getLevelColor 
} from '@/hooks/usePrediction';

export default function Predicciones() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const {
    currentCity,
    isLoading,
    aqiData,
    predictionData,
    error,
    changeCity,
    refreshData
  } = usePrediction('maravatio');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      await changeCity(searchQuery);
      setSearchQuery('');
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
                Predicciones de Calidad del Aire
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Pronósticos y tendencias de la calidad del aire para los próximos días
            </p>
            
            {/* Mostrar error si existe */}
            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg max-w-md mx-auto">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}
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
                    placeholder="Buscar ciudad..."
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

            {/* Estado actual rápido */}
            <div className="flex justify-center gap-3 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 p-4 flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${aqiData?.levelBg} shadow-lg`}></div>
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    Estado Actual: {aqiData?.level}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {currentCity} • PM2.5: {aqiData?.pollutants?.pm25} µg/m³
                  </div>
                </div>
              </div>
              <button
                onClick={refreshData}
                className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500/20 shadow-lg flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Actualizar
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal - Solo Predicciones */}
      <main className="flex-1">
        <div className="w-full min-h-[calc(100vh-280px)] bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-6">
              {/* Resumen de Predicción */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Resumen de Predicción - {currentCity}
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Actualizado: {new Date().toLocaleTimeString()}
                    </span>
                    <div className={`w-2 h-2 rounded-full ${
                      predictionData?.confianza === 'Alta' ? 'bg-green-500' : 
                      predictionData?.confianza === 'Media' ? 'bg-yellow-500' : 'bg-red-500'
                    } animate-pulse`}></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800/30">
                    <div className="text-xl font-black text-green-600 dark:text-green-400">
                      {predictionData?.resumen?.diasBuenos || 0}
                    </div>
                    <div className="text-xs font-semibold text-gray-600 dark:text-gray-300">Días Buenos</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800/30">
                    <div className="text-xl font-black text-yellow-600 dark:text-yellow-400">
                      {predictionData?.resumen?.diasModerados || 0}
                    </div>
                    <div className="text-xs font-semibold text-gray-600 dark:text-gray-300">Días Moderados</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border border-orange-200 dark:border-orange-800/30">
                    <div className="text-xl font-black text-orange-600 dark:text-orange-400">
                      {predictionData?.resumen?.diasPobres || 0}
                    </div>
                    <div className="text-xs font-semibold text-gray-600 dark:text-gray-300">Días Pobres</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800/30">
                    <div className="text-xl font-black text-blue-600 dark:text-blue-400">
                      {predictionData?.confianza === 'Alta' ? '85%' : 
                       predictionData?.confianza === 'Media' ? '65%' : '45%'}
                    </div>
                    <div className="text-xs font-semibold text-gray-600 dark:text-gray-300">Confianza</div>
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
                    {predictionData?.today?.map((hour, index) => (
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
                    {predictionData?.week?.map((day, index) => (
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
                              style={{ width: `${Math.min((day.aqi / 150) * 100, 100)}%` }}
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
                          {day.trend === 'stable' && (
                            <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
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
                    {predictionData?.insights?.map((insight, index) => (
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
                        <span className="text-xs font-bold text-green-600">
                          {predictionData?.confianza === 'Alta' ? '85%' : 
                           predictionData?.confianza === 'Media' ? '65%' : '45%'}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${
                            predictionData?.confianza === 'Alta' ? 'bg-green-500' : 
                            predictionData?.confianza === 'Media' ? 'bg-yellow-500' : 'bg-red-500'
                          }`} 
                          style={{ 
                            width: predictionData?.confianza === 'Alta' ? '85%' : 
                                   predictionData?.confianza === 'Media' ? '65%' : '45%' 
                          }}
                        ></div>
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

              {/* Información adicional */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  ℹ️ Información del Modelo
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white mb-2">Algoritmo Utilizado:</p>
                    <p>Suavizado Exponencial + Patrones Horarios</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white mb-2">Período Analizado:</p>
                    <p>7 días de datos históricos</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white mb-2">Actualización:</p>
                    <p>Cada hora</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white mb-2">Cobertura:</p>
                    <p>Múltiples ciudades disponibles</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}