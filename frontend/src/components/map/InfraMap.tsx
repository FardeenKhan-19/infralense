import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup, Polyline } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useMapStore } from '../../store/mapStore';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import HeatmapLayer from './HeatmapLayer';
import { renderToStaticMarkup } from 'react-dom/server';
import GlassCard from '../ui/GlassCard';
import { MapPin } from 'lucide-react';
// Fix for default marker icons in Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const TILE_LAYERS = {
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri'
  },
  street: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors'
  },
  terrain: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenTopoMap'
  }
};

const MapController = () => {
  const map = useMap();
  const { focalLocation, focalBounds, analyzeArea, compareMode, setPingLocation } = useMapStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 400);
    return () => clearTimeout(timer);
  }, [map, compareMode]);

  useEffect(() => {
    if (focalBounds) {
      map.fitBounds(focalBounds, { animate: true, duration: 2 });
      analyzeArea(focalLocation!.lat, focalLocation!.lng, 'primary');
      setPingLocation(focalLocation!.lat, focalLocation!.lng);
    } else if (focalLocation) {
      map.flyTo([focalLocation.lat, focalLocation.lng], 14, { animate: true, duration: 2 });
      analyzeArea(focalLocation.lat, focalLocation.lng, 'primary');
      setPingLocation(focalLocation.lat, focalLocation.lng);
    }
  }, [focalLocation, focalBounds, map, analyzeArea, setPingLocation]);

  useEffect(() => {
    // Initial geolocation request
    map.locate({ setView: false });

    const handleLocationFound = (e: L.LocationEvent) => {
      // Guard: Don't jump to current location if user has already focused somewhere else
      const state = useMapStore.getState();
      if (!state.focalLocation && !state.pingLocation) {
        map.flyTo(e.latlng, 14, { animate: true, duration: 1.5 });
        analyzeArea(e.latlng.lat, e.latlng.lng, 'primary');
        setPingLocation(e.latlng.lat, e.latlng.lng);
      }
    };

    const handleLocationError = () => {
      console.warn('Geolocation blocked or failed. Defaulting to regional view.');
    };

    map.on('locationfound', handleLocationFound);
    map.on('locationerror', handleLocationError);

    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      setPingLocation(lat, lng);
      analyzeArea(lat, lng, 'primary');
      map.flyTo([lat, lng], map.getZoom(), { animate: true });
    });

    return () => {
      map.off('locationfound', handleLocationFound);
      map.off('locationerror', handleLocationError);
      map.off('click');
    };
  }, [map, analyzeArea]);

  return null;
};

const InfraMap: React.FC = () => {
  const { tileMode, activeFilters, heatmap, route, primaryAnalysis, pingLocation } = useMapStore();
  const analysisData = primaryAnalysis.data;
  const [complaints, setComplaints] = useState<any[]>([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(import.meta.env.VITE_API_URL + '/api/complaints', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setComplaints(res.data);
      } catch (e) {
        console.error('Failed to fetch complaints', e);
      }
    };
    fetchComplaints();
  }, []);

  const getIcon = (type: string) => {
    const config: Record<string, { color: string, icon: string, label: string }> = {
      school: { color: '#00f5ff', icon: '🏫', label: 'EDU' },
      college: { color: '#00f5ff', icon: '🏫', label: 'EDU' },
      university: { color: '#00f5ff', icon: '🎓', label: 'EDU' },
      hospital: { color: '#ff0055', icon: '🏥', label: 'HEALTH' },
      clinic: { color: '#ff0055', icon: '🏥', label: 'HEALTH' },
      doctors: { color: '#ff0055', icon: '🩺', label: 'HEALTH' },
      bank: { color: '#ffcc00', icon: '🏦', label: 'FINANCE' },
      atm: { color: '#ffcc00', icon: '💰', label: 'FINANCE' }
    };

    const settings = config[type as keyof typeof config] || { color: '#ffffff', icon: '📍', label: 'NODE' };

    return L.divIcon({
      className: 'custom-infra-icon-v2',
      html: renderToStaticMarkup(
        <div className="flex flex-col items-center group">
          <div
            className="flex items-center justify-center rounded-2xl border-2 border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.2)] relative transition-transform duration-300 group-hover:scale-125"
            style={{
              backgroundColor: settings.color,
              width: '42px',
              height: '42px',
              fontSize: '22px',
              boxShadow: `0 0 25px ${settings.color}44, inset 0 0 15px rgba(255,255,255,0.5)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10
            }}
          >
            <div className="absolute inset-0 bg-white/20 blur-sm rounded-2xl animate-pulse" />
            <span className="relative z-10 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              {settings.icon}
            </span>
          </div>
          <div className="mt-1.5 px-2 py-0.5 bg-black/80 backdrop-blur-md rounded-md border border-white/10 shadow-lg">
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white leading-none">
              {settings.label}
            </span>
          </div>
        </div>
      ),
      iconSize: [42, 60],
      iconAnchor: [21, 52]
    });
  };

  const getPingIcon = () => L.divIcon({
    className: 'ping-marker',
    html: renderToStaticMarkup(
      <div className="relative flex items-center justify-center">
        <div className="absolute w-12 h-12 bg-[var(--accent)]/30 rounded-full animate-ping"></div>
        <div className="w-10 h-10 bg-[var(--accent)] rounded-full border-2 border-white shadow-[0_0_15px_var(--accent)] flex items-center justify-center text-[#020812]">
          <MapPin size={18} fill="currentColor" />
        </div>
      </div>
    ),
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });

  const getComplaintIcon = (severity: number) => {
    const isCritical = severity > 8;
    const color = isCritical ? '#ff0000' : '#ffcc00';
    const iconStr = isCritical ? '🚨' : '⚠️';

    return L.divIcon({
      className: 'custom-complaint-icon',
      html: renderToStaticMarkup(
        <div className="flex flex-col items-center group relative z-50">
          <div
            className="flex items-center justify-center rounded-[1rem] border-2 border-white/60 shadow-[0_0_20px_rgba(255,0,0,0.5)] relative transition-transform duration-300 group-hover:scale-125 animate-pulse"
            style={{
              backgroundColor: color,
              width: '38px',
              height: '38px',
              fontSize: '20px',
              boxShadow: `0 0 25px ${color}88, inset 0 0 15px rgba(255,255,255,0.7)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span className="relative z-10 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              {iconStr}
            </span>
          </div>
          <div className="mt-1 px-2 py-0.5 bg-black/90 backdrop-blur-md rounded-md border border-[var(--danger)]/50 shadow-lg relative z-50">
            <span className={`text-[8px] font-black uppercase tracking-[0.2em] leading-none ${isCritical ? 'text-[#ff0000]' : 'text-[#ffcc00]'}`}>
              ISSUE
            </span>
          </div>
        </div>
      ),
      iconSize: [42, 60],
      iconAnchor: [21, 52]
    });
  };

  const Legend = () => (
    <div className="absolute bottom-6 left-6 z-[1000] pointer-events-auto">
      <GlassCard className="p-4 flex flex-col gap-3 backdrop-blur-3xl border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-black/40 rounded-[2rem]">
        <div className="text-[10px] font-black text-[var(--accent)] uppercase tracking-[0.4em] mb-1 opacity-80">Intelligence Grid</div>
        <div className="flex gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#00f5ff]/20 border border-[#00f5ff]/40 flex items-center justify-center text-sm shadow-[0_0_10px_rgba(0,245,255,0.2)]">🏫</div>
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Education</span>
              <span className="text-[10px] font-bold text-white tracking-tight">SCHOOLS</span>
            </div>
          </div>
          <div className="w-px h-8 bg-white/5" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#ff0055]/20 border border-[#ff0055]/40 flex items-center justify-center text-sm shadow-[0_0_10px_rgba(255,0,85,0.2)]">🏥</div>
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#ff0055]/60">Medical</span>
              <span className="text-[10px] font-bold text-white tracking-tight">HEALTH</span>
            </div>
          </div>
          <div className="w-px h-8 bg-white/5" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#ffcc00]/20 border border-[#ffcc00]/40 flex items-center justify-center text-sm shadow-[0_0_10px_rgba(255,204,0,0.2)]">🏦</div>
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#ffcc00]/60">Financial</span>
              <span className="text-[10px] font-bold text-white tracking-tight">FINANCE</span>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );

  return (
    <div className="w-full h-full relative bg-[#020812]">
      <MapContainer
        center={[20, 0]}
        zoom={3}
        zoomControl={false}
        className="w-full h-full z-0"
        ref={(instance) => {
          if (instance) (window as any).leafletMap = instance;
        }}
      >
        <TileLayer
          key={tileMode}
          url={TILE_LAYERS[tileMode].url}
          attribution={TILE_LAYERS[tileMode].attribution}
        />

        {pingLocation && (
          <Marker position={[pingLocation.lat, pingLocation.lng]} icon={getPingIcon()} />
        )}

        {heatmap.enabled && analysisData?.infraElements && (
          <HeatmapLayer
            points={analysisData.infraElements
              .filter((el: any) => el.lat && el.lon)
              .map((el: any) => [el.lat, el.lon, heatmap.intensity])}
          />
        )}

        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={50}
          showCoverageOnHover={false}
        >
          {analysisData?.infraElements?.map((el: any, i: number) => {
            const amenity = el.tags?.amenity;
            let filterKey = '';
            if (['school', 'college', 'university'].includes(amenity)) filterKey = 'schools';
            else if (['hospital', 'clinic', 'doctors'].includes(amenity)) filterKey = 'hospitals';
            else if (['bank', 'atm'].includes(amenity)) filterKey = 'banks';
            else return null;

            if (!activeFilters[filterKey as keyof typeof activeFilters]) return null;
            if (el.lat && el.lon) {
              return (
                <Marker
                  key={i}
                  position={[el.lat, el.lon]}
                  icon={getIcon(el.tags.amenity)}
                >
                  <Popup>
                    <div className="p-2 min-w-[150px]">
                      <h4 className="font-bold text-sm uppercase text-gray-800">{el.tags.amenity}</h4>
                      <p className="text-xs text-gray-600">{el.tags.name || 'Unnamed'}</p>
                    </div>
                  </Popup>
                </Marker>
              );
            }
            return null;
          })}

          {complaints.map((c: any) => (
            <Marker
              key={`comp-${c.id}`}
              position={[c.latitude, c.longitude]}
              icon={getComplaintIcon(c.severity)}
            >
              <Popup>
                <div className="p-3 min-w-[200px] font-sans">
                  <h4 className="font-black text-xs uppercase tracking-wider text-red-600 mb-2 border-b border-gray-100 pb-2">Reported: {c.category}</h4>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Severity</span>
                    <span className={`text-sm font-black ${c.severity > 8 ? 'text-red-500' : 'text-yellow-500'}`}>{c.severity}/10</span>
                  </div>
                  {c.imageUrl && (
                    <img src={c.imageUrl.startsWith('http') ? c.imageUrl : import.meta.env.VITE_API_URL + c.imageUrl} alt="Complaint Evidence" className="w-full h-32 object-cover rounded-xl mb-3 border border-gray-100 shadow-sm" />
                  )}
                  <p className="text-xs text-gray-600 font-medium leading-relaxed mb-3 break-words">{c.description || 'No detailed log provided.'}</p>
                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 p-2 rounded-lg">
                    Logged by {c.creator?.name || 'Citizen'}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>

        {route && (
          <Polyline
            positions={route.coordinates}
            color="#00f5ff"
            weight={4}
            opacity={0.8}
            dashArray="10, 10"
          />
        )}

        <MapController />
      </MapContainer>
      <Legend />
    </div>
  );
};

export default InfraMap;
