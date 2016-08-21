"use strict";
function ContainerSlot(container, index) {
    this.container = container;
    this.index = index;

    this.icon = null;
    this.entity = null;
    this.locked = false;
    this.spriteVersion = "";

    this.element = dom.slot();
    this.element.maxWidth = Container.SLOT_SIZE + "px";
    this.element.maxHeight = Container.SLOT_SIZE + "px";
    this.element.slot = this;

    this.sub = null;

    this.onclear = function() {};
}

ContainerSlot.prototype = {
    setTitle: function(title) {
        this.element.title = title;
    },
    markAsUnseen: function() {
        this.element.classList.add("new");
    },
    markAsSeen: function() {
        this.element.classList.remove("new");
    },
    lock: function() {
        this.locked = true;
        this.element.classList.add("locked");
    },
    unlock: function(entity) {
        this.locked = false;
        this.element.classList.remove("locked");
    },
    clear: function() {
        this.entity = null;
        this.sub = null;
        dom.clear(this.element);
        this.element.classList.remove("has-item");
        this.setTitle("");
        this.markAsSeen();
        this.unlock();
        this.onclear();
    },
    set: function(entity) {
        if (this.entity == entity && this.spriteVersion == entity.spriteVersion()) {
            this.update();
            return;
        }
        switch (this.container.entity.Type) {
        case "chess-table":
            if (entity.Type.split("-")[0] == "white")
                this.container.panel.setTitle("Black move");
            else
                this.container.panel.setTitle("White move");
            break;
        }
        this.spriteVersion = entity.spriteVersion();
        this.clear();
        this.entity = entity;
        this.element.classList.add("has-item");

        var quality = dom.tag("sup", "quality", {text: entity.Quality});
        if (entity.almostBroken())
            quality.classList.add("almost-broken");

        var icon = entity.icon();
        icon.classList.add("item");
        icon.slot = this;

        dom.append(this.element, [icon, quality]);

        this.update();
    },
    setSub: function(text) {
        if (this.sub == null) {
            this.sub = dom.tag("sub");
            dom.append(this.element, this.sub);
        }
        this.sub.textContent = text;
    },
    update: function() {
        this.updateProgress();
        this.updateCustom();
        this.setTitle(this.entity.name);
    },
    updateProgress: function() {
        if ("Readiness" in this.entity && "Fuel" in this.container.entity) {
            var rd = this.entity.Readiness;
            if (rd.Max != 0)
                this.setSub(util.toFixed(100*rd.Current / rd.Max) + "%");
            return;
        }
        if ("Generate" in this.container.entity && "Progress" in this.container.entity.Generate) {
            this.setSub(this.container.entity.Generate.Progress + "%");
            return;
        }
        //TODO: make generic `progress' @server-side
        var cnt = this.container.entity;
        if (!("HideAdded" in cnt))
            return;
        var added = new Date(cnt.HideAdded);
        var duration = cnt.HideDuration / 1e6;
        var diff = Date.now() - added;
        if (diff < duration) {
            this.setSub(util.toFixed(100*diff / duration) + "%");
        }
    },
    updateCustom: function() {
        if (this.entity.Group == "atom") {
            this.setSub(this.entity.Type);
        } else if ("Amount" in this.entity) {
            this.setSub(this.entity.Amount);
        } else if (this.entity.SpawnChance > 0) {
            this.setSub(this.entity.SpawnChance);
        }
    },
};