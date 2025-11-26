'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { GoogleMap, Marker, InfoWindow, Polygon, useJsApiLoader } from '@react-google-maps/api';

// Coordenadas de los 6 estados/ciudades principales de Michoacán
const estados = [
  { nombre: 'Morelia', lat: 19.7008, lng: -101.1844 },
  { nombre: 'Uruapan', lat: 19.4216, lng: -102.0576 },
  { nombre: 'Zamora', lat: 19.9856, lng: -102.2833 },
  { nombre: 'Lázaro Cárdenas', lat: 17.9589, lng: -102.2 },
  { nombre: 'Zitácuaro', lat: 19.4361, lng: -100.3573 },
  { nombre: 'Apatzingán', lat: 19.0833, lng: -102.35 }
];

// Coordenadas aproximadas para delimitar Michoacán
const michoacanCoords = [
  { lat: 20.397, lng: -103.520 },
  { lat: 20.397, lng: -100.150 },
  { lat: 17.916, lng: -100.150 },
  { lat: 17.916, lng: -103.520 },
];

export default function MapaGoogleMichoacan() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState(null);
  const [iconosDinamicos, setIconosDinamicos] = useState({});
  const [datosAire, setDatosAire] = useState({});

  // --- API Key de Google Maps ---
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyAv0uz48-sIpfzDw2MKVryibebp95izmNU', // <-- Poner tu clave
    libraries: ['places'],
  });

  const onLoad = useCallback((map) => {
    const bounds = new window.google.maps.LatLngBounds();
    michoacanCoords.forEach(coord => bounds.extend(coord));
    map.fitBounds(bounds);
  }, []);

  // --- Cambios constantes de iconos ---
  const getIcon = (colorCode) => {
    switch(colorCode){
      case 1: return "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
      case 2: return "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
      case 3: return "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
      default: return "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
    }
  };

  // --- Generar valores aleatorios de AQI para los estados ---
  const generarDatosAire = () => {
    const datos = {};
    estados.forEach(e => {
      const randomAQI = Math.floor(Math.random() * 3) + 1; // 1=buena,2=moderada,3=mala
      datos[e.nombre] = {
        aqi: randomAQI,
        descripcion: randomAQI === 1 ? 'Buena' : randomAQI === 2 ? 'Moderada' : 'Mala',
        temp: (Math.random() * 10 + 20).toFixed(1), // temperatura simulada
        humedad: Math.floor(Math.random() * 40 + 40) // humedad simulada
      };
    });
    return datos;
  };

  useEffect(() => {
    const updateIcons = () => {
      const nuevosIconos = {};
      const nuevosDatos = generarDatosAire();
      estados.forEach(e => {
        nuevosIconos[e.nombre] = getIcon(nuevosDatos[e.nombre].aqi);
      });
      setIconosDinamicos(nuevosIconos);
      setDatosAire(nuevosDatos);
    };

    updateIcons();
    const interval = setInterval(updateIcons, 5000); // Cambia cada 5 segundos
    return () => clearInterval(interval);
  }, []);

  if(!isLoaded) return <p className="text-center mt-10">Cargando mapa…</p>;

  return (
    <div className="flex min-h-screen flex-col bg-blue-50">
      <main className={`flex-1 flex flex-col items-center pt-20 p-6 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <h1 className="text-3xl font-bold mb-6 text-center text-black">
          Mapa de Michoacán
        </h1>

        {/* Información de calidad del aire de todos los estados con iconos */}
        {estadoSeleccionado && (
          <div className="w-full max-w-6xl mb-6 flex flex-wrap justify-around gap-2">
            {estados.map(e => (
              <div key={e.nombre} className="flex flex-col items-center bg-white p-3 rounded-lg shadow-md w-40 text-black">
                <h2 className="font-semibold text-center mb-1">{e.nombre}</h2>
                <div className="flex items-center mb-1">
                  <span className="mr-1">🌡</span>
                  <span>{datosAire[e.nombre]?.temp}°C</span>
                </div>
                <div className="flex items-center mb-1">
                  <span className="mr-1">💧</span>
                  <span>{datosAire[e.nombre]?.humedad}%</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-1">🌫</span>
                  <span>{datosAire[e.nombre]?.descripcion}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mapa */}
        <div className="w-full max-w-6xl h-[600px] rounded-xl shadow-lg overflow-hidden relative">
          <GoogleMap
            center={{ lat: 19.5, lng: -101.5 }}
            zoom={7}
            mapContainerStyle={{ width: '100%', height: '100%' }}
            onLoad={onLoad}
          >
            <Polygon
              paths={michoacanCoords}
              options={{
                fillColor: "#e6f7ff",
                fillOpacity: 0.2,
                strokeColor: "#1890ff",
                strokeOpacity: 0.8,
                strokeWeight: 2
              }}
            />

            {estados.map((e, idx) => (
              <Marker
                key={idx}
                position={{ lat: e.lat, lng: e.lng }}
                onClick={() => setEstadoSeleccionado(e.nombre)}
                icon={{
                  url: iconosDinamicos[e.nombre],
                  scaledSize: new window.google.maps.Size(40, 40)
                }}
              />
            ))}

            {estadoSeleccionado && (
              <InfoWindow
                position={{
                  lat: estados.find(e => e.nombre === estadoSeleccionado).lat,
                  lng: estados.find(e => e.nombre === estadoSeleccionado).lng
                }}
                onCloseClick={() => setEstadoSeleccionado(null)}
              >
                <div className="text-center text-black">
                  <h2 className="text-lg font-bold mb-1">{estadoSeleccionado}</h2>
                  <p>🌡 Temp: {datosAire[estadoSeleccionado]?.temp}°C</p>
                  <p>💧 Humedad: {datosAire[estadoSeleccionado]?.humedad}%</p>
                  <p>🌫 Calidad del aire: {datosAire[estadoSeleccionado]?.descripcion}</p>
                </div>
              </InfoWindow>
            )}

          </GoogleMap>
        </div>

     
      </main>
    </div>
  );
}
