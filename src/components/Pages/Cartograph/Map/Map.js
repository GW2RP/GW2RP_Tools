import React, { Component } from 'react';

import L from 'leaflet';

import './Map.css';

class Cartograph extends Component {
    constructor(props) {
        super(props);

        this.markers = [];
    }

    componentDidMount() {
        // create map
        this.map = L.map("mapdiv", {
            minZoom: 2,
            maxZoom: 7,
            crs: L.CRS.Simple
        });

        // Add map tiles using the [[API:Tile service]]
        L.tileLayer("https://tiles.guildwars2.com/1/1/{z}/{x}/{y}.jpg", {
            attribution: "Données et images &copy; ArenaNet",
            id: 'GW2 RP Cartographe'
        }).addTo(this.map);

        // Restrict the area which can be panned to
        //  In this case we're using the coordinates for the continent of tyria from "https://api.guildwars2.com/v2/continents/1"
        var continent_dims = [49152, 49152];
        this.map.setMaxBounds(new L.LatLngBounds(this.unproject([0, 0]), this.unproject(continent_dims))); // northwest, southeast

        // Set the default viewport position (in this case the midpoint) and zoom (in this case 2)
        this.map.setView(this.unproject([(continent_dims[0] / 2), (continent_dims[1] / 2)]), 3);

        var originalInitTile = L.GridLayer.prototype._initTile
        L.GridLayer.include({
            _initTile: function (tile) {
                originalInitTile.call(this, tile);

                var tileSize = this.getTileSize();

                tile.style.width = tileSize.x + 1 + 'px';
                tile.style.height = tileSize.y + 1 + 'px';
            }
        });
    }



    componentDidUpdate(prevProps) {
        // Update rumours.

        if (this.props.rumours != prevProps.rumours) {
            // Update all rumours marker
            // (TODO: It would be more optimized to only update the marker that effectively chanded.)

            this.markers.filter(m => m.category === "rumour").forEach(m => {
                console.log(m);
            });

            this.props.rumours.forEach(r => {
                var popupContent = '<h3>' + r.name + '</h3><br>';
                popupContent += r.text.replace(/\n/g, "<br>");
                if (r.site.length > 0) {
                    popupContent += '<br><a target="_blank" href="' + r.site + '">site web</a>';
                }

                let marker = L.marker(this.unproject(r.coord)).bindPopup(popupContent);
                marker.addTo(this.map);

                this.markers.push({
                    category: "rumour",
                    marker
                });
            });
        }

        if (this.props.events != prevProps.events) {
            // Update all events marker
            // (TODO: It would be more optimized to only update the marker that effectively chanded.)

            this.markers.filter(m => m.category === "event").forEach(m => {
                console.log(m);
            });

            this.props.events.forEach(r => {
                var popupContent = '<h3>' + r.title + '</h3><br>';
                popupContent += r.description.replace(/\n/g, "<br>");
                if (r.site.length > 0) {
                    popupContent += '<br><a target="_blank" href="' + r.site + '">site web</a>';
                }

                let marker = L.marker(this.unproject(r.coord)).bindPopup(popupContent);
                marker.addTo(this.map);

                this.markers.push({
                    category: "event",
                    marker
                });
            });
        }

        if (this.props.locations != prevProps.locations) {
            // Update all locations marker
            // (TODO: It would be more optimized to only update the marker that effectively chanded.)

            this.markers.filter(m => m.category === "location").forEach(m => {
                console.log(m);
            });

            this.props.locations.forEach(r => {
                var popupContent = '<h3>' + r.name + '</h3><br>';
                popupContent += r.description.replace(/\n/g, "<br>");
                if (r.site.length > 0) {
                    popupContent += '<br><a target="_blank" href="' + r.site + '">site web</a>';
                }

                let marker = L.marker(this.unproject(r.coord)).bindPopup(popupContent);
                marker.addTo(this.map);

                this.markers.push({
                    category: "location",
                    marker
                });
            });
        }
    }



    // Conversion de lattitue/longitude en x/y carrés et vice-versa, override de unproject impl�ment�.
    //   GW2 : NO = [0,0], SE = [continent_xmax,continent_ymax];
    //   Leaflet: NO = [0,0], SE = [-256, 256]
    unproject(coord) {
        return this.map.unproject(coord, this.map.getMaxZoom());
    }

    render() {
        return (
            <div id="mapdiv" ></div>
        );
    }
}

export default Cartograph;
