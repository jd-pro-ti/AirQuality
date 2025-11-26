'use client';
import { useState, useEffect } from 'react';
import AqiCard from '@/components/AqiCard';
import Loader from '@/components/Loader';

export default function Home() {
  const [location, setLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [aqiData, setAqiData] = useState(null);

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

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-300">
      {/* Header con búsqueda */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Calidad del Aire
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Monitoreo en tiempo real de la calidad del aire en tu ubicación
            </p>
          </div>

          {/* Barra de búsqueda mejorada */}
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSearch} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition-all duration-300"></div>
              <div className="relative flex gap-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-600/50 p-2">
                <div className="flex-grow relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar ciudad, estado o código postal..."
                    className="w-full h-16 pl-12 pr-4 text-lg bg-transparent border-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-0"
                  />
                </div>
                <button
                  type="submit"
                  className="px-8 bg-gradient-to-r text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/20 shadow-lg flex items-center gap-2"
                >
                  <span>Buscar</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </header>

      {/* Contenido principal - AJUSTADO PARA OCUPAR TODO EL ANCHO */}
      <main className="w-full">
        {/* Sección de datos principales - OCUPANDO TODO EL ANCHO */}
        <div className="w-full bg-white dark:bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              
              {/* Información de calidad del aire */}
              <div className="space-y-8">
                {/* Tarjeta de estado actual */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Estado Actual
                    </h2>
                    <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                      {aqiData.lastUpdated}
                    </span>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-4 h-4 rounded-full ${aqiData.levelBg} shadow-lg`}></div>
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        Calidad {aqiData.level}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-lg text-gray-600 dark:text-gray-300">
                      <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Ubicación: <span className="font-semibold text-gray-900 dark:text-white">{aqiData.location}</span></span>
                    </div>
                  </div>
                </div>

                {/* Contaminantes */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Contaminantes Principales
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-semibold text-gray-700 dark:text-gray-300">PM2.5</span>
                        <span className="text-base font-bold text-green-600">12 µg/m³</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner">
                        <div className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full shadow-lg" style={{ width: '30%' }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-semibold text-gray-700 dark:text-gray-300">PM10</span>
                        <span className="text-base font-bold text-yellow-600">20 µg/m³</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner">
                        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full shadow-lg" style={{ width: '50%' }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-semibold text-gray-700 dark:text-gray-300">NO₂</span>
                        <span className="text-base font-bold text-orange-600">25 µg/m³</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner">
                        <div className="bg-gradient-to-r from-orange-400 to-orange-500 h-3 rounded-full shadow-lg" style={{ width: '40%' }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-semibold text-gray-700 dark:text-gray-300">O₃</span>
                        <span className="text-base font-bold text-blue-600">40 µg/m³</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner">
                        <div className="bg-gradient-to-r from-blue-400 to-blue-500 h-3 rounded-full shadow-lg" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gráfica AQI - AHORA OCUPANDO TODO EL ESPACIO DISPONIBLE */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 h-full">
                <div className="text-center h-full flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8">
                    Índice de Calidad del Aire (AQI)
                  </h3>
                  
                  <div className="relative w-72 h-72 mx-auto mb-8">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl font-black text-gray-900 dark:text-white mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">45</div>
                        <div className="text-base font-semibold text-gray-500 dark:text-gray-400">AQI</div>
                      </div>
                    </div>
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" className="dark:stroke-gray-600"/>
                      <circle 
                        cx="50" cy="50" r="45" 
                        fill="none" 
                        stroke="url(#gradient)" 
                        strokeWidth="10"
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
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-500 rounded-full shadow-lg"></div>
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        Calidad del Aire - Buena
                      </span>
                    </div>
                    <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                      Los niveles de contaminación se encuentran dentro de los límites seguros para actividades al aire libre
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resto del contenido con fondo normal */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Características */}
          <section className="mb-20">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Características del Sistema
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Tecnología avanzada para el monitoreo y análisis de la calidad del aire
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <AqiCard
                title="Monitoreo en Tiempo Real"
                description="Datos actualizados cada 15 minutos de nuestra red de sensores"
                value="24/7"
                icon="📊"
                gradient="from-blue-500 to-cyan-500"
              />
              <AqiCard
                title="Predicciones Precisas"
                description="Pronósticos de calidad del aire con 95% de precisión"
                value="95%"
                icon="🔮"
                gradient="from-purple-500 to-pink-500"
              />
              <AqiCard
                title="Alertas Personalizadas"
                description="Notificaciones basadas en tu perfil y ubicación"
                value="✓"
                icon="🔔"
                gradient="from-green-500 to-emerald-500"
              />
            </div>
          </section>

          {/* Información adicional */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                💡 Recomendaciones
              </h3>
              <ul className="space-y-4 text-base text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <span className="text-green-500 text-xl mt-1">✓</span>
                  <span>Condiciones ideales para actividades al aire libre y ejercicio</span>
                </li>
                <li className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <span className="text-green-500 text-xl mt-1">✓</span>
                  <span>Ventilación natural recomendada en espacios cerrados</span>
                </li>
                <li className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <span className="text-green-500 text-xl mt-1">✓</span>
                  <span>Uso normal de transporte público y privado</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                📊 Estadísticas Globales
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
                  <div className="text-2xl font-black text-blue-600 dark:text-blue-400">50+</div>
                  <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">Ciudades</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-100 dark:border-purple-800/30">
                  <div className="text-2xl font-black text-purple-600 dark:text-purple-400">1M+</div>
                  <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">Datos/día</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-100 dark:border-green-800/30">
                  <div className="text-2xl font-black text-green-600 dark:text-green-400">99.8%</div>
                  <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">Precisión</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border border-orange-100 dark:border-orange-800/30">
                  <div className="text-2xl font-black text-orange-600 dark:text-orange-400">24/7</div>
                  <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">Monitoreo</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}