import React, { Component } from 'react';

import L from 'leaflet';

import './Map.css';

import rumourIcon from './icons/20px-map-rumor.png';
import eventIcon from './icons/20px-map-generic.png';
import tavernIcon from './icons/20px-map-tavern.png';
import merchantIcon from './icons/20px-map-merchant.png';
import genericIcon from './icons/20px-map-generic-guild.png';
import festivalIcon from './icons/20px-map-explorers.png';
import guildIcon from './icons/20px-map-guild.png';
import assemblyIcon from './icons/20px-map-community.png';
import battleIcon from './icons/20px-map-battle.png';


let icons = {
    rumour: L.icon({
        iconUrl: rumourIcon,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10]
    }),
    generic: L.icon({
        iconUrl: eventIcon,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10]
    }),
    other: L.icon({
        iconUrl: genericIcon,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10]
    }),
    tavern: L.icon({
        iconUrl: tavernIcon,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -15]
    }),
    merchant: L.icon({
        iconUrl: merchantIcon,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -20]
    }),
    other: L.icon({
        iconUrl: genericIcon,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10]
    }),
    festival: L.icon({
        iconUrl: festivalIcon,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -15]
    }),
    guild: L.icon({
        iconUrl: guildIcon,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10]
    }),
    communitary: L.icon({
        iconUrl: assemblyIcon,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -15]
    }),
    fight: L.icon({
        iconUrl: battleIcon,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10]
    })
};

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
            zoomControl: false,
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
        this.map.setMaxBounds(new L.LatLngBounds(this.unproject([-5000, -5000]), this.unproject(continent_dims.map(d => d + 1000)))); // northwest, southeast

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

        L.control.zoom({
            position:'topright'
        }).addTo(this.map);

        this.map.on('click', this.onMapClick);
        this.map.on('contextmenu', this.onMapRightClick)

        this.props.listenToFocus((type, id) => {
            // Search for select marker.
            let marker = this.markers.find(marker => marker.id === id);

            if (!marker) {
                return;
            }

            this.map.setView(Object.values(marker.marker._latlng), 7);
            this.props.showSideBar(marker.object);
        });
    }

    componentDidUpdate(prevProps) {
        // Update markers with new lists.
        this.markers.filter(m => m.category === "rumour").forEach(m => {
            this.map.removeLayer(m.marker);
        });

        this.props.rumours.forEach(r => {
            var popupContent = '<h3>' + r.name + '</h3><br>';
            popupContent += r.description.replace(/\n/g, "<br>");
            if (r.site && r.site.length > 0) {
                popupContent += '<br><a target="_blank" href="' + r.site + '">site web</a>';
            }
            
            let marker = L.marker(this.unproject([r.coordinates.x, r.coordinates.y]), { icon: icons.rumour }).bindPopup(popupContent);
            marker.on('click', (e) => {
                this.props.showSideBar(r);
            });
            marker.addTo(this.map);

            this.markers.push({
                category: "rumour",
                id: r._id,
                object: r,
                marker
            });
        });

        this.markers.filter(m => m.category === "event").forEach(m => {
            this.map.removeLayer(m.marker);
        });

        this.props.events.forEach(r => {
            var popupContent = '<h3>' + r.name + '</h3><br>';
            popupContent += r.description.replace(/\n/g, "<br>");
            if (r.site && r.site.length > 0) {
                popupContent += '<br><a target="_blank" href="' + r.site + '">site web</a>';
            }

            let marker = L.marker(this.unproject([r.coordinates.x, r.coordinates.y]), { icon: icons[r.icon] }).bindPopup(popupContent);
            marker.on('click', (e) => {
                this.props.showSideBar(r);
            });
            marker.addTo(this.map);

            this.markers.push({
                category: "event",
                id: r._id,
                object: r,
                marker
            });
        });

        this.markers.filter(m => m.category === "location").forEach(m => {
            this.map.removeLayer(m.marker);
        });

        this.props.locations.forEach(r => {
            var popupContent = '<h3>' + r.name + '</h3><br>';
            popupContent += r.description.replace(/\n/g, "<br>");
            if (r.site && r.site.length > 0) {
                popupContent += '<br><a target="_blank" href="' + r.site + '">site web</a>';
            }

            let marker = L.marker(this.unproject([r.coordinates.x, r.coordinates.y]), { icon: icons[r.icon] }).bindPopup(popupContent);
            marker.on('click', (e) => {
                this.props.showSideBar(r);
            });
            marker.addTo(this.map);

            this.markers.push({
                category: "location",
                id: r._id,
                object: r,
                marker
            });
        });
    }

    // Conversion de lattitue/longitude en x/y carrés et vice-versa, override de unproject impl�ment�.
    //   GW2 : NO = [0,0], SE = [continent_xmax,continent_ymax];
    //   Leaflet: NO = [0,0], SE = [-256, 256]
    unproject(coord) {
        return this.map.unproject(coord, this.map.getMaxZoom());
    }

    onMapClick = (e) => {
        console.log("Left Click.");
        
        // Close Sidebar.
        this.props.hideSideBar();
        
        return false;
    }

    onMapRightClick = (e) => {
        console.log("Right click.");
        
        this.props.hideSideBar();

        const point = this.map.project(e.latlng, this.map.getMaxZoom());
        // point.x, point.y
        if (this.props.isSignedIn()) {
            console.log("Add marker");
            this.props.toggleNewMarkerModal([point.x, point.y]);
        } else {
            console.log("Show loginModal");
            this.props.toggleLogInModal();
        }

        return false;
    }

    render() {
        return (
            <div id="mapdiv" ></div>
        );
    }
}

export default Cartograph;
