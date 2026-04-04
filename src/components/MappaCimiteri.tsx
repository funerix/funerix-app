'use client'

import { useEffect, useState } from 'react'
import { MapPin } from 'lucide-react'
import { cimiteriCampania } from '@/lib/cimiteri-campania'

export function MappaCimiteri() {
  const [MapComponent, setMapComponent] = useState<React.ComponentType | null>(null)

  useEffect(() => {
    // Dynamic import per evitare SSR issues con Leaflet
    import('react-leaflet').then(({ MapContainer, TileLayer, Marker, Popup }) => {
      import('leaflet').then((L) => {
        // Fix icone Leaflet
        const icon = L.icon({
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        })
        const cremIcon = L.icon({
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          className: 'hue-rotate-180',
        })

        const Map = () => (
          <>
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
            <MapContainer center={[40.85, 14.27]} zoom={9} style={{ height: '100%', width: '100%', borderRadius: 12 }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
              {cimiteriCampania.map((c, i) => (
                <Marker key={i} position={[c.lat, c.lng]} icon={c.tipo === 'crematorio' ? cremIcon : icon}>
                  <Popup>
                    <strong>{c.nome}</strong><br />{c.comune}<br />
                    <span style={{ color: c.tipo === 'crematorio' ? '#C0392B' : '#6B8E6B', fontSize: 11 }}>
                      {c.tipo === 'crematorio' ? '🔥 Crematorio' : '⛪ Cimitero'}
                    </span>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </>
        )
        setMapComponent(() => Map)
      })
    })
  }, [])

  if (!MapComponent) {
    return (
      <div className="h-full flex items-center justify-center bg-background-dark rounded-xl">
        <div className="text-center text-text-muted">
          <MapPin size={24} className="mx-auto mb-2 animate-pulse" />
          <p className="text-sm">Caricamento mappa...</p>
        </div>
      </div>
    )
  }

  return <MapComponent />
}
