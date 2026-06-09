import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './styles.css';
import placesData from '../data/places.json';
import historyData from '../data/history.json';

type Tag = 'Local Gems' | 'Institutions' | 'Budget Eats' | 'Cafes' | 'Bakeries' | 'Late Night' | 'Vegetarian' | 'Street Food';

type Place = {
  id: string;
  name: string;
  neighborhood: string;
  lat: number;
  lng: number;
  tags: Tag[];
  price: string;
  goodForCoworking: boolean;
  vegOptions: string;
  ambiance: string;
  bestFor: string;
  hours: string;
};

type HistorySnippet = {
  neighborhood: string;
  title: string;
  summary: string;
};

const places = placesData as Place[];
const histories = historyData as HistorySnippet[];

const tagOptions: Tag[] = ['Local Gems', 'Institutions', 'Budget Eats', 'Cafes', 'Bakeries', 'Late Night', 'Vegetarian', 'Street Food'];

const tagEmoji: Record<Tag, string> = {
  'Local Gems': '💎',
  Institutions: '🏛️',
  'Budget Eats': '💰',
  Cafes: '☕',
  Bakeries: '🥐',
  'Late Night': '🌙',
  Vegetarian: '🌿',
  'Street Food': '🥣',
};

function makeMarkerIcon(active: boolean) {
  return L.divIcon({
    className: active ? 'll-marker is-active' : 'll-marker',
    html: '<span></span>',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

const userIcon = L.divIcon({
  className: 'll-user-dot',
  html: '',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function RecenterMap({ place }: { place: Place | null }) {
  const map = useMap();

  React.useEffect(() => {
    if (place) {
      map.flyTo([place.lat, place.lng], 14, { duration: 0.7 });
    }
  }, [map, place]);

  return null;
}

function App() {
  const [activeSection, setActiveSection] = useState<'map' | 'discover'>('map');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [coworkingOnly, setCoworkingOnly] = useState(false);
  const [vegFriendly, setVegFriendly] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('Indiranagar');

  const neighborhoods = useMemo(() => [...new Set(places.map((place) => place.neighborhood))].sort(), []);

  const filteredPlaces = useMemo(() => {
    return places.filter((place) => {
      const matchesTags = selectedTags.length === 0 || selectedTags.every((tag) => place.tags.includes(tag));
      const matchesCoworking = !coworkingOnly || place.goodForCoworking;
      const matchesVeg = !vegFriendly || place.vegOptions === 'good' || place.vegOptions === 'excellent' || place.tags.includes('Vegetarian');
      return matchesTags && matchesCoworking && matchesVeg;
    });
  }, [coworkingOnly, selectedTags, vegFriendly]);

  const activeHistory = histories.find((item) => item.neighborhood === selectedNeighborhood) ?? histories[0];

  function toggleTag(tag: Tag) {
    setSelectedTags((current) => (current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]));
  }

  function clearFilters() {
    setSelectedTags([]);
    setCoworkingOnly(false);
    setVegFriendly(false);
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <p className="eyebrow">Local Loop</p>
          <h1>Bengaluru</h1>
          <p>An atlas, told through food.</p>
        </div>

        <nav className="nav-card" aria-label="Primary navigation">
          <button className={activeSection === 'map' ? 'active' : ''} onClick={() => setActiveSection('map')}>
            <span className="nav-icon">⌖</span> Map
          </button>
          <button className={activeSection === 'discover' ? 'active' : ''} onClick={() => setActiveSection('discover')}>
            <span className="nav-icon">◎</span> Discover
          </button>
        </nav>

        {activeSection === 'discover' && (
          <section className="discover-panel">
            <div className="panel-kicker">Preference Match</div>
            <div className="toggle-list">
              <label><input type="checkbox" checked={coworkingOnly} onChange={(event) => setCoworkingOnly(event.target.checked)} /> Good for laptop time</label>
              <label><input type="checkbox" checked={vegFriendly} onChange={(event) => setVegFriendly(event.target.checked)} /> Strong veg options</label>
            </div>
            <label className="select-label">
              Neighborhood story
              <select value={selectedNeighborhood} onChange={(event) => setSelectedNeighborhood(event.target.value)}>
                {neighborhoods.map((neighborhood) => <option key={neighborhood}>{neighborhood}</option>)}
              </select>
            </label>
            <article className="lore-card">
              <span>Local Lore</span>
              <h2>{activeHistory.title}</h2>
              <p>{activeHistory.summary}</p>
            </article>
          </section>
        )}

        <p className="quote">“A city is the places you keep returning to.”</p>
      </aside>

      <section className="map-stage">
        <div className="chip-strip">
          <button className="filter-chip" onClick={clearFilters}>🆕 New</button>
          {tagOptions.map((tag) => (
            <button key={tag} className={selectedTags.includes(tag) ? 'filter-chip active' : 'filter-chip'} onClick={() => toggleTag(tag)}>
              <span>{tagEmoji[tag]}</span> {tag}
            </button>
          ))}
        </div>

        <MapContainer center={[12.978, 77.615]} zoom={12} minZoom={11} maxZoom={16} className="map-canvas" zoomControl={false}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[12.9716, 77.5946]} icon={userIcon} />
          {filteredPlaces.map((place) => (
            <Marker
              key={place.id}
              position={[place.lat, place.lng]}
              icon={makeMarkerIcon(selectedPlace?.id === place.id)}
              eventHandlers={{ click: () => setSelectedPlace(place) }}
            >
              <Popup>
                <strong>{place.name}</strong><br />{place.neighborhood}
              </Popup>
            </Marker>
          ))}
          <RecenterMap place={selectedPlace} />
        </MapContainer>

        <div className="map-tools" aria-hidden="true">
          <button>▧</button>
          <button>⌕</button>
        </div>
        <div className="zoom-tools" aria-hidden="true">
          <button>−</button>
          <button>+</button>
        </div>
        <button className="locate-button" aria-label="Find my location">⌾</button>
        <div className="map-count">{filteredPlaces.length} places on map</div>

        <section className={selectedPlace ? 'place-sheet open' : 'place-sheet'} aria-hidden={!selectedPlace}>
          {selectedPlace && (
            <>
              <button className="sheet-close" onClick={() => setSelectedPlace(null)} aria-label="Close details">×</button>
              <div className="sheet-kicker">{selectedPlace.neighborhood} · {selectedPlace.tags[0]}</div>
              <h2>{selectedPlace.name}</h2>
              <p className="sheet-story">{selectedPlace.bestFor}</p>
              <div className="sheet-tags">
                {selectedPlace.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
              <dl>
                <div><dt>Price</dt><dd>{selectedPlace.price}</dd></div>
                <div><dt>Ambiance</dt><dd>{selectedPlace.ambiance}</dd></div>
                <div><dt>Hours</dt><dd>{selectedPlace.hours}</dd></div>
                <div><dt>Veg</dt><dd>{selectedPlace.vegOptions}</dd></div>
              </dl>
            </>
          )}
        </section>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
