import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

interface HeatmapLayerProps {
  points: [number, number, number][]; // [lat, lng, intensity]
  options?: any;
}

const HeatmapLayer: React.FC<HeatmapLayerProps> = ({ points, options }) => {
  const map = useMap();

  useEffect(() => {
    if (!points || points.length === 0) return;

    // Ensure L.heatLayer exists (plugin side-effect)
    if (!(L as any).heatLayer) {
      console.error('Leaflet Heat plugin not loaded correctly');
      return;
    }

    const heatLayer = (L as any).heatLayer(points, {
      radius: 35, // Increased radius for visibility
      blur: 20,
      maxZoom: 18,
      gradient: { 0.4: '#00f5ff', 0.65: '#fbbf24', 1: '#f87171' },
      ...options
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points, options]);

  return null;
};

export default HeatmapLayer;
