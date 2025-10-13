import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
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

function MapUpdater({ position }) {
    const map = useMap();
    
    useEffect(() => {
        if (position) {
            map.flyTo(position, 13, {
                duration: 1.5
            });
        }
    }, [position, map]);
    
    return null;
}

export default function LocationAutocompleteMap({ onLocationSelect, value, coords }) {
    const [suggestions, setSuggestions] = useState([]);
    const [input, setInput] = useState(value || '');
    const [position, setPosition] = useState(coords || null);

    useEffect(() => {
        setInput(value || '');
    }, [value]);

    useEffect(() => {
        setPosition(coords || null);
    }, [coords]);

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
                placeholder="Tastează pentru a căuta: Târgu Jiu, București, Cluj-Napoca..."
                autoComplete="off"
                style={{ 
                    width: '100%', 
                    padding: '10px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    marginBottom: 4
                }}
                onFocus={(e) => e.target.style.borderColor = '#3498db'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
            {suggestions.length > 0 && (
                <ul style={{ 
                    background: 'white', 
                    border: '1px solid #ddd', 
                    borderRadius: '4px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    maxHeight: 200, 
                    overflowY: 'auto', 
                    position: 'absolute', 
                    zIndex: 10000, 
                    width: '100%',
                    margin: 0,
                    padding: 0,
                    listStyle: 'none'
                }}>
                    {suggestions.map((s, idx) => (
                        <li 
                            key={idx} 
                            onClick={() => handleSelect(s)} 
                            style={{ 
                                cursor: 'pointer', 
                                padding: '10px 12px',
                                borderBottom: idx < suggestions.length - 1 ? '1px solid #f0f0f0' : 'none',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                        >
                            📍 {s.display_name}
                        </li>
                    ))}
                </ul>
            )}
            <div style={{ height: 250, marginTop: 10 }}>
                <MapContainer
                    center={position || [45.9432, 24.9668]}
                    zoom={position ? 13 : 6}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={true}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <MapUpdater position={position} />
                    {position && <Marker position={position} icon={redIcon} />}
                </MapContainer>
            </div>
        </div>
    );
} 