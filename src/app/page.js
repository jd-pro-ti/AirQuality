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
        levelColor: 'text-green-500',
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-800 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
        
        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Text Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Datos en tiempo real</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  Calidad del{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Aire
                  </span>
                  <br />
                  <span className="text-gray-900 dark:text-white">En Tiempo Real</span>
                </h1>
                
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                  Monitorea, predice y mejora la calidad del aire en tu zona con tecnología avanzada. 
                  Obtén datos precisos y recomendaciones personalizadas para proteger tu salud.
                </p>
              </div>

              {/* Search Section */}
              <div className="space-y-4">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl">
                  <div className="flex-grow relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar ciudad, estado o código postal..."
                      className="block w-full pl-10 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Buscar
                  </button>
                </form>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Ingresa tu ubicación para obtener información específica
                </p>
              </div>
            </div>

            {/* AQI Visualization */}
            <div className="relative">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50">
                <div className="text-center space-y-6">
                  
                  {/* AQI Circle with Animation */}
                  <div className="relative w-48 h-48 mx-auto">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-gray-900 dark:text-white">45</div>
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">AQI</div>
                      </div>
                    </div>
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" className="dark:stroke-gray-600"/>
                      <circle 
                        cx="50" cy="50" r="45" 
                        fill="none" 
                        stroke="#10b981" 
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray="283"
                        strokeDashoffset="155"
                        className="animate-progress"
                      >
                        <animate attributeName="stroke-dashoffset" from="283" to="155" dur="1.5s" fill="freeze" />
                      </circle>
                    </svg>
                  </div>
                  
                  {/* Quality Info */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${aqiData.levelBg} animate-pulse`}></div>
                      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        Calidad {aqiData.level}
                      </h3>
                    </div>
                    <div className="space-y-1">
                      <p className="text-gray-600 dark:text-gray-300 font-medium">{aqiData.location}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{aqiData.lastUpdated}</p>
                    </div>
                  </div>

                  {/* Pollutants Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-100 dark:border-green-800/30">
                      <div className="text-center space-y-2">
                        <div className="font-semibold text-green-700 dark:text-green-300 text-sm">PM2.5</div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">12</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">µg/m³</div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl p-4 border border-yellow-100 dark:border-yellow-800/30">
                      <div className="text-center space-y-2">
                        <div className="font-semibold text-yellow-700 dark:text-yellow-300 text-sm">PM10</div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">20</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">µg/m³</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-cyan-500 rounded-full opacity-30 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-4">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Características</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Soluciones Integrales para el{' '}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Monitoreo del Aire
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Nuestra plataforma combina tecnología avanzada con análisis inteligente para ofrecerte 
              las herramientas más completas en monitoreo ambiental.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AqiCard
              title="Predicciones Avanzadas"
              description="Algoritmos de IA que pronostican la calidad del aire hasta 72 horas con 95% de precisión"
              value="95%"
              trend="accuracy"
              icon="📊"
              gradient="from-purple-500 to-pink-500"
            />
            <AqiCard
              title="Monitoreo en Tiempo Real"
              description="Datos actualizados cada 15 minutos de nuestra red de sensores distribuidos estratégicamente"
              value="24/7"
              trend="live"
              icon="🔍"
              gradient="from-blue-500 to-cyan-500"
            />
            <AqiCard
              title="Recomendaciones Saludables"
              description="Alertas y consejos personalizados basados en las condiciones actuales y tu perfil de salud"
              value="100+"
              trend="tips"
              icon="💡"
              gradient="from-green-500 to-emerald-500"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold">50+</div>
              <div className="text-blue-100 text-sm font-medium">Ciudades Monitoreadas</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold">1M+</div>
              <div className="text-blue-100 text-sm font-medium">Datos Diarios</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold">99.8%</div>
              <div className="text-blue-100 text-sm font-medium">Tiempo Activo</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold">24/7</div>
              <div className="text-blue-100 text-sm font-medium">Soporte Técnico</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}