/* global Panel, dom, T, game, config, Settings */

function BasicSettings() {
    new Panel("basic-settings", "Settings", [
        dom.make("label", [
            T("Language"),
            dom.select(config.ui.language(), game.lang, "", function() {
                game.setLang(this.value);
            }),
        ]),
        dom.hr(),
        dom.make("p", T("Some graphic cards may fail with accelerated rendering. Disable to fix it.")),
        dom.wrap("fix-rendering", [
            dom.button(
                (config.graphics.gpuRender)
                    ? T("Disable GPU rendering")
                    : T("Enable GPU rendering"),
                "",
                () => {
                    Settings.toggle("settings.graphics.gpuRender");
                    game.reload();
                }
            ),
        ]),
    ]).center().show();
};
