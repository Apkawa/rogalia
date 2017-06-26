/* global game, Quest, dom, T, util, Panel, Achievements */

"use strict";
function Journal() {
    this.list = dom.div("journal-list");
    this.view = dom.div("journal-quest");
    this.tabs = [
        {
            title: T("Quests"),
            contents: dom.wrap("journal-contents", [
                this.list,
                dom.vr(),
                this.view,
            ]),
        },
        {
            title: T("Achievements"),
            update: (title, contents) => {
                Achievements.loadInto(contents);
            }
        }
    ];
    this.panel = new Panel("journal", "Journal", dom.tabs(this.tabs));
    this.quests = [];

    this.hash = "";
    this.selected = {
        id: null,
        item: null,
        quest: null,
    };

    this.update();

    this.panel.hooks.show = () => {
        this.update();
    };
}

Journal.prototype = {
    select(id) {
        this.deselect();
        const {item, quest} = this.quests[id];
        this.selected.id = id;
        this.selected.quest = quest;
        this.selected.item = item;
        item.classList.add("selected");
        dom.setContents(this.view, dom.wrap("quest-container", quest.getContents(false)));
    },
    deselect() {
        if (this.selected.item) {
            this.selected.item.classList.remove("selected");
        }
        this.selected.item = null;
    },
    update() {
        if (this.panel && !this.panel.visible)
            return;

        if (this.selected.quest) {
            this.selected.quest.update();
        }

        const hash = JSON.stringify(game.player.ActiveQuests);
        if (hash == this.hash) {
            return;
        }
        this.hash = hash;

        if (this.selected.item && !game.player.ActiveQuests[this.selected.id]) {
            dom.clear(this.view);
            this.deselect();
        }

        if (_.size(game.player.ActiveQuests) == 0) {
            dom.setContents(this.list, T("No quests"));
            return;
        }

        dom.setContents(this.list, this.makeList());
    },
    makeList() {
        this.quests = {};
        return _.map(game.player.ActiveQuests, ({Quest: data}, id) => {
            const quest = new Quest(data);
            const item = dom.wrap("journal-item", quest.getName(), {
                onclick: () => this.select(id)
            });
            if (id == this.selected) {
                item.classList.add("selected");
            }
            this.quests[id] = {quest, item};

            if (!this.selected.item) {
                this.select(id);
            }

            return item;
        });
    },
};
