import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

export default function LocationAutocompleteMap({ onLocationSelect, value, coords }) {
    const [suggestions, setSuggestions] = useState([]);
    const [input, setInput] = useState(value || '');
    const [position, setPosition] = useState(coords || null);

    // Caută sugestii la fiecare tastare
    const handleInput = async (e) => {
        const val = e.target.value;
        setInput(val);
        if (val.length < 3) {
            setSuggestions([]);
            return;
        }
        const res = await fetch(
            `https://corsproxy.io/?https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}`
        );
        const data = await res.json();
        setSuggestions(data);
    };

    // Când selectezi o sugestie
    const handleSelect = (s) => {
        setInput(s.display_name);
        setSuggestions([]);
        setPosition([parseFloat(s.lat), parseFloat(s.lon)]);
        onLocationSelect({
            address: s.display_name,
            lat: parseFloat(s.lat),
            lng: parseFloat(s.lon),
        });
    };

    return (
        <div style={{ position: 'relative' }}>
            <input
                type="text"
                value={input}
                onChange={handleInput}
                placeholder="Caută oraș, adresă..."
                autoComplete="off"
                style={{ width: '100%', marginBottom: 4 }}
            />
            {suggestions.length > 0 && (
                <ul style={{ background: 'white', border: '1px solid #ccc', maxHeight: 150, overflowY: 'auto', position: 'absolute', zIndex: 1000, width: '100%' }}>
                    {suggestions.map((s, idx) => (
                        <li key={idx} onClick={() => handleSelect(s)} style={{ cursor: 'pointer', padding: 4 }}>
                            {s.display_name}
                        </li>
                    ))}
                </ul>
            )}
            <div style={{ height: 250, marginTop: 10 }}>
                <MapContainer
                    center={position || [45.9432, 24.9668]}
                    zoom={position ? 13 : 6}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {position && <Marker position={position} icon={redIcon} />}
                </MapContainer>
            </div>
        </div>
    );
} 