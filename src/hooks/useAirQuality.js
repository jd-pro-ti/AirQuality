// src/hooks/useAirQuality.js
import { useState, useEffect, useRef } from 'react';
import { apiServices } from '../services/api';

export const useAirQuality = (ciudad = null) => {
  const [datos, setDatos] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const intervaloRef = useRef(null);

  // Obtener datos por ciudad
  const obtenerPorCiudad = async (nombreCiudad = ciudad) => {
    if (!nombreCiudad) return;
    
    setLoading(true);
    setError(null);
    try {
      const resultado = await apiServices.sensores.obtenerPorCiudad(nombreCiudad);
      
      if (resultado && resultado.ok && resultado.datos) {
        setDatos(resultado);
      } else {
        setError(resultado?.msg || 'No se encontraron datos para esta ciudad');
        setDatos(null);
      }
    } catch (err) {
      setError(err.message);
      setDatos(null);
      console.error('Error en obtenerPorCiudad:', err);
    } finally {
      setLoading(false);
    }
  };

  // Obtener última medición
  const obtenerUltima = async () => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await apiServices.sensores.obtenerUltima();
      if (resultado && resultado.ok) {
        setDatos(resultado);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Iniciar polling automático
  const iniciarPolling = (ciudadPolling = ciudad, intervalo = 30000) => { // 30 segundos
    detenerPolling(); // Limpiar cualquier intervalo existente
    
    console.log('🔄 Iniciando actualización automática cada', intervalo / 1000, 'segundos');
    
    intervaloRef.current = setInterval(() => {
      console.log('🔄 Actualizando datos automáticamente...');
      if (ciudadPolling) {
        obtenerPorCiudad(ciudadPolling);
      } else {
        obtenerUltima();
      }
    }, intervalo);
  };

  // Detener polling
  const detenerPolling = () => {
    if (intervaloRef.current) {
      clearInterval(intervaloRef.current);
      intervaloRef.current = null;
      console.log('⏸️ Actualización automática detenida');
    }
  };

  // Obtener ciudades disponibles
  const obtenerCiudades = async () => {
    setLoading(true);
    try {
      const resultado = await apiServices.sensores.obtenerCiudades();
      return resultado.ciudades || [];
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar datos iniciales y iniciar polling
  useEffect(() => {
    if (ciudad) {
      obtenerPorCiudad(ciudad);
      // Iniciar polling después de 3 segundos de la carga inicial
      const timeoutId = setTimeout(() => {
        iniciarPolling(ciudad, 30000); // 30 segundos
      }, 3000);
      
      return () => {
        clearTimeout(timeoutId);
        detenerPolling();
      };
    }
  }, [ciudad]);

  return {
    datos,
    loading,
    error,
    obtenerPorCiudad: (nuevaCiudad) => {
      detenerPolling();
      obtenerPorCiudad(nuevaCiudad);
      // Reiniciar polling con la nueva ciudad después de un delay
      setTimeout(() => iniciarPolling(nuevaCiudad, 30000), 3000);
    },
    obtenerUltima,
    obtenerCiudades,
    iniciarPolling,
    detenerPolling,
    recargar: () => ciudad ? obtenerPorCiudad(ciudad) : obtenerUltima()
  };
};