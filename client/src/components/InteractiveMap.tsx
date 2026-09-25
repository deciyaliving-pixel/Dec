import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";
import type { Destination } from "@staykhoj/shared";

const pinIcon = L.divIcon({
  className: "",
  html: `<svg width="30" height="38" viewBox="0 0 30 38" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 0C6.7 0 0 6.7 0 15c0 10.5 15 23 15 23s15-12.5 15-23c0-8.3-6.7-15-15-15z" fill="#B9451D" stroke="#F1E7D2" stroke-width="1.5"/>
    <circle cx="15" cy="15" r="5.5" fill="#F1E7D2"/>
  </svg>`,
  iconSize: [30, 38],
  iconAnchor: [15, 38],
  popupAnchor: [0, -34],
});

export function InteractiveMap({ destinations }: { destinations: Destination[] }) {
  return (
    <MapContainer
      center={[15.5, 78]}
      zoom={5}
      scrollWheelZoom
      style={{ height: "100%", width: "100%" }}
      aria-label="Map of StayKhoj destinations across India"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {destinations.map((d) => (
        <Marker key={d.slug} position={[d.lat, d.lng]} icon={pinIcon}>
          <Popup>
            <p className="font-display text-base font-semibold">{d.title}</p>
            <p className="mt-1 text-sm text-ink-500">{d.dek}</p>
            <Link
              to={`/regions/${d.regionSlugs[0]}/destinations/${d.slug}`}
              className="mt-2 inline-block text-sm font-medium text-vermilion hover:underline"
            >
              Read the guide &rarr;
            </Link>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
