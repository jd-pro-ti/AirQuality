'use client';
import { useState, useEffect } from 'react';
import AqiCard from '@/components/AqiCard';
import Loader from '@/components/Loader';
import { useAirQuality } from '@/hooks/useAirQuality';
import { clasificarCalidadAire, formatearFecha, calcularPorcentajeCalidad, obtenerIconoCalidad } from '@/utils/airQualityUtils';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null);
  const [errorAmigable, setErrorAmigable] = useState(null);
  const [datosProcesados, setDatosProcesados] = useState(null);
  
  // ✅ CORREGIDO: Usar el hook con todas las funciones
  const { 
    datos, 
    loading, 
    error, 
    obtenerPorCiudad,
    iniciarPolling,
    detenerPolling
  } = useAirQuality('maravatio');

  // ✅ CORREGIDO: Procesar datos cuando cambian
  useEffect(() => {
    if (datos && datos.ok && datos.datos) {
      const procesados = procesarDatosAPI(datos);
      setDatosProcesados(procesados);
      setErrorAmigable(null);
    } else if (datos && !datos.ok) {
      setDatosProcesados(null);
      setErrorAmigable('No se pudieron obtener los datos de la API');
    }
  }, [datos]);

  // ✅ MEJORADO: Manejo de errores amigable
  useEffect(() => {
    if (error) {
      // Transformar errores técnicos en mensajes amigables
      if (error.includes('404') || error.includes('No se encontraron datos')) {
        setErrorAmigable('Lo sentimos, no tenemos datos disponibles para esta ciudad en este momento.');
      } else if (error.includes('Failed to fetch') || error.includes('Network')) {
        setErrorAmigable('Problema de conexión. Verifica tu internet e intenta nuevamente.');
      } else if (error.includes('500') || error.includes('Internal Server')) {
        setErrorAmigable('Estamos experimentando problemas técnicos. Por favor, intenta más tarde.');
      } else {
        setErrorAmigable('Ocurrió un error inesperado. Por favor, intenta nuevamente.');
      }
      setDatosProcesados(null);
    }
  }, [error]);

  // ✅ CORREGIDO: Función para procesar timestamp de Firestore
  const procesarTimestampFirestore = (timestamp) => {
    if (!timestamp) return new Date().toISOString();
    
    // Si es timestamp de Firestore
    if (timestamp.type && timestamp.type.includes('firestore/timestamp')) {
      return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000).toISOString();
    }
    
    // Si es timestamp numérico (como de Firebase)
    if (typeof timestamp === 'number') {
      return new Date(timestamp).toISOString();
    }
    
    // Si ya es string ISO
    if (typeof timestamp === 'string') {
      return timestamp;
    }
    
    return new Date().toISOString();
  };

  // ✅ CORREGIDO: Función mejorada para procesar datos
  const procesarDatosAPI = (datosRaw) => {
    // ✅ CORRECCIÓN: Manejar caso cuando datosRaw es null o no tiene la estructura esperada
    if (!datosRaw || !datosRaw.ok || !datosRaw.datos) {
      console.warn('📊 Datos no válidos recibidos:', datosRaw);
      return null;
    }

    const datos = datosRaw.datos;
    
    console.log('📊 Datos recibidos de API:', datos);
    
    // ✅ CORRECCIÓN: Extraer valores con manejo de diferentes estructuras
    const pm25 = datos.pm25 || datos.pm2_5 || datos.PM25 || 0;
    const pm10 = datos.pm10 || datos.PM10 || 0;
    const ciudad = datosRaw.ciudad || datos.ciudad || 'maravatio';
    
    // ✅ CORRECCIÓN: Procesar timestamp correctamente
    const timestamp = procesarTimestampFirestore(datos.timestamp || datos.timestamp_firestore || datos.fecha);
    
    const calidadInfo = clasificarCalidadAire(pm25);
    
    return {
      aqi: pm25,
      level: calidadInfo.nivel,
      levelColor: calidadInfo.color,
      pollutants: {
        pm25: pm25,
        pm10: pm10,
        pm1: datos.pm1 || datos.PM1 || 0,
        co2: datos.co2 || datos.CO2 || 0,
        temperatura: datos.temperatura || datos.temp || 0,
        humedad: datos.humedad || datos.humidity || 0,
        no2: datos.no2 || datos.NO2 || 0,
        o3: datos.o3 || datos.O3 || 0,
        co: datos.co || datos.CO || 0,
        so2: datos.so2 || datos.SO2 || 0
      },
      location: ciudad,
      lastUpdated: formatearTiempoTranscurrido(timestamp),
      calidadInfo: calidadInfo,
      rawData: datos
    };
  };

  // Controlar auto-refresh
  useEffect(() => {
    if (autoRefresh) {
      console.log('✅ Actualización automática ACTIVADA');
      iniciarPolling(searchQuery || 'maravatio', 30000);
    } else {
      console.log('⏸️ Actualización automática PAUSADA');
      detenerPolling();
    }

    return () => {
      detenerPolling();
    };
  }, [autoRefresh, searchQuery]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setErrorAmigable(null); // Limpiar error anterior
      await obtenerPorCiudad(searchQuery.trim());
      setUltimaActualizacion(new Date());
    }
  };

  // Función para actualización manual
  const handleActualizarManual = async () => {
    setErrorAmigable(null); // Limpiar error anterior
    await obtenerPorCiudad(searchQuery || 'maravatio');
    setUltimaActualizacion(new Date());
  };

  // Función para formatear el tiempo transcurrido
  const formatearTiempoTranscurrido = (fechaISO) => {
    if (!fechaISO) return 'Desconocido';
    
    try {
      const fecha = new Date(fechaISO);
      const ahora = new Date();
      const diffMs = ahora - fecha;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      
      if (diffMins < 1) return 'Actualizado ahora';
      if (diffMins < 60) return `Actualizado hace ${diffMins} min`;
      if (diffHours < 24) return `Actualizado hace ${diffHours} h`;
      
      return formatearFecha(fechaISO);
    } catch (error) {
      return 'Fecha desconocida';
    }
  };

  // ✅ CORREGIDO: Usar datos procesados del estado
  const aqiData = datosProcesados;

  // Porcentaje para el gráfico circular - Solo si hay datos
  const porcentajeCalidad = aqiData ? calcularPorcentajeCalidad(aqiData.aqi) : 0;
  const strokeDashoffset = aqiData ? 283 - (283 * porcentajeCalidad) / 100 : 283;

  // ✅ CORREGIDO: Mostrar loader solo en carga inicial sin datos
  if (loading && !aqiData && !errorAmigable) {
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
              Monitoreo en tiempo real de la calidad del aire
            </p>
            
            {/* Indicador de actualización automática */}
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
              <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span>Actualización automática: {autoRefresh ? 'ACTIVA' : 'PAUSADA'}</span>
            </div>
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
                    placeholder="Buscar ciudad (ej: maravatio, morelia)..."
                    className="w-full h-16 pl-12 pr-4 text-lg bg-transparent border-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-0"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 bg-gradient-to-r text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/20 shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Buscar</span>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
            
            {/* Ciudades sugeridas */}
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {['Maravatio', 'Patzcuaro', 'Lazaro Cardenas'].map((ciudad) => (
                <button
                  key={ciudad}
                  onClick={() => {
                    setSearchQuery(ciudad);
                    setErrorAmigable(null);
                    obtenerPorCiudad(ciudad);
                  }}
                  className="px-3 py-1 text-sm bg-white/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-full border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
                >
                  {ciudad}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Mensaje de error amigable */}
      {errorAmigable && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  No pudimos obtener los datos
                </h3>
                <p className="text-yellow-700 dark:text-yellow-300">
                  {errorAmigable}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={handleActualizarManual}
                    disabled={loading}
                    className="px-4 py-2 bg-yellow-100 dark:bg-yellow-800/50 text-yellow-700 dark:text-yellow-300 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-700/50 transition-colors font-medium disabled:opacity-50"
                  >
                    {loading ? 'Reintentando...' : 'Reintentar'}
                  </button>
                  <button
                    onClick={() => {
                      setErrorAmigable(null);
                      obtenerPorCiudad('maravatio');
                      setSearchQuery('maravatio');
                    }}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-100 dark:bg-blue-800/50 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-700/50 transition-colors font-medium disabled:opacity-50"
                  >
                    Volver a Maravatío
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <main className="w-full">
        {aqiData ? (
          <>
            {/* Sección de datos principales */}
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
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                            {aqiData.lastUpdated}
                          </span>
                          <button
                            onClick={handleActualizarManual}
                            disabled={loading}
                            className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors disabled:opacity-50"
                          >
                            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            {loading ? 'Actualizando...' : 'Actualizar'}
                          </button>
                          <button
                            onClick={() => setAutoRefresh(!autoRefresh)}
                            className={`flex items-center gap-2 px-3 py-1 text-sm rounded-full transition-colors ${
                              autoRefresh 
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                            }`}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Auto: {autoRefresh ? 'ON' : 'OFF'}
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-4 h-4 rounded-full shadow-lg"
                            style={{ backgroundColor: aqiData.calidadInfo.color }}
                          ></div>
                          <span className="text-2xl font-bold text-gray-900 dark:text-white">
                            Calidad {aqiData.level}
                          </span>
                          <span className="text-2xl">{obtenerIconoCalidad(aqiData.level)}</span>
                        </div>
                        
                        <div className="flex items-center gap-3 text-lg text-gray-600 dark:text-gray-300">
                          <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>Ubicación: <span className="font-semibold text-gray-900 dark:text-white">{aqiData.location}</span></span>
                        </div>
                        
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                          <p className="text-gray-600 dark:text-gray-300">
                            {aqiData.calidadInfo.descripcion}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Contaminantes */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                        Contaminantes Principales
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-6">
                        {Object.entries(aqiData.pollutants)
                          .filter(([contaminante, valor]) => valor > 0 && 
                            ['pm25', 'pm10', 'pm1', 'co2', 'temperatura', 'humedad'].includes(contaminante))
                          .map(([contaminante, valor]) => {
                          const porcentaje = Math.min(100, (valor / 100) * 100);
                          let colorClase = 'from-gray-400 to-gray-500';
                          
                          if (contaminante === 'pm25' || contaminante === 'pm10' || contaminante === 'pm1') {
                            if (valor <= 12) colorClase = 'from-green-400 to-green-500';
                            else if (valor <= 35) colorClase = 'from-yellow-400 to-yellow-500';
                            else if (valor <= 55) colorClase = 'from-orange-400 to-orange-500';
                            else colorClase = 'from-red-400 to-red-500';
                          } else {
                            // Para otros contaminantes, usar escala genérica
                            if (valor <= 25) colorClase = 'from-green-400 to-green-500';
                            else if (valor <= 50) colorClase = 'from-yellow-400 to-yellow-500';
                            else if (valor <= 75) colorClase = 'from-orange-400 to-orange-500';
                            else colorClase = 'from-red-400 to-red-500';
                          }
                          
                          let unidad = 'ppb';
                          if (contaminante === 'pm25' || contaminante === 'pm10' || contaminante === 'pm1') {
                            unidad = 'µg/m³';
                          } else if (contaminante === 'temperatura') {
                            unidad = '°C';
                          } else if (contaminante === 'humedad') {
                            unidad = '%';
                          } else if (contaminante === 'co2') {
                            unidad = 'ppm';
                          }
                          
                          return (
                            <div key={contaminante} className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-base font-semibold text-gray-700 dark:text-gray-300">
                                  {contaminante.toUpperCase()}
                                </span>
                                <span className="text-base font-bold" style={{ color: aqiData.calidadInfo.color }}>
                                  {valor} {unidad}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner">
                                <div 
                                  className={`bg-gradient-to-r h-3 rounded-full shadow-lg ${colorClase}`}
                                  style={{ width: `${porcentaje}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Gráfica AQI */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 h-full">
                    <div className="text-center h-full flex flex-col justify-center">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8">
                        Índice de Calidad del Aire (AQI)
                      </h3>
                      
                      <div className="relative w-72 h-72 mx-auto mb-8">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div 
                              className="text-6xl font-black mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
                              style={{ color: aqiData.calidadInfo.color }}
                            >
                              {aqiData.aqi}
                            </div>
                            <div className="text-base font-semibold text-gray-500 dark:text-gray-400">
                              PM2.5 (µg/m³)
                            </div>
                          </div>
                        </div>
                        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                          <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" className="dark:stroke-gray-600"/>
                          <circle 
                            cx="50" cy="50" r="45" 
                            fill="none" 
                            stroke={aqiData.calidadInfo.color}
                            strokeWidth="10"
                            strokeLinecap="round"
                            strokeDasharray="283"
                            strokeDashoffset={strokeDashoffset}
                          />
                        </svg>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full shadow-lg"
                            style={{ backgroundColor: aqiData.calidadInfo.color }}
                          ></div>
                          <span className="text-xl font-bold text-gray-900 dark:text-white">
                            Calidad del Aire - {aqiData.level}
                          </span>
                        </div>
                        <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                          {aqiData.calidadInfo.descripcion}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Resto del contenido */}
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
                    description="Datos actualizados cada 30 segundos de nuestra red de sensores"
                    value="24/7"
                    icon="📊"
                    gradient="from-blue-500 to-cyan-500"
                  />
                  <AqiCard
                    title="Actualización Automática"
                    description="Datos que se refrescan automáticamente sin recargar la página"
                    value="🔄"
                    icon="🔮"
                    gradient="from-purple-500 to-pink-500"
                  />
                  <AqiCard
                    title="Recomendaciones Personalizadas"
                    description="Sugerencias basadas en tu perfil y condiciones actuales"
                    value="✓"
                    icon="💡"
                    gradient="from-green-500 to-emerald-500"
                  />
                </div>
              </section>
            </div>
          </>
        ) : (
          // ✅ CORREGIDO: Estado cuando no hay datos disponibles
          !loading && !errorAmigable && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-12">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  No hay datos disponibles
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  No se pudieron cargar los datos de calidad del aire. Intenta buscar otra ciudad o reintentar.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <button
                    onClick={handleActualizarManual}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                  >
                    Reintentar
                  </button>
                  <button
                    onClick={() => {
                      obtenerPorCiudad('maravatio');
                      setSearchQuery('maravatio');
                    }}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                  >
                    Volver a Maravatío
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </main>
    </div>
  );
}   