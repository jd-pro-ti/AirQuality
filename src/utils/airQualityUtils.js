// src/utils/airQualityUtils.js

/**
 * Clasifica la calidad del aire según PM2.5
 */
export const clasificarCalidadAire = (pm25) => {
  if (pm25 <= 12) return { 
    categoria: 'Buena', 
    nivel: 'A01', 
    color: '#00E400',
    descripcion: 'Calidad del aire satisfactoria, riesgo mínimo'
  };
  if (pm25 <= 35) return { 
    categoria: 'Moderada', 
    nivel: 'A02', 
    color: '#FFFF00',
    descripcion: 'Calidad aceptable, riesgo moderado para grupos sensibles'
  };
  if (pm25 <= 55) return { 
    categoria: 'Pobre', 
    nivel: 'A03', 
    color: '#FF7E00',
    descripcion: 'Efectos en la salud, grupos sensibles deben evitar actividades exteriores'
  };
  if (pm25 <= 150) return { 
    categoria: 'Muy Pobre', 
    nivel: 'A04', 
    color: '#FF0000',
    descripcion: 'Efectos graves en la salud, todos deben evitar actividades exteriores'
  };
  return { 
    categoria: 'Peligrosa', 
    nivel: 'A05', 
    color: '#8F3F97',
    descripcion: 'Alerta de salud, condiciones de emergencia'
  };
};

/**
 * Formatea fecha para mostrar
 */
export const formatearFecha = (fechaISO) => {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Obtiene icono según calidad del aire
 */
export const obtenerIconoCalidad = (categoria) => {
  const iconos = {
    'Buena': '🌤️',
    'Moderada': '⚠️',
    'Pobre': '🚨',
    'Muy Pobre': '💀',
    'Peligrosa': '🔥'
  };
  return iconos[categoria] || '🔍';
};

/**
 * Calcula el porcentaje de calidad (para progress bars)
 */
export const calcularPorcentajeCalidad = (pm25) => {
  // Invertido: menor PM2.5 = mayor porcentaje (mejor calidad)
  const maxPm25 = 150;
  const porcentaje = Math.max(0, 100 - (pm25 / maxPm25) * 100);
  return Math.round(porcentaje);
};

/**
 * Extrae recomendaciones principales del texto de Gemini
 */
export const extraerRecomendacionesPrincipales = (textoRecomendaciones) => {
  if (!textoRecomendaciones) return [];
  
  const lineas = textoRecomendaciones.split('\n');
  const recomendaciones = [];
  
  lineas.forEach(linea => {
    if (linea.includes('•') && !linea.includes('⚠️') && !linea.includes('🚨')) {
      const recomendacion = linea.replace('•', '').trim();
      if (recomendacion && recomendacion.length > 10) {
        recomendaciones.push(recomendacion);
      }
    }
  });
  
  return recomendaciones.slice(0, 3); // Máximo 3 recomendaciones
};