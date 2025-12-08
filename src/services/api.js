// src/services/api.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Cliente HTTP genérico para la API
 */
const apiClient = {
  async get(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`API Error (GET ${endpoint}):`, error);
      throw error;
    }
  }
};

/**
 * Servicios específicos para cada endpoint
 */
export const apiServices = {
  // ==================== SENSORES ====================
  sensores: {
    obtenerUltima: () => apiClient.get('/sensores/ultima'),
    // ✅ REMOVIDO: obtenerPorUbicacion ya que el endpoint no existe
    obtenerPorCiudad: (ciudad) => apiClient.get(`/sensores/ciudad?ciudad=${ciudad}`),
    obtenerCiudades: () => apiClient.get('/sensores/ciudades'),
    obtenerEstado: () => apiClient.get('/sensores/estado')
  },

  // ==================== PREDICCIÓN ====================
  prediccion: {
    obtenerPrediccion: (ciudad, dias = 7, formato = 'json') => 
      apiClient.get(`/prediccion?ciudad=${ciudad}&dias=${dias}&formato=${formato}`),
    obtenerPrediccionRapida: (ciudad) => apiClient.get(`/prediccion/rapida?ciudad=${ciudad}`),
    obtenerPatrones: (ciudad, meses = 3) => apiClient.get(`/prediccion/patrones?ciudad=${ciudad}&meses=${meses}`)
  },

  // ==================== RECOMENDACIONES ====================
  recomendaciones: {
    obtenerRecomendaciones: (ciudad) => apiClient.get(`/recomendaciones?ciudad=${ciudad}`),
    analizarContaminantes: (ciudad) => apiClient.get(`/recomendaciones/contaminantes?ciudad=${ciudad}`),
    obtenerRecomendacionesRapidas: (ciudad) => apiClient.get(`/recomendaciones/rapidas?ciudad=${ciudad}`),
    obtenerEstadisticas: () => apiClient.get('/recomendaciones/estadisticas')
  }
};

export default apiServices;