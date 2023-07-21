import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { useRef, useEffect } from "react";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import { useSelector } from "react-redux";
import "./map.css";
const Map = () => {
  const {
    formValues: {
      locationValue: {
        coordinate: { lat, lon },
      },
    },
  } = useSelector((state) => state.addParkomatSlice);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const tileLayerRef = useRef(null);
  const defaultIcon = L.icon({
    iconUrl: iconUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    shadowSize: [41, 41],
    shadowAnchor: [12, 41],
  });

 useEffect(() => {
    if (mapRef.current) {
      if (markerRef.current) {
        markerRef.current.remove();
      }

      mapRef.current.fitBounds([[lat, lon]]);

      markerRef.current = L.marker([lat, lon], { icon: defaultIcon }).addTo(
        mapRef.current
      );
    } else {
      mapRef.current = L.map("map").setView([lat, lon], 13);
      tileLayerRef.current = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution: "",
        }
      ).addTo(mapRef.current);
    }
  }, [lat, lon]); 


  return (
    
    <div id="map" ></div>
  );
};

export default Map;
