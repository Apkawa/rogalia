/* global T, Game, config, util, gameStorage */

"use strict";

main();

function main() {
    const args = parseArgs();
    const lang = defaultLang(args);

    T.init(lang, function() {
        new Game(lang, args);
    });

    function defaultLang(args) {
        // force ru for vk
        if (window.name.indexOf("fXD") == 0) {
            return "ru";
        }
        const langs = config.ui.language();
        const matchers = langs.map(lang => new RegExp(lang, "i"));
        const lang = [
            args["lang"],
            gameStorage.getItem("lang"),
            navigator.language,
        ].find(input => matchers.some(matcher => matcher.test(input)));

        return lang || langs[0];
    }

    function parseArgs() {
        return document.location.search
            .substring(1)
            .split("&")
            .reduce((params, param) => {
                const [key, value] = param.split("=");
                params[key] = decodeURIComponent(value);
                return params;
            }, {});
    }
}
