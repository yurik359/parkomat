import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {MapContainer,TileLayer} from 'react-leaflet'
import { useRef, useEffect,useState } from "react";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import { useSelector } from "react-redux";

import "./map.css";
const Map = () => {
  const {
    formValues
  } = useSelector((state) => state.addParkomatSlice);
  const [lon,lat]=formValues.locationValue.coordinates
  const [mapData, setMapData] = useState(null);
  
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
  // const loadMapData = async () => {
  //   try {
  //     const response = await fetch('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
  //     const data = await response.json();
  //     console.log(data)
  //     setMapData(data);
  //   } catch (error) {
  //     console.error('Помилка завантаження даних карти:', error);
  //   }
  // };
  // useEffect(() => {
  //   loadMapData();
  // }, []);
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
          attribution: '',
        }
      ).addTo(mapRef.current);
    }
  }, [lat, lon]); 


  
    // if (mapData) {
    //   return (
    //     <MapContainer center={[48.8566,2.3522]} zoom={13}>
    //       <TileLayer
    //         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    //         url={mapData.tileLayerUrl}
    //       />
    //       {/* Тут можна додати інші шари або маркери на карту */}
    //     </MapContainer>
    //   );
    // } else {
    //   return <div>Завантаження карти...</div>;
    // }
    return(

    
//     <MapContainer center={[48.8566,2.3522]} zoom={13}>

// <TileLayer 
// attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// url=  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
//     </MapContainer>
// );
    <div id="map" ></div>
    )
};

export default Map;
