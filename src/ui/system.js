/* global game, dom, T, Panel, FpsStats, Settings, Profile */

"use strict";

function System() {
    this.fps = new FpsStats();

    this.fps.domElement.id = "fps-stats-graph";
    const fps = dom.wrap("#fps-stats", this.fps.domElement);

    this.ping = dom.div("#ping");

    this.settings = new Settings();
    this.profile = new Profile();

    const settings = dom.button(T("Settings"), "", () => this.settings.panel.toggle());
    const profile = dom.button(T("Profile"), "", () => this.profile.panel.toggle());

    this.update = function(ping) {
        if (game.player.IsAdmin) {
            this.ping.textContent = ping;
        }
        const {color, title} = game.network.pingQuality(ping);
        this.ping.style.backgroundColor = color;
        this.ping.title = T(title);
    };

    this.panel = new Panel(
        "system",
        "System",
        [
            fps,
            dom.wrap("#ping-stats", [
                "Ping: ",
                this.ping
            ]),
            dom.hr(),
            settings,
            profile,
            game.args["steam"] ?
                dom.button(T("Change character"), "", game.reload)
                : game.button.lobby(),
            game.args["steam"] ?
                dom.button(T("Quit"), "", () => game.quit())
                : dom.button(T("Logout"), "", game.reload),
        ]
    );
}
