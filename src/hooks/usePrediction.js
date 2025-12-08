// hooks/usePrediction.js
import { useState, useEffect } from 'react';
import { apiServices } from '@/services/api';

// Helper functions para AQI (ahora exportadas individualmente)
export const getAqiLevel = (pm25) => {
  if (pm25 <= 50) return 'Buena';
  if (pm25 <= 100) return 'Moderada';
  if (pm25 <= 150) return 'No saludable';
  return 'Muy pobre';
};

export const getAqiLevelColor = (aqi) => {
  if (aqi <= 50) return 'text-green-600';
  if (aqi <= 100) return 'text-yellow-600';
  if (aqi <= 150) return 'text-orange-600';
  return 'text-red-600';
};

export const getAqiLevelBg = (aqi) => {
  if (aqi <= 50) return 'bg-green-500';
  if (aqi <= 100) return 'bg-yellow-500';
  if (aqi <= 150) return 'bg-orange-500';
  return 'bg-red-500';
};

export const getAqiColor = (aqi) => {
  if (aqi <= 50) return 'text-green-600 bg-green-100';
  if (aqi <= 100) return 'text-yellow-600 bg-yellow-100';
  if (aqi <= 150) return 'text-orange-600 bg-orange-100';
  return 'text-red-600 bg-red-100';
};

export const getLevelColor = (level) => {
  switch(level) {
    case 'Buena': return 'text-green-600';
    case 'Moderada': return 'text-yellow-600';
    case 'No saludable': return 'text-orange-600';
    case 'Pobre': return 'text-orange-600';
    case 'Muy Pobre': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

export const usePrediction = () => {
  const [currentCity, setCurrentCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aqiData, setAqiData] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Función para cargar datos de calidad del aire actual
  const loadCurrentAirQuality = async (ciudad) => {
    try {
      const data = await apiServices.sensores.obtenerPorCiudad(ciudad);
      
      // Adaptar los datos de la API a tu formato frontend
      const adaptedData = {
        aqi: data.pm25 || 45,
        level: getAqiLevel(data.pm25 || 45),
        levelColor: getAqiLevelColor(data.pm25 || 45),
        levelBg: getAqiLevelBg(data.pm25 || 45),
        pollutants: {
          pm25: data.pm25 || 12,
          pm10: data.pm10 || 20,
          no2: data.no2 || 25,
          o3: data.o3 || 40,
        },
        location: data.ciudad || ciudad,
        lastUpdated: 'Actualizado recientemente'
      };
      
      setAqiData(adaptedData);
      return adaptedData;
    } catch (error) {
      console.error('Error cargando calidad del aire:', error);
      
      if (error.message.includes('404')) {
        throw new Error('No se encuentran mediciones de esta ciudad');
      } else if (error.message.includes('500')) {
        throw new Error('Error del servidor al buscar la ciudad');
      } else {
        throw new Error('Error al cargar datos de calidad del aire');
      }
    }
  };

  // Función para generar insights basados en los datos de predicción
  const generarInsights = (prediccion) => {
    const insights = [];
    
    if (prediccion?.resumen) {
      const { diasBuenos, diasModerados, diasPobres } = prediccion.resumen;
      
      if (diasPobres > 0) {
        insights.push(`Se esperan ${diasPobres} días con calidad del aire pobre`);
      }
      
      if (diasModerados > 3) {
        insights.push("Mayoría de días con calidad moderada - considere actividades indoor");
      }
      
      if (diasBuenos > 4) {
        insights.push("Semana favorable para actividades al aire libre");
      }
    }

    if (prediccion?.prediccionHoraria) {
      const horasPico = prediccion.prediccionHoraria.filter(h => 
        h.categoria === 'Pobre' || h.categoria === 'Muy Pobre'
      );
      if (horasPico.length > 0) {
        insights.push("Evite actividades exteriores durante horas pico de contaminación");
      }
    }

    // Insights adicionales basados en tendencias
    if (prediccion?.tendenciaSemanal) {
      const tendencias = prediccion.tendenciaSemanal.map(d => d.tendencia);
      const mejoras = tendencias.filter(t => t === '↓').length;
      const empeoramientos = tendencias.filter(t => t === '↑').length;
      
      if (mejoras > empeoramientos) {
        insights.push("Tendencia general de mejora en la calidad del aire");
      } else if (empeoramientos > mejoras) {
        insights.push("Tendencia general de empeoramiento - tome precauciones");
      }
    }

    return insights.length > 0 ? insights : [
      "Condiciones estables para los próximos días",
      "Niveles de contaminación dentro de rangos normales",
      "Buen momento para actividades al aire libre"
    ];
  };

  // Función para cargar predicciones
  const loadPredictions = async (ciudad) => {
    try {
      const [prediccionCompleta, prediccionRapida] = await Promise.all([
        apiServices.prediccion.obtenerPrediccion(ciudad, 7, 'json'),
        apiServices.prediccion.obtenerPrediccionRapida(ciudad)
      ]);

      // Adaptar datos de predicción completa
      const tendenciaSemanal = prediccionCompleta.prediccion?.tendenciaSemanal?.map(dia => ({
        day: dia.dia,
        aqi: dia.pm25,
        level: getAqiLevel(dia.pm25),
        trend: dia.tendencia === '↑' ? 'up' : dia.tendencia === '↓' ? 'down' : 'stable'
      })) || [];

      // Adaptar datos de predicción rápida para hoy
      const prediccionHoy = prediccionRapida.proximasHoras?.map(hora => ({
        hour: hora.hora,
        aqi: hora.pm25,
        level: hora.categoria,
        pm25: hora.pm25
      })) || [];

      const adaptedData = {
        today: prediccionHoy,
        week: tendenciaSemanal,
        insights: generarInsights(prediccionCompleta.prediccion),
        resumen: prediccionCompleta.prediccion?.resumen,
        confianza: prediccionCompleta.prediccion?.confianza || 'Alta',
        rawData: {
          completa: prediccionCompleta,
          rapida: prediccionRapida
        }
      };

      setPredictionData(adaptedData);
      return adaptedData;

    } catch (error) {
      console.error('Error cargando predicciones:', error);
      
      if (error.message.includes('404')) {
        throw new Error('No se encuentran predicciones disponibles para esta ciudad');
      } else if (error.message.includes('500')) {
        throw new Error('Error del servidor al generar predicciones');
      } else {
        throw new Error('Error al cargar predicciones');
      }
    }
  };

  // Función para cambiar ciudad
  const changeCity = async (nuevaCiudad) => {
    if (!nuevaCiudad.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    const ciudadNormalizada = nuevaCiudad.trim().toLowerCase();
    setCurrentCity(ciudadNormalizada);
    
    try {
      await Promise.all([
        loadCurrentAirQuality(ciudadNormalizada),
        loadPredictions(ciudadNormalizada)
      ]);
    } catch (error) {
      console.error('Error cambiando ciudad:', error);
      setError(error.message);
      // Limpiar datos en caso de error
      setAqiData(null);
      setPredictionData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para recargar datos
  const refreshData = async () => {
    if (!currentCity) return;
    
    setIsLoading(true);
    try {
      await Promise.all([
        loadCurrentAirQuality(currentCity),
        loadPredictions(currentCity)
      ]);
      setError(null);
    } catch (error) {
      console.error('Error recargando datos:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // Estado
    currentCity,
    isLoading,
    aqiData,
    predictionData,
    error,
    hasSearched,
    
    // Funciones
    changeCity,
    refreshData
  };
};