  // components/MapaLeafletInner.jsx
  'use client';

  import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap } from "react-leaflet";
  import { Icon } from "leaflet";
  import { useEffect, useState } from "react";
  import "leaflet/dist/leaflet.css";
  import { useMapa, michoacanCoords, getMarkerIcon } from "@/hooks/useMapa";

  const defaultCenter = [19.5, -101.5];

  // 🔧 Fix para el redimensionamiento
  function MapResizeFix() {
    const map = useMap();

    useEffect(() => {
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }, [map]);

    return null;
  }

  // 🔧 Fix para asegurar que el mapa se renderice correctamente
  function MapInitializer() {
    const map = useMap();

    useEffect(() => {
      const timer = setTimeout(() => {
        map.invalidateSize();
        map.setView(defaultCenter, 7);
      }, 300);

      return () => clearTimeout(timer);
    }, [map]);

    return null;
  }

  export default function MapaLeafletInner() {
    const { ciudades, datosCiudades, isLoading } = useMapa();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      setIsMounted(true);
      
      // Fix para íconos de Leaflet
      delete Icon.Default.prototype._getIconUrl;
      Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
    }, []);

    if (!isMounted) {
      return (
        <div className="w-full h-[600px] rounded-xl overflow-hidden shadow-xl bg-gray-200 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Inicializando mapa...</p>
          </div>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="w-full h-[600px] rounded-xl overflow-hidden shadow-xl bg-gray-200 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando datos de ciudades...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full h-[600px] rounded-xl overflow-hidden shadow-xl bg-transparent relative">
        <MapContainer
          center={defaultCenter}
          zoom={7}
          style={{ 
            height: "100%", 
            width: "100%",
            background: "#f8fafc"
          }}
          scrollWheelZoom={true}
        >
          <MapInitializer />
          <MapResizeFix />

          {/* 🗺️ Mapa claro */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* 🔵 Polígono de Michoacán */}
          <Polygon
            positions={michoacanCoords.map(c => [c.lat, c.lng])}
            pathOptions={{
              color: "#2563eb",
              fillColor: "rgba(37, 99, 235, 0.2)",
              weight: 2,
              fillOpacity: 0.3
            }}
          />

          {/* 📍 Marcadores dinámicos */}
          {ciudades.map(ciudad => {
            const datos = datosCiudades[ciudad.id];
            if (!datos) return null;

            const markerIcon = new Icon({
              iconUrl: getMarkerIcon(datos.pm25),
              iconSize: [35, 35],
              iconAnchor: [17, 35],
              popupAnchor: [0, -35]
            });

            return (
              <Marker
                key={ciudad.id}
                position={[ciudad.lat, ciudad.lng]}
                icon={markerIcon}
              >
                <Popup>
                  <div className="min-w-[200px]">
                    <b className="text-lg">{ciudad.nombreMostrar}</b><br />
                    <div className="mt-2 space-y-1">
                      <div><span className="font-semibold">PM2.5:</span> {datos.pm25} µg/m³</div>
                      <div><span className="font-semibold">AQI:</span> {datos.aqi}</div>
                      <div><span className="font-semibold">Nivel:</span> {datos.nivel}</div>
                      <div><span className="font-semibold">Temperatura:</span> {datos.temperatura}°C</div>
                      <div><span className="font-semibold">Humedad:</span> {datos.humedad}%</div>
                      <div className="text-xs text-gray-500 mt-2">
                        Última actualización:<br />
                        {datos.fechaHumana}
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    );
  }   