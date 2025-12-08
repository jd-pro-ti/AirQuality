'use client';
import MapaLeaflet from "@/components/MapaLeaflet";

export default function PageMapa() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Mapa de Calidad del Aire</h1>
      <MapaLeaflet />
    </div>
  );
}
