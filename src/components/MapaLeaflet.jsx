'use client';

import dynamic from "next/dynamic";
import Loader from "@/components/Loader";

const MapaLeaflet = dynamic(
  () => import("./MapaLeafletInner"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-96">
        <Loader />
      </div>
    ),
  }
);

export default MapaLeaflet;
