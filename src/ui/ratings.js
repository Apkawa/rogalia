/* global util, game, Panel, T, dom */

"use strict";

function Ratings() {
    new Panel("ratings", "Ratings", dom.tabs([
        {
            title: T("Top") + " 100",
            update: (title, contents) => {
                load("/", (rating) => {
                    dom.setContents(contents, dom.scrollable("rating", top20(rating)));
                });
            },
        },
        {
            title: T("Pvp") + " " + T("Top") +  " 100",
            update: (title, contents) => {
                load("/elo", (rating) => {
                    dom.setContents(contents, dom.scrollable("rating", elo(rating)));
                });
            },
        }
    ])).show();

    function top20(rating) {
        return dom.table(
            ["#", T("Name"), T("Level"), T("Skill sum")],
            rating.map((pl, i) => [i+1, pl.Name, pl.Lvl, util.toFixed(pl.Skills)])
        );
    }

    function elo(rating) {
        return dom.table(
            ["#", T("Name"), T("Level"), T("Rating")],
            rating.map((pl, i) => [i+1, pl.Name, pl.Lvl, pl.Rating])
        );
    }

    function load(url, callback) {
        util.ajax(
            game.makeServerAddr("/rating" + url),
            function(data) {
                callback(JSON.parse(data));
            },
            function(error) {
                game.popup.alert(error);
            }
        );
    }
}
