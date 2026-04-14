import { useEffect } from 'react';
import { TileLayer, useMap } from 'react-leaflet';
import { TILE_LAYERS } from './MapViewSelector';

// Traffic overlay — uses a separate semi-transparent layer on top
const TRAFFIC_OVERLAY = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

const DynamicTileLayer = ({ activeView }) => {
  const map = useMap();

  // For satellite view, darken the map slightly for better marker visibility
  useEffect(() => {
    const container = map.getContainer();
    if (activeView === 'satellite') {
      container.style.filter = 'brightness(0.9) contrast(1.1)';
    } else {
      container.style.filter = '';
    }
    return () => { container.style.filter = ''; };
  }, [activeView, map]);

  // Service views (police/hospital/emergency) use normal map tiles
  const tileKey = TILE_LAYERS[activeView] ? activeView : 'map';
  const layer = TILE_LAYERS[tileKey] || TILE_LAYERS.map;

  return (
    <>
      <TileLayer
        key={tileKey}
        url={layer.url}
        attribution={layer.attribution}
        maxZoom={19}
      />
      {/* Traffic overlay — red/orange semi-transparent layer */}
      {activeView === 'traffic' && (
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution=""
          opacity={0.3}
          className="traffic-overlay"
        />
      )}
    </>
  );
};

export default DynamicTileLayer;
