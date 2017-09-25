/* global game, Image, dom, CELL_SIZE, T, Panel, Point, gameStorage */

"use strict";
function Minimap() {
    var self = this;
    const defaultWidth = 300;
    this.width = defaultWidth;
    this.lvl = 0;
    this.mapImage = new Image();
    this.mapImage.id = "minimap-image";
    this.mapImage.width = defaultWidth;
    this.mapImage.onload = () => {
        this.mapImage.width = this.width;
        loadMarkers();
        this.rescale();
    };

    const scale = () => {
        return this.mapImage.width / this.mapImage.naturalWidth;
    };

    this.points = {};
    this.markers = {};
    this.characters = [];

    const zoomPositionX = dom.wrap("zoom-position-x");
    const zoomPositionY = dom.wrap("zoom-position-y");

    const wrapper = dom.wrap("wrapper", this.mapImage);

    function updateZoomPosition() {
        zoomPositionX.style.left = wrapper.scrollLeft / (wrapper.scrollWidth - wrapper.clientWidth) *
            (wrapper.clientWidth - zoomPositionX.clientWidth) + "px";
        zoomPositionY.style.top = wrapper.scrollTop / (wrapper.scrollHeight - wrapper.clientHeight) *
            (wrapper.clientHeight - zoomPositionY.clientHeight)+ "px";

    }

    this.focusOn = (x, y) => {
        wrapper.scrollLeft = x / game.map.full.width * this.mapImage.naturalWidth - defaultWidth;
        wrapper.scrollTop = y / game.map.full.height * this.mapImage.naturalHeight - defaultWidth;
        updateZoomPosition();
    };

    const centerPlayer = () => {
        self.focusOn(game.player.X, game.player.Y);
    };

    let zoomLvl = 0;
    const zoom = dom.button(T("Zoom"), "", () => {
        switch (zoomLvl++) {
        case 0:
            this.width = this.mapImage.width *= 2;
            break;
        case 1:
            wrapper.parentNode.classList.add("zoom");
            this.width = this.mapImage.width = this.mapImage.naturalWidth;
            centerPlayer();
            break;
        case 2:
            this.width = this.mapImage.width = defaultWidth;
            wrapper.parentNode.classList.remove("zoom");
            zoomLvl = 0;
            break;
        }
        this.rescale();
    });

    const lvlUp = dom.button("↥", "", () => {
        if (this.lvl > 0) {
            this.selectLevel(this.lvl - 1);
        }
    });

    const lvlDown = dom.button("↧", "", () => {
        if (this.lvl < 3) {
            this.selectLevel(this.lvl + 1);
        } else if (this.lvl > 3) {
            this.selectLevel(1);
        }
    });

    const myLvl = dom.button("↺", "", () => {
        this.selectLevel(game.player.Z);
        centerPlayer();
    });

    const coord = dom.wrap("map-coord", this.lvl);

    function pointFromEvent(e) {
        var rect = e.target.getBoundingClientRect();
        return new Point(e.pageX - rect.left, e.pageY - rect.top).div(scale()).round();
    }

    const drag = {
        x: 0,
        y: 0,
        active: false,
    };
    this.mapImage.onmousedown = (event) => {
        drag.x = event.pageX;
        drag.y = event.pageY;
        drag.active = true;
    };

    window.addEventListener("mouseup", (event) => {
        drag.active = false;
    });

    window.addEventListener("mousemove", (event) => {
        if (drag.active) {
            wrapper.scrollLeft -= event.movementX;
            wrapper.scrollTop -= event.movementY;
            updateZoomPosition();
        }
    });

    this.mapImage.onclick = (e) => {
        if (game.controller.modifier.alt && game.player.IsAdmin) {
            const p = pointFromEvent(e).mul(CELL_SIZE);
            game.chat.teleport(p.x, p.y, this.lvl);
            return;
        }
        var p = pointFromEvent(e);
        var point = this.addMarker(p.x, p.y, this.lvl);
        if (game.controller.modifier.shift) {
            sendPoint(point);
        }
    };

    this.selectLevel = function(level) {
        if (this.lvl != level) {
            this.lvl = level;
            const lvl = (this.lvl > 0 && this.lvl <= 3) ? "/" + this.lvl : "";
            this.mapImage.src = game.proto() + "//" + game.network.addr + "/map" + lvl;
            coord.textContent = (lvl) ? -level : 0;
        }
    };

    this.update = function() {
        if (!this.panel || !this.panel.visible) {
            return;
        }

        for (var name in this.characters) {
            var character = this.characters[name];
            if (character) {
                this.syncObject(name, character);
            }
        }
        this.syncObject("$corpse", game.player.Corpse);
        this.syncObject("$respawn", game.player.Respawn);
        game.player.Claims && game.player.Claims.forEach(c => this.syncObject("$claim", c));
        _.forEach(game.mapMarkers, (point, name) => {
            this.syncObject(name, point);
        });
    };

    this.lvl = undefined;

    this.panel = new Panel(
        "map",
        "Map",
        [
            dom.wrap("map-container", [
                wrapper,
                zoomPositionX,
                zoomPositionY,
            ]),
            zoom,
            lvlUp,
            lvlDown,
            myLvl,
            coord
        ],
        {
            show: () => {
                if (this.lvl === undefined) {
                    this.selectLevel(game.player.Z);
                }
                this.update();
            }
        }
    );

    this.save = function() {
        saveMarkers();
    };

    this.sync = function(data = {}) {
        this.characters = data;
        var pl = game.player;
        this.characters[pl.Name] = {X: pl.X, Y: pl.Y, Z: pl.Z};
        for (var name in this.points) {
            if (name in data && data[name] == null) {
                delete this.characters[name];
                removePointByName(name);
            }
        }

        if (this.panel.visible) {
            this.update();
        }
    };

    function saveMarkers() {
        var markers = _.map(self.markers, ({x, y, z, title}) => ({x, y, z, title}));
        gameStorage.setItem("map.markers", markers);
    };

    function loadMarkers() {
        const markers = gameStorage.getItem("map.markers") || [];
        _.forEach(markers, function(point) {
            self.addMarker(point.x, point.y, point.z, point.title);
        });
    }

    function makePoint(title) {
        var point = dom.div("point");
        point.title = title;
        return point;
    };

    function addPoint(name, point) {
        self.points[name] = point;
        wrapper.appendChild(point);
    };

    function updatePoint(point, x, y, z) {
        point.x = x;
        point.y = y;
        point.z = z;
        if (z === null || (z == self.lvl && z <= 3)) {
            dom.show(point);
        } else {
            dom.hide(point);
            return;
        }
        point.style.left = scale() * x + "px";
        point.style.top = scale() * y + "px";
        if (point.id == "player-point") {
            var deg = (11 - game.player.sprite.position) * 45 % 360;
            var diff = (deg - point.deg || 0) % 360;
            if (diff > 180)
                diff -= 360;
            else if (diff < -180)
                diff += 360;
            deg = ((point.deg || 0) + diff);
            point.deg = deg;
            point.style.transform = "rotate(" + deg + "deg)";
        }
    };

    function removePointByName(name) {
        dom.remove(self.points[name]);
        delete self.points[name];
        delete self.markers[name];
        saveMarkers();
    };

    function sendPoint(point) {
        const title = (point.title == point.name) ? "" : " " + point.title;
        game.chat.link("${marker:" + point.x + " " + point.y + " " + point.z + title +"}");
    }

    this.rescale = function() {
        for (var name in this.points) {
            var point = this.points[name];
            updatePoint(point, point.x, point.y, point.z);
        }
    };

    this.syncObject = function(name, object) {
        if (!object || (object.X == 0 && object.Y == 0)) {
            return;
        }
        var x = object.X / CELL_SIZE;
        var y = object.Y / CELL_SIZE;
        var point = this.points[name];
        if (!point) {
            point = makePoint(name);

            switch (name) {
            case game.playerName:
                point.id = "player-point";
                point.title = game.playerName;
                break;
            case "$corpse":
                point.id = "corpse-point";
                point.title = T("Corpse");
                break;
            case "$respawn":
                point.id = "respawn-point";
                point.title = T("Respawn");
                break;
            case "$claim":
                point.classList.add("claim-point");
                point.title = T("Claim");
                break;
            case "$red-portal":
                point.id = "red-portal-point";
                point.title = T("Red portal");
                break;
            default:
                point.classList.add("character");
                if (object.Karma < 0) {
                    point.classList.add("pk");
                    point.title += " | " + T("Karma") + ": " + object.Karma;
                }
            }

            addPoint(name, point);
        }
        updatePoint(point, x, y, object.Z);
    };

    this.addMarker = function(x, y, z = null, title = "") {
        let name = x + " " + y;
        if (z !== null) {
            name += " " + z;
        }
        if (name in this.points) {
            return this.points[name];
        }
        const point = makePoint(title || name);
        point.classList.add("marker-point");
        point.name = name;
        addPoint(name, point);
        updatePoint(point, x, y, z);

        this.markers[point.name] = point;

        point.onmousedown = function(e) {
            switch (e.button) {
            case game.controller.LMB:
                if (game.controller.modifier.shift) {
                    sendPoint(point);
                } else {
                    e.preventDefault();
                    game.popup.prompt(T("Description") + ":", "", function(title) {
                        point.title = title;
                    });
                }
                break;
            case game.controller.RMB:
                removePointByName(name);
                break;
            }
        };
        return point;
    };
}
