/* global game, dom, Panel, T, sprintf, TS, util, fetch, fetch */

"use strict";

function selectServerStage(panel) {
    var self = this;
    this.panel = panel;
    showServers();


    let defaultServer = null;
    window.addEventListener("keypress", fastenter);

    this.end = function() {
        window.removeEventListener("keypress", fastenter);
    };

    function fastenter(event) {
        if (event.key != "Enter" || !defaultServer)
            return;
        enter(defaultServer);
    }

    function showServers() {
        var req = new XMLHttpRequest();
        req.onload = function() {
            if (this.status != 200) {
                game.popup.alert(this.response, quit);
                return;
            }

            const servers = JSON.parse(this.response);

            defaultServer = _.find(servers, ({Status: status}) => status == "online");

            self.panel = new Panel("select-server", "", [
                dom.wrap("lobby-account", game.getLogin()),
                serversTable(servers),
                dom.button(T("EULA"), "eula", showEULA),
                dom.button(T("Refresh"), "refresh", showServers),
                dom.button(T("Quit"), "quit", quit)
            ]).hideCloseButton().show().center(0.5, 0.05);
        };
        req.open("GET", game.gateway + "/status", true);
        req.send(null);
    }

    function showEULA() {
        var eula = dom.tag("p");
        util.ajax(`eula/${game.lang}.txt`, (text) => { dom.setContents(eula, text); });
        new Panel("eula", T("EULA"), eula).show();
    }

    function quit() {
        if (game.args["steam"]) {
            game.quit();
        } else {
            game.clearCredentials();
            self.panel.close();
            game.setStage("login");
        }
    }

    function serversTable(servers) {
        if (_.size(servers) == 0)
            return dom.make("p", T("All servers are offline"));
        return dom.table(
            [
                T("Server"),
                T("Ping"),
                T("Population"),
                T("Description"),
                T("Status"),
                ""
            ],
            _.map(servers, function(server) {
                const enterButton = dom.button(T("Enter"), "", () => enter(server));
                if (server.Status != "online") {
                    enterButton.disabled = true;
                }
                const players = server.Players;
                const population = (document.location.hostname == "localhost")
                      ? `${players.Online}/${players.Limit} (${players.Population})`
                      : players.Population;

                return [
                    server.Name,
                    ping(server.Addr),
                    population,
                    server.Desc,
                    TS(server.Status),
                    enterButton,
                ];
            }),
            "servers"
        );
    }

    function ping(addr) {
        const elem = dom.wrap("ping", "?");
        const started = Date.now();
        const url = game.proto() + "//" + addr + ":" + game.network.port + "/ping";
        fetch(url, {method: "HEAD"})
            .then(response => {
                const ellapsed = (response.ok) ? Date.now() - started : +Infinity;
                const {color, title} = game.network.pingQuality(ellapsed);
                elem.style.backgroundColor = color;
                elem.title = T(title);
                elem.textContent = "";
            })
            .catch(err => {
                elem.style.backgroundColor = "black";
                elem.title = T("Error");
                elem.textContent = "";
            });
        return elem;
    }

    function enter(server) {
        self.sync = openLobby;
        self.panel.close();
        self.draw = Stage.makeEllipsisDrawer();
        game.connectAndLogin(server, game.loadSessionToken());
    }

    function openLobby(data) {
        if (data.Warning) {
            game.popup.alert(T(data.Warning), quit);
        } else {
            game.setStage("lobby", data);
        }
    }
}

Stage.add(selectServerStage);
