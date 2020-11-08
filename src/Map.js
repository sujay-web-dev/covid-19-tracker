import React from 'react'
import { Map as LeafletMap, TileLayer } from "react-leaflet"
import "./Map.css"
import { showdataonmap } from "./util";

function Map({ countries, casestype, center, zoom}) {
    return (
        <div className="map">

            <LeafletMap center={center} zoom={zoom}>
                <TileLayer 
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* Loop through countries and draw circles on the screen */}

                {showdataonmap(countries, casestype)}

            </LeafletMap>
            
        </div>
    );
}

export default Map
