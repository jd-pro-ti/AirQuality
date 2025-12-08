// hooks/useMapa.js
import { useState, useEffect, useCallback } from 'react';
import { apiServices } from '@/services/api';

// Coordenadas aproximadas para delimitar Michoacán
export const michoacanCoords = [
  { lat: 20.397, lng: -103.520 },
  { lat: 20.397, lng: -100.150 },
  { lat: 17.916, lng: -100.150 },
  { lat: 17.916, lng: -103.520 },
];

// Helper functions para calidad del aire
export const getAqiLevel = (pm25) => {
  if (pm25 <= 12) return 'Buena';
  if (pm25 <= 35.4) return 'Moderada';
  if (pm25 <= 55.4) return 'No saludable';
  if (pm25 <= 150.4) return 'Muy no saludable';
  return 'Peligrosa';
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

export const getMarkerIcon = (pm25) => {
  const level = getAqiLevel(pm25);
  switch(level) {
    case 'Buena': return "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
    case 'Moderada': return "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
    case 'No saludable': return "http://maps.google.com/mapfiles/ms/icons/orange-dot.png";
    case 'Muy no saludable': return "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
    case 'Peligrosa': return "http://maps.google.com/mapfiles/ms/icons/purple-dot.png";
    default: return "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
  }
};

export const useMapa = () => {
  const [ciudades, setCiudades] = useState([]);
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState(null);
  const [datosCiudades, setDatosCiudades] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Coordenadas predefinidas para las ciudades de Michoacán
  const coordenadasCiudades = {
    'maravatio': { lat: 19.8917, lng: -100.4444, nombre: 'Maravatío' },
    'copandaro': { lat: 19.9167, lng: -101.2167, nombre: 'Copándaro' },
    'el_manzanillal': { lat: 19.7833, lng: -101.1333, nombre: 'El Manzanillal' },
    'el_meson': { lat: 19.8500, lng: -101.0333, nombre: 'El Mesón' },
    'gabriel_zamora': { lat: 19.1500, lng: -102.0500, nombre: 'Gabriel Zamora' },
    'la_cadenita': { lat: 19.8000, lng: -101.1000, nombre: 'La Cadenita' },
    'lazaro_cardenas': { lat: 17.9583, lng: -102.2000, nombre: 'Lázaro Cárdenas' },
    'nuevo_urecho': { lat: 19.1667, lng: -101.8667, nombre: 'Nuevo Urecho' },
    'patzcuaro': { lat: 19.5167, lng: -101.6083, nombre: 'Pátzcuaro' },
    'santiago_undameo': { lat: 19.6500, lng: -101.2833, nombre: 'Santiago Undameo' },
    'taretan': { lat: 19.3333, lng: -101.9167, nombre: 'Taretán' },
    'ubicacion_desconocida': { lat: 19.7000, lng: -101.1844, nombre: 'Ubicación Desconocida' }
  };

  // Cargar lista de ciudades disponibles
  const cargarCiudades = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await apiServices.sensores.obtenerCiudades();
      
      if (data.ok && data.ciudades) {
        const ciudadesConCoordenadas = data.ciudades.map(ciudad => ({
          id: ciudad.id,
          nombre: ciudad.nombre,
          nombreMostrar: coordenadasCiudades[ciudad.id]?.nombre || ciudad.nombre,
          lat: coordenadasCiudades[ciudad.id]?.lat || 19.5,
          lng: coordenadasCiudades[ciudad.id]?.lng || -101.5,
          totalMediciones: ciudad.total_mediciones,
          ultimaActualizacion: ciudad.ultima_actualizacion
        }));

        setCiudades(ciudadesConCoordenadas);
        return ciudadesConCoordenadas;
      }
      return [];
    } catch (error) {
      console.error('Error cargando ciudades:', error);
      setError('Error al cargar la lista de ciudades');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cargar datos de una ciudad específica
  const cargarDatosCiudad = useCallback(async (ciudadId) => {
    try {
      const data = await apiServices.sensores.obtenerPorCiudad(ciudadId);
      
      if (data.ok && data.datos) {
        const datosProcesados = {
          ciudad: data.ciudad,
          pm25: data.datos.pm25 || 0,
          pm10: data.datos.pm10 || 0,
          temperatura: data.datos.temperatura || 0,
          humedad: data.datos.humedad || 0,
          aqi: data.datos.aqi || 0,
          co2: data.datos.co2 || 0,
          nivel: getAqiLevel(data.datos.pm25 || 0),
          fechaHumana: data.datos.fecha_humana || 'Desconocida',
          gps: data.datos.gps || null
        };

        setDatosCiudades(prev => ({
          ...prev,
          [ciudadId]: datosProcesados
        }));

        return datosProcesados;
      }
      return null;
    } catch (error) {
      console.error(`Error cargando datos de ${ciudadId}:`, error);
      // Datos por defecto en caso de error
      const datosDefault = {
        ciudad: ciudadId,
        pm25: 25,
        pm10: 40,
        temperatura: 22.5,
        humedad: 60,
        aqi: 50,
        co2: 450,
        nivel: 'Buena',
        fechaHumana: 'Desconocida',
        gps: null
      };

      setDatosCiudades(prev => ({
        ...prev,
        [ciudadId]: datosDefault
      }));

      return datosDefault;
    }
  }, []);

  // Cargar datos de todas las ciudades
  const cargarDatosTodasCiudades = useCallback(async (ciudadesLista) => {
    setIsLoading(true);
    try {
      const promesas = ciudadesLista.map(ciudad => 
        cargarDatosCiudad(ciudad.id)
      );
      await Promise.allSettled(promesas);
    } catch (error) {
      console.error('Error cargando datos de ciudades:', error);
      setError('Error al cargar datos de las ciudades');
    } finally {
      setIsLoading(false);
    }
  }, [cargarDatosCiudad]);

  // Seleccionar una ciudad
  const seleccionarCiudad = useCallback(async (ciudadId) => {
    const ciudad = ciudades.find(c => c.id === ciudadId);
    if (!ciudad) return;

    setCiudadSeleccionada(ciudad);
    
    // Si no tenemos datos de esta ciudad, cargarlos
    if (!datosCiudades[ciudadId]) {
      await cargarDatosCiudad(ciudadId);
    }
  }, [ciudades, datosCiudades, cargarDatosCiudad]);

  // Inicializar datos
  useEffect(() => {
    const inicializar = async () => {
      const ciudadesLista = await cargarCiudades();
      if (ciudadesLista.length > 0) {
        await cargarDatosTodasCiudades(ciudadesLista);
      }
    };

    inicializar();
  }, [cargarCiudades, cargarDatosTodasCiudades]);

  // Función para actualizar datos
  const actualizarDatos = useCallback(async () => {
    if (ciudades.length > 0) {
      await cargarDatosTodasCiudades(ciudades);
    } else {
      // Si no hay ciudades, recargar todo
      const ciudadesLista = await cargarCiudades();
      if (ciudadesLista.length > 0) {
        await cargarDatosTodasCiudades(ciudadesLista);
      }
    }
  }, [ciudades, cargarCiudades, cargarDatosTodasCiudades]);

  return {
    // Estado
    ciudades,
    ciudadSeleccionada,
    datosCiudades,
    isLoading,
    error,
    
    // Funciones
    seleccionarCiudad,
    actualizarDatos,
    setCiudadSeleccionada,
    cargarCiudades,
    cargarDatosCiudad
  };
};