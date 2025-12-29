import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapSelectorProps {
  latitude: number;
  longitude: number;
  onChange: (lat: number, lng: number) => void;
  className?: string;
}

function LocationMarker({ position, onChange }: { position: [number, number]; onChange: (lat: number, lng: number) => void }) {
  const map = useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });

  useEffect(() => {
    map.flyTo(position, map.getZoom());
  }, [position, map]);

  return <Marker position={position} />;
}

export default function MapSelector({
  latitude,
  longitude,
  onChange,
  className = '',
}: MapSelectorProps) {
  const [position, setPosition] = useState<[number, number]>([latitude || 27.7172, longitude || 85.324]); // Default to Kathmandu
  const [latInput, setLatInput] = useState<string>(String(latitude || 27.7172));
  const [lngInput, setLngInput] = useState<string>(String(longitude || 85.324));

  useEffect(() => {
    if (latitude !== undefined && longitude !== undefined) {
      setPosition([latitude, longitude]);
      setLatInput(String(latitude));
      setLngInput(String(longitude));
    }
  }, [latitude, longitude]);

  const handlePositionChange = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    setLatInput(String(lat));
    setLngInput(String(lng));
    onChange(lat, lng);
  };

  const handleLatInputChange = (value: string) => {
    setLatInput(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setPosition([numValue, position[1]]);
      onChange(numValue, position[1]);
    }
  };

  const handleLngInputChange = (value: string) => {
    setLngInput(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setPosition([position[0], numValue]);
      onChange(position[0], numValue);
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-2">
        Select Location on Map
      </label>
      <div className="h-100 rounded-lg overflow-hidden border">
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} onChange={handlePositionChange} />
        </MapContainer>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-600">Latitude</label>
          <input
            type="text"
            value={latInput}
            onChange={(e) => handleLatInputChange(e.target.value)}
            placeholder="27.7172"
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600">Longitude</label>
          <input
            type="text"
            value={lngInput}
            onChange={(e) => handleLngInputChange(e.target.value)}
            placeholder="85.324"
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />
        </div>
      </div>
    </div>
  );
}
