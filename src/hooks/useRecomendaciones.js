// src/hooks/useRecomendaciones.js
import { useState } from 'react';
import { apiServices } from '../services/api';

export const useRecomendaciones = () => {
  const [recomendaciones, setRecomendaciones] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const obtenerRecomendaciones = async (ciudad) => {
    if (!ciudad) return;
    
    setLoading(true);
    setError(null);
    try {
      const resultado = await apiServices.recomendaciones.obtenerRecomendaciones(ciudad);
      if (resultado.ok) {
        setRecomendaciones(resultado);
      } else {
        setError(resultado.msg || 'Error al obtener recomendaciones');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const obtenerRecomendacionesRapidas = async (ciudad) => {
    if (!ciudad) return;
    
    setLoading(true);
    try {
      const resultado = await apiServices.recomendaciones.obtenerRecomendacionesRapidas(ciudad);
      return resultado;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const obtenerEstadisticas = async () => {
    try {
      const resultado = await apiServices.recomendaciones.obtenerEstadisticas();
      return resultado;
    } catch (err) {
      console.error('Error obteniendo estadísticas:', err);
      return null;
    }
  };

  return {
    recomendaciones,
    loading,
    error,
    obtenerRecomendaciones,
    obtenerRecomendacionesRapidas,
    obtenerEstadisticas
  };
};