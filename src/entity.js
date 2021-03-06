/* global dom, T, util, game, Panel, config, Point, Container, Character, BBox, TS, Permission, ParamBar, SlotMachine, CELL_SIZE, Sprite, ImageFilter, FONT_SIZE, ContainerSlot, Sockets */

"use strict";
function Entity(type, id) {
    var e = this;
    if (type) {
        e = Object.create(Entity.templates[type]);
    }
    e.Id = id || 0;
    e.Type = type || "";
    if (id)
        e.sprite = {};
    return e;
}

Entity.prototype = {
    Id: 0,
    Name: "",
    Width: 0,
    Height: 0,
    Radius: 0,
    Type: "",
    Group: "",
    Lvl: 1,
    Container: 0,
    Quality: 1,
    Disposition: 0,
    MoveType: Entity.MT_PORTABLE,
    Creator: 0,
    Owner: 0,
    Sprite: {},
    State: "",
    Variant: 0,
    Orientation: "",
    Recipe: null,
    Props: {},
    CanCollide: true,
    Actions: null,
    Durability: null,
    Dye: "",
    visibiliyObstacle: false,
    sprite: null,
    _spriteVersion: "",
    graph: null,
    tags: [],
    x: 0,
    y: 0,
    get X() {
        return this.x;
    },
    get Y() {
        return this.y;
    },
    set X(x) {
        throw "not allowed";
    },
    set Y(y) {
        throw "not allowed";
    },
    get name() {
        var name = "";
        switch (this.Type) {
        case "male-corpse":
        case "female-corpse":
            return `${TS("Corpse")}: ${this.Name}`;
        case "male-head":
        case "female-head":
            return `${TS("Head")}: ${this.Name}`;
        case "rune-of-teleportation":
            name = `${TS("Rune")}: ${this.Name}`;
            break;
        case "parcel":
            var match = this.Name.match(/^(.*)-((?:fe)?male)$/);
            if (match) {
                name = TS(match[1]) + " (" + T(match[2]) + ")";
            } else {
                name = TS(this.Name);
            }
            break;
        default:
            name = TS(this.Name);
        }

        if (this.Props.Capacity) {
            name += ' [' +
                util.toFixed(this.Props.Capacity.Current) +
                '/' +
                util.toFixed(this.Props.Capacity.Max) +
                ']';
        }
        if (this.Props.Text) {
            var title = Entity.books[this.Props.Text];
            if (title)
                name += ": " + title;
            else
                return this.Props.Text;
        }

        if (this.CustomLabel) {
            name += "\n[" + this.CustomLabel + "]";
        }

        if ("Damage" in this)
            name += "\n" + T("Damage") + ": " + util.toFixed(this.rawDamage(), 0);
        else if (this.Props.Energy)
            name += "\n" + T("Energy") + ": " + this.Props.Energy;

        if (!("Amount" in this)) {
            name += "\n" + T("Quality") + ": " + this.Quality;
            name += "\n" + T("Durability") + ": " + this.durabilityPercent() + "%";
        }

        if (this.Comment)
            name += "\n" + this.Comment;

        return name;
    },
    set name(value) {
        //ignore
    },
    get title() {
        var title = this.Type;
        var suffix = "";
        switch (this.Group) {
        case "blank":
            title = this.Props.Type;
            break;
        case "liquid-container-liftable":
        case "tanning-tub":
            var cap = this.Props.Capacity;
            suffix = sprintf("[%d/%d]", cap.Current,  cap.Max);
            break;
        default:
            if (this.Name) {
                title = this.Name;

                if (this.Group == "pike") {
                    return title;
                }

            }
        }

        switch (this.Type) {
        case "named-point":
            return "Point: " + this.Props.Text;
        }

        if (this.isContainer()) {
            const {current, max} = Entity.containerSize(this);
            suffix += ` [${current}/${max}]`;
        }

        if (this.Type.contains("-corpse") || this.Type == "head")
            return T(title);

        if (this.CustomLabel) {
            suffix += ` [${this.CustomLabel}]`;
        }
        return TS(title) + suffix;
    },
    get point() {
        return new Point(this.X, this.Y);
    },
    get round() {
        return this.Width == 0;
    },

    durabilityPercent: function() {
        var dur = this.Durability;
        return util.toFixed(dur.Current / dur.Max * 100);
    },
    showInfo: function() {
        var elements = [];
        elements.push(ParamBar.makeValue("Level", this.Lvl));
        elements.push(ParamBar.makeValue("Quality", this.Quality));
        elements.push(ParamBar.makeParam("Durability", this.Durability));

        if ("Readiness" in this) {
            elements.push(ParamBar.makeParam("Readiness", this.Readiness));
        }

        switch (this.Group) {
        case "food":
            elements.push(dom.hr());
            elements.push(dom.make("label", [
                T("Fullness") + " " +
                    util.toFixed(game.player.Fullness.Current) + " → " +
                    util.toFixed(game.player.Fullness.Current + this.Props.Energy)
            ]));
            elements.push(dom.hr());
            var k = Math.sqrt(this.Quality);
            Character.vitamins.forEach(function(vitamin) {
                var value = this.Props[vitamin] * k;
                var elem = ParamBar.makeValue(vitamin, value, 2);
                elem.classList.add("vitamin-" + vitamin.toLowerCase());
                elements.push(elem);
            }.bind(this));
            elements.push(ParamBar.makeValue("Energy", this.Props.Energy, 2));
            break;
        case "portal":
            var input = dom.input("", this.Id);
            input.readonly = true;
            elements.push(input.label);
            break;
        case "spell-scroll":
            elements.push(dom.wrap("param", [T("Cooldown"), dom.wrap("value", this.Cooldown/1000 || 5)]));
            elements.push(dom.wrap("param", [T("Range"), dom.wrap("value", this.Range || 10*CELL_SIZE)]));
            break;
        default:
            if ("Armor" in this) {
                elements.push(dom.wrap("param", [T("Armor"), dom.wrap("value", this.armor())]));
            } else if ("Damage" in this) {
                elements.push(dom.wrap("param", [T("Damage"), dom.wrap("value", this.damage())]));
                if (this.Ammo) {
                    elements.push(dom.wrap("param", [T("Ammo"), dom.wrap("value", T(this.Ammo.Type))]));
                }
            } else if ("Block" in this) {
                var block = this.Block;
                elements.push(ParamBar.makeValue("Block", block));
                elements.push(ParamBar.makeValue("PVP Block", Math.round(block * 0.8)));
            } else if (this.Props.Capacity) {
                elements.push(ParamBar.makeParam("Capacity", this.Props.Capacity));
            }
        }

        if (this.EffectiveParam && this.Lvl > 1) {
            var requirement = ParamBar.makeValue(this.EffectiveParam, this.template().Lvl);
            if (this.nonEffective()) {
                requirement.classList.add("unavailable");
            }
            elements.push(dom.hr());
            elements.push(dom.make("div", T("Requirements")));
            elements.push(requirement);
        }

        if (this.Sockets) {
            elements.push(new Sockets(this, panel));
        }

        elements.push(dom.hr());
        if (this.Comment) {
            elements.push(this.Comment);
            elements.push(dom.hr());
        }
        elements.push(this.makeDescription());

        if (this.isContainer() || this.Group == "gate" || this.Group == "claim") {
            elements.push(dom.hr());
            elements.push(Permission.make(this.Id, this.Perm));
        }

        var panel = new Panel("item-info", TS(this.Name), elements)
            .setEntity(this)
            .setVisibilityCheck(false)
            .show();
    },
    nonEffective: function() {
        if (!this.EffectiveParam || this.Lvl <= 1) {
            return false;
        }
        var attr = game.player.Attr[this.EffectiveParam];
        if (attr) {
            return Math.max(1, attr.Current) < this.Lvl;
        }
        var skill = game.player.Skills[this.EffectiveParam];
        if (skill) {
            return Math.max(1, skill.Value.Current) < this.Lvl;
        }
        return false;
    },
    armor: function() {
        const base = this.Armor * (1 + this.Quality / 100);
        const k = Entity.durabilityPenalty(this.Durability);
        var armor = util.toFixed(base * k, 0);
        if (this.nonEffective()) {
            return "0 / " + armor;
        }
        return (k == 1)
            ? armor
            : armor + " / " + util.toFixed(base, 0);
    },
    rawDamage: function(withDurability = false) {
        const k = (withDurability) ? Entity.durabilityPenalty(this) : 1;
        return this.Damage * (Math.pow(this.Quality, 1.5) / 3333 + 1) * k;
    },
    damage: function() {
        const base = this.rawDamage();
        const k = Entity.durabilityPenalty(this.Durability);
        const damage = util.toFixed(base * k, 0);
        if ((this.nonEffective())) {
            return util.toFixed(game.player.Skills.Swordsmanship.Value.Current) + " / " + damage;
        }
        return (k == 1)
            ? damage
            : damage + " / " + util.toFixed(base, 0);
    },
    makeDescription: function() {
        var text = T.items[this.Type] || T.items[this.Group] || T("No description yet");
        return dom.div("item-descr", {text: text});
    },
    leftTopX: function() {
        return (this.X - this.Width / 2) << 0;
    },
    leftTopY: function() {
        return (this.Y - this.Height / 2) << 0;
    },
    screen: function() {
        return this.point.toScreen();
    },
    getDrawDx: function() {
        return this.Sprite.Dx || this.sprite.width/2;
    },
    getDrawDy: function() {
        if (this.Sprite.Dy) {
            return this.Sprite.Dy;
        }

        if (this.Disposition == "roof" && this.Location != Entity.LOCATION_BURDEN) {
            return 128; // default wall sprite height - wall width / 2  === (136 - 8)
        }

        var r = this.Radius;
        var k = 4;

        if (this.Group == "tree") {
            k = 16;
        } else if (this.round) {
            if (r > 32)
                k = 8;
            else if (r < 8)
                k = 16;
        }
        r = this.sprite.width/k;

        return this.sprite.height - r;
    },
    getDrawPoint: function() {
        return new Point(this.x, this.y)
            .toScreen()
            .sub({x: this.getDrawDx(), y: this.getDrawDy()})
            .round();
    },
    compare: function(entity) {
        if (this == entity)
            return 0;
        var z = this.getZ() - entity.getZ();
        if (z != 0)
            return z;

        var a = this.X + this.Y;
        var b = entity.X + entity.Y;
        return (a >= b) ? +1 : -1;
    },
    getZ: function() {
        switch (this.Disposition) {
        case "roof":
            return 1;
        case "floor":
            return -1;
        }
        return 0;
    },
    spriteVersion: function() {
        return this._spriteVersion;
    },
    initSprite: function() {
        var path = (this.Sprite.Name)
            ? this.Sprite.Name
            : this.Type;

        if (this.Props.LiquidType) {
            path += "-" + this.Props.LiquidType;
        }

        switch (this.Type) {
        case "wooden-table":
        case "dining-table":
        case "herb-rack":
        case "bookshelf":
        case "wooden-trough":
        case "stack-of-wood":
        case "stack-of-boards":
        case "bundle-of-wood":
        case "stone-pile":
        case "winepress":
        case "bloody-altar":
        case "bar-stand":
        case "flower-pot":
        case "dyed-flowerpot":
        case "wine-rack-small":
        case "wine-rack-average":
        case "wine-rack-big":
        case "potions-cabinet-small":
        case "potions-cabinet-average":
        case "potions-cabinet-big":
        case "steel-pike":
        case "hatstand":
        case "sandbox":
        case "runebook":
            if (_.some(this.Props.Slots, (id) => id != 0)) {
                path += "-full";
            }
            break;
        case "respawn":
            if (game.player.Respawn && this.X == game.player.Respawn.X && this.Y == game.player.Respawn.Y) {
                path += "-my";
            }
            break;
        }

        if (this.Type != "blank") {
            if (this.State) {
                path += "-" + this.State;
            } else if ("Locked" in this.Props) {
                path += "-locked"; // defaults for gate/doors
            }

            if (this.Orientation) {
                path += "-" + this.Orientation;
            }

            if (this.Variant) {
                path += "-" + this.Variant;
            }

            switch (this.Group) {
            case "playing-card":
                path = "cards/" + path.replace(/^card-/, "");
                break;
            }

        } else {
            switch (this.Orientation) {
            case "h":
            case "v":
                path += "-" + this.Orientation;
            }
        }

        if (!path) {
            game.error(`Entity has no sprite ${this.Id} of ${this.Type}`);
        }

        var spriteVersion = path + this.Dye;

        if (this.sprite && this.sprite.ready && spriteVersion == this._spriteVersion) {
            return;
        }

        this.sprite = new Sprite(
            `entities/${path}.png`,
            this.Sprite.Width,
            this.Sprite.Height,
            this.Sprite.Speed
        );

        if (this.Dye) {
            var dye = this.Dye.split("#");
            var color = dye[1];
            var opacity = dye[2];
            this.sprite.onload = function() {
                this.image = ImageFilter.tint(this.image, color, opacity);
            };
        }

        this._spriteVersion = spriteVersion;
    },
    is: function(type) {
        if (this.Type == type || this.Group == type) {
            return true;
        }
        var meta = Entity.metaGroups[type] || [];
        return meta.some(function(kind) {
            return this.is(kind);
        }.bind(this));
    },
    equip: function() {
        game.network.send("equip", {Id: this.Id});
    },
    gut: function() {
        const gut = () => this.queueActionMaybe("Gut");
        if (this.Group == "player-corpse") {
            game.popup.confirm(T("Warning: This action can cause bad karma, continue at your own risk!"), gut);
        } else {
            gut();
        }
    },
    plunder: function() {
        game.popup.confirm(
            T("Warning: This action can cause bad karma, continue at your own risk!"),
            () => this.queueActionMaybe("Plunder")
        );
    },
    getActions: function() {
        var actions = [{}, {}, {}];

        if (this.MoveType == Entity.MT_PORTABLE && this.inWorld())
            actions[0]["Pick up"] = this.pickUp;
        else if (this.MoveType == Entity.MT_LIFTABLE)
            actions[0]["Lift"] = this.lift;

        if (this.Creator && this.MoveType != Entity.MT_STATIC) {
            actions[1]["Disassemble"] = this.disassemble;
        }

        if (this.canBeEquipped()) {
            actions[0]["To equip"] = this.equip;
        }

        switch (this.Group) {
        case "runebook":
            actions[1]["teleport"] = () => {
                new Panel("runebook", "Runebook", makeRunebook(this)).show();
                function makeRunebook(runebook) {
                    const party = game.player.Party;
                    if (!party) {
                        return T("You must be in the party");
                    }
                    const runes = runebook.Props.Slots
                          .filter(slot => slot != 0)
                          .map(Entity.get)
                          .filter(rune => rune.Name != game.player.Name && party.includes(rune.Name));

                    if (runes.length == 0) {
                        return T("No party members with available runes");
                    }

                    return _.uniqBy(runes, (rune) => rune.Name).map(rune => {
                        return dom.button(rune.Name, "", () => {
                            rune.actionApplySimple("Activate");
                        });
                    });
                }
            };
            break;
        }


        this.Actions.forEach(action => {
            actions[1][action] = this.actionApply(action);
        });

        if (this.Orientation != "" && this.MoveType != Entity.MT_STATIC) {
            actions[1]["Rotate"] = function() {
                game.network.send("rotate", {id: this.Id});
            };
        }
        if (!(game.player.Instance && game.player.Instance.match(/^tutorial-/)) || game.player.IsAdmin) {
            actions[2]["Destroy"] = this.destroy;

            if (Entity.canRelocate(this)) {
                actions[2]["Relocate"] = this.relocate;
            }
        }

        if (this.Location == Entity.LOCATION_IN_CONTAINER || this.Location == Entity.LOCATION_EQUIPPED)
            actions[2]["Drop"] =  function() { game.network.send("entity-drop", {id: this.Id}); };

        actions[2]["Info"] = this.showInfo;

        if (game.player.IsAdmin) {
            actions.push("---");
            actions.push({"$cmd": this.applyAdminCmd});
        }

        return actions;
    },
    isTool: function() {
        const tags = [
            "tool",
            "armor",
            "weapon",
            "accessory",
            "taming",
            "insect-net",
            "fishing-rod",
            "prospector",
        ];
        return this.tags.some(tag => tags.includes(tag));
    },
    canBeEquipped: function() {
        if (this.Location == Entity.LOCATION_EQUIPPED)
            return false;
        if (this.Group == "prospector")
            return false;
        return this.isTool();
    },
    alignedData: function(p, shift = false) {
        const align = new Point(this.Sprite && this.Sprite.Align);
        if (align.isZero()) {
            if (shift) {
                return null;
            }
            align.set(CELL_SIZE/2, CELL_SIZE/2);
        }
        const w = this.Width || 2*this.Radius;
        const h = this.Height || 2*this.Radius;
        p.x -= w/2;
        p.y -= h/2;
        p.align(align);

        return {
            x: p.x,
            y: p.y,
            w,
            h,
            fill: (this.Group == "claim" || this.Group == "milepost") && {
                w: 20 * CELL_SIZE,
                h: 20 * CELL_SIZE,
                color: "rgba(0, 0, 0, 0.1)",
            },
        };
    },
    defaultActionSuccess: function(data) {
    },
    defaultAction: function() {
        const use = () => {
            game.network.send("entity-use", {Id: this.Id}, (data) => this.defaultActionSuccess(data));
        };
        switch (this.Type) {
        case "instance-exit":
            game.popup.confirm(
                T("You will not be able to return to this intance. Are you sure?"),
                use
            );
            return;
        }
        use();
    },
    disassemble: function() {
        this.actionApplySimple("disassemble");
    },
    destroy: function() {
        this.actionApplySimple("entity-destroy");
    },
    relocate: function() {
        game.controller.clonedCreatingCursor(this, "relocate");
    },
    actionApplySimple: function(action) {
        if (this.isTool()) {
            game.popup.confirm(T("It will be destroyed. Are you sure?"), () => {
                game.network.send(action, {id: this.Id});
            });
            return;
        }
        if (this.isContainer()) {
            game.popup.confirm(T("It will be destroyed with all it's contents"), () => {
                game.network.send(action, {id: this.Id});
            });
            return;
        }

        this.queueActionMaybe(action);
    },
    queueActionMaybe: function(action) {
        if (this.inContainer() && Entity.queueable(action)) {
            var container = Container.getEntityContainer(this);
            if (!container) {
                game.network.send(action, {id: this.Id});
                return;
            }
            this.queueAction(action, container.filter(entity => entity.is(this.Type)));
        } else {
            if (Entity.repeatable(action)) {
                game.controller.lastAction.set(() => {
                    // check if object was removed
                    if (Entity.get(this.Id)) {
                        this.queueActionMaybe(action);
                    }
                });
            }
            game.network.send(action, {id: this.Id});
        }
    },
    fix: function() {
        game.network.send("entity-fix", {id: this.Id});
    },
    pickUp: function() {
        game.network.send("entity-pick-up", {id: this.Id});
    },
    lift: function() {
        game.network.send("lift-start", {id: this.Id});
    },
    queueAction(action, list) {
        if (list.length > 0) {
            game.network.send(action, {Id: _.head(list).Id}, () => {
                this.queueAction(action, _.tail(list));
            });
        }
    },
    actionApply: function(action) {
        var localAction = util.lcfirst(action);
        return function() {
            if (this[localAction]) {
                this[localAction]();
                return;
            }

            this.queueActionMaybe(action);
        };
    },
    inWorld: function() {
        return this.Location == Entity.LOCATION_ON_GROUND || this.Location == Entity.LOCATION_BURDEN;
    },
    canCollideNow: function() {
        return this.CanCollide &&
            this.Location == Entity.LOCATION_ON_GROUND &&
            this.Disposition == "" &&
            this.Group != "gate";
    },
    inContainer: function() {
        return this.Container > 0;
    },
    findRootContainer: function() {
        var cnt = this.findContainer();
        for (var i = 0; i < 100; i++) {
            if (cnt != null && cnt.inContainer())
                cnt = cnt.findContainer();
            else
                return cnt;
        }
        game.sendError(`Recursive container: ${this.Id}`);
        return null;
    },
    findContainer: function() {
        return Entity.get(this.Container);
    },
    update: function() {
    },
    //used by sign
    read: function() {
        var text = dom.tag("textarea");
        text.readonly = true;
        if (this.Props.Text[0] == "$") {
            util.ajax("books/ru/" + this.Props.Text.substr(1) + ".txt", function(data) {
                text.value = data;
            }.bind(this));
        } else {
            text.value = this.Props.Text;
        }
        new Panel("editable", this.Name, [text]).setEntity(this).show();
    },
    //used by sign
    edit: function() {
        var id = this.Id;
        game.popup.prompt(T("Edit"), [this.Props.Text], function(text) {
            game.network.send("sign-edit", {Id: id, Text: text});
        });
    },
    //used by container
    open: function() {
        // If entity *became* container after server update
        // old items may be without slots, so ignore them here.
        if (this.Props.Slots.length == 0 && !this.Fuel) {
            return null;
        }

        if (this.belongsTo(game.player)) {
            Container.show(this);
        } else {
            game.network.send("Open", {Id: this.Id}, () => Container.show(this));
        }
        return null;
    },
    split: function() {
        var args = {Id: this.Id};
        if ("Amount" in this) {
            game.popup.prompt(T("How many?"), 1, function(amount) {
                args.Amount = +amount;
                game.network.send("split", args);
            });
        } else {
            game.network.send("Split", args);
        }
    },
    sync: function(data) {
        var p = new Point(this.X, this.Y);
        for(var prop in data) {
            switch (prop) {
            case "X":
                p.x = data.X;
                break;
            case "Y":
                p.y = data.Y;
                break;
            default:
                this[prop] = data[prop];
            }
        }
        this.setPoint(p);

        switch(this.Group) {
        case "jukebox":
            this.defaultActionSuccess = () => { game.jukebox.open(this); };
            var time = (Date.now() - this.Started * 1000) / 1000;
            game.jukebox.play(this.Props.Text, time >> 0);
            break;
        case "slot-machine":
            this.defaultActionSuccess = () => { new SlotMachine(this); };
            break;
        case "label":
        case "portal":
        case "book":
        case "grave":
        case "sign":
        case "milepost":
            this.Actions.push("edit");
            this.Actions.push("read");
            break;
        case "processor":
        case "bonfire":
        case "furnace":
        case "oven":
            this._canUse = true;
        case "fishing-rod":
        case "table":
        case "bag":
        case "drying-frame":
        case "garbage":
        case "container":
        case "feeder":
        case "player-corpse":
        case "shredder":
        case "altar":
            if (this.MoveType != Entity.MT_PORTABLE) {
                this.defaultAction = () => this.open();
            }
            break;
        case "blank":
            this.defaultActionSuccess = () => {
                game.controller.craft.open(this, game.player.burden);
            };
            break;
        case "currency":
            if (this.Amount) {
                this.Name = this.Amount + " " + this.Type;
            }
            break;
        case "tanning-tub":
            this._canUse = true;
            break;
        case "claim":
            this.Actions = ["claimControls"];
            if (this.State == "warn") {
                var id = this.Id;
                this.defaultActionSuccess = function() {
                    var panel = new Panel("claim", "Claim", [
                        T("Don't forget to pay for a claim!"),
                        dom.wrap("", [
                            dom.button(T("Snooze"), "", () => {
                                game.network.send("Snooze", {Id: id}, function() {
                                    game.controller.setBlinkingWarning();
                                });
                                this.defaultActionSuccess = () => {};
                                panel.hide();
                            }),
                        ]),
                    ]).show();
                };
            }
            break;
        case "spell-scroll":
            this.Actions.push("cast");
            break;
        case "mailbox":
            this.defaultActionSuccess = (data) => { game.controller.mail.open(this, data.Mail); };
            break;
        }

        if ("Amount" in this && this.Amount > 1 && this.Group != "cheque") {
            this.Actions.push("split");
        }

        game.controller.updateItemInfo(this);
    },
    autoHideable: function() {
        if (this.Height <= 8 || this.Width <= 8)
            return false;
        return this.Sprite.Unselectable && this.Disposition != "floor";
    },
    shouldBeAutoHidden: function() {
        return game.player.inBuilding &&
            this.autoHideable() &&
            (this.Y + this.X > game.player.Y + game.player.X);
    },
    almostBroken: function() {
        return this.Durability.Max > 0 && this.Durability.Current <= 0.1*this.Durability.Max;
    },
    drawable: function() {
        if (this.Location != Entity.LOCATION_ON_GROUND)
            return false;
       if (game.player.inBuilding && this.Disposition == "roof")
            return false;
        return true;

    },
    draw: function() {
        if (!this.drawable())
            return;
        if (!this.sprite || !this.sprite.ready) {
            this.drawBox();
            return;
        }

        this.drawSprite();

        if (game.debug.entity.box) {
            this.drawBox();
            this.drawCenter();
        }

        if (game.debug.entity.position) {
            var text = "(" + (this.X) + " " + (this.Y) + ")";
            text += " id:" + this.Id;
            game.ctx.fillStyle = "#e2e9ec";
            game.drawStrokedText(text, this.X, this.Y);
        }
    },
    drawSprite: function() {
        if (this.Group != "plow") {
            var cycle = null;
            if (this.Lifetime) {
                switch (this.Type) {
                case "circle-of-fire":
                    cycle = {
                        start: 13,
                        end: 20,
                        lifetime: this.Lifetime,
                    };
                    break;
                case "circle-of-ice":
                    cycle = {
                        start: 11,
                        end: 25,
                        lifetime: this.Lifetime,
                    };
                    break;
                }
            }
            this.sprite.animate(cycle);
        }

        var p = this.getDrawPoint();

        if (this.Disposition == "roof" && game.controller.hideStatic) {
            return;
        }
        if ((this.MoveType == Entity.MT_STATIC || this.CanCollide) && game.controller.hideStatic) {
            this.drawBox(this.getDrawBoxColor());
        } else if (this.shouldBeAutoHidden()) {
            if (config.graphics.semiTransparentWalls) {
                this.sprite.drawAlpha(p, 0.3);
            }
            this.drawBox(this.getDrawBoxColor());
        } else {
            if (this.Type == "blank") {
                game.ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
                if (this.round) {
                    game.iso.fillCircle(this.X, this.Y, this.Radius);
                } else {
                    game.iso.fillRect(this.leftTopX(), this.leftTopY(), this.Width, this.Height);
                }
            }
            if (config.graphics.autoHideObjects &&
                this.MoveType == Entity.MT_STATIC &&
                this.CanCollide &&
                this.X > game.player.X &&
                this.Y > game.player.Y &&
                this.intersects(game.player.X, game.player.Y)
               ) {
                this.sprite.drawAlpha(p, 0.2);
                this.drawBox();
                this.visibiliyObstacle = true;
            } else {
                this.visibiliyObstacle = false;
                this.sprite.draw(p);
            }
        }
    },
    drawClaim: function() {
        var no = this.North*CELL_SIZE;
        var we = this.West*CELL_SIZE;
        var so = this.South*CELL_SIZE;
        var ea = this.East*CELL_SIZE;

        var w = we+ea;
        var h = no+so;
        var x = this.X - we;
        var y = this.Y - no;

        var color = (game.player.Id == this.Creator) ? "255,255,255" : "255,0,0";
        if (config.ui.fillClaim) {
            game.ctx.fillStyle = "rgba(" + color + ", 0.3)";
            game.iso.fillRect(x, y, w, h);
        }
        if (config.ui.strokeClaim) {
            game.ctx.lineWidth = 3;
            game.ctx.strokeStyle = "rgba(" + color + ", 0.7)";
            game.iso.strokeRect(x, y, w, h);
            game.ctx.lineWidth = 1;
        }
        if (this.State == "warn" && this.Creator == game.player.Id) {
            game.controller.setBlinkingWarning(T("Check your stake claim!"));
        }
    },
    drawBox: function(fill = "#ccc", stroke = "#e2e9ec", alpha = 0.3) {
        game.ctx.save();
        game.ctx.globalAlpha = alpha;
        game.ctx.strokeStyle = stroke;
        game.ctx.fillStyle = fill;
        var p = this.screen();
        if (this.round) {
            game.iso.fillStrokedCircle(this.X, this.Y, this.Radius);
        } else {
            game.iso.fillStrokedRect(this.leftTopX(), this.leftTopY(), this.Width, this.Height);
        }
        game.ctx.restore();
    },
    getDrawBoxColor: function() {
        if (this.Group == "gate" || this.Type.indexOf("-arc") != -1) {
            return (this.CanCollide) ? "violet" : "magenta";
        }
        return "rgba(255, 255, 255, 0.5)";
    },
    drawCenter: function() {
        var p = this.screen();
        game.ctx.fillStyle = "magenta";
        game.ctx.fillRect(p.x, p.y, 3, 3);
    },
    setPoint: function(p) {
        const reinsert = this.Id && this.inWorld();
        if (reinsert)
            game.sortedEntities.remove(this);

        this.x = p.x;
        this.y = p.y;

        // if (reinsert) {
        //     game.quadtree.remove(this);
        //     game.quadtree.insert(this);
        // }

        if (reinsert)
            game.sortedEntities.add(this);
    },
    drawAura: function() {
        switch (this.Group) {
        case "feeder":
            const {current} = Entity.containerSize(this);
            game.ctx.fillStyle = util.rgba(
                Math.floor(235-255/64*current),
                Math.floor(20+235/64*current),
                20,
                0.3
            );
            game.iso.fillCircle(this.X, this.Y, this.WorkRadius);
            break;
        case "beehive":
        case "altar":
            game.ctx.fillStyle = "rgba(20, 200, 20, 0.3)";
            game.iso.fillCircle(this.X, this.Y, this.WorkRadius);
            break;
        case "milepost":
            game.ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
            const r = this.ProtectionRadius * CELL_SIZE;
            game.iso.fillRect(this.X - r, this.Y - r, 2*r, 2*r);
            break;
        }
    },
    drawHovered: function() {
        if (this.Creator && this.almostBroken()) {
            this.sprite.drawAtop(this.getDrawPoint(), "rgba(230, 10, 10, 0.4)");
        } else {
            this.sprite.drawOutline(this.getDrawPoint());
        }
        var p = this.screen();
        var x = p.x - game.ctx.measureText(this.title).width / 2;
        var y = p.y - this.getDrawDy() - FONT_SIZE * 0.75;

        var title = this.title;

        switch (this.Group) {
        case "sign":
        case "grave":
        case "milepost":
            if (!this.Props.Text)
                break;
            var text = (this.Creator) ? this.Props.Text : T(this.Props.Text);
            var padding = 5;
            var measure = game.ctx.measureText(text);
            x = p.x - measure.width / 2;
            y -= FONT_SIZE;
            game.ctx.fillStyle = "#444";
            game.ctx.fillRect(
                x,
                y,
                measure.width + padding * 2,
                FONT_SIZE + padding * 2
            );
            game.ctx.fillStyle = "#e2e9ec";
            game.ctx.fillText(text, x + padding, y + padding + FONT_SIZE);
            return;
        }
        game.ctx.fillStyle = "#e2e9ec";
        if (game.controller.modifier.shift)
            title += " | " + T("Quality") + ":" + this.Quality;
        game.drawStrokedText(title, x, y);
    },
    canIntersect: function(noignore) {
        if (this.Location == Entity.LOCATION_BURDEN) {
            return false;
        }
        switch (this.Group) {
        case "respawn":
            return true;
        }
        if (!this.inWorld())
            return false;
        if (this.Id == game.player.Burden)
            return false;
        if (!this.sprite.outline)
            return false;
        if (this.MoveType == Entity.MT_STATIC && game.controller.hideStatic)
            return false;


        if (game.player.inBuilding) {
            if (this.Disposition == "roof")
                return false;
            if (this.autoHideable() && this.Group != "gate")
                return false;
        }

        noignore = noignore || game.controller.modifier.ctrl;

        switch (this.Group) {
        case "gate":
        case "portal":
            if (config.graphics.autoHighlightDoors)
                return true;
        }

        return noignore || this.selectable();
    },
    selectable: function() {
        switch (this.Group) {
        case "entrance":
        case "exit":
            return true;
        case "fence":
            return false;
        }
        return (!this.Sprite.Unselectable && !this.Disposition);
    },
    intersects: function(x, y, noignore) {
        if (!this.canIntersect(noignore))
            return false;
        if (!this.sprite.imageData)
            return false;

        var w = this.sprite.width;
        var h = this.sprite.height;
        var offset = new Point(
            w * this.sprite.frame,
            h * this.sprite.position
        );
        var p = new Point(x, y)
            .toScreen()
            .sub(this.getDrawPoint())
            .add(offset);

        if (!util.intersects(
            p.x, p.y,
            offset.x, offset.y, w, h
        )) {
            return false;
        }

        var pixel = this.sprite.imageData.data[p.y*4*this.sprite.imageData.width + p.x*4-1];
        return pixel > 64;
    },
    collides: function(x, y, radius) {
        if(!this.inWorld() || !this.CanCollide || this.Owner)
            return false;
        if (this.Width && this.Height) {
            //TODO: fixme
            return util.rectIntersects(
                this.leftTopX(),
                this.leftTopY(),
                this.Width,
                this.Height,
                x - radius,
                y - radius,
                radius,
                radius
            );
        }
        return util.distanceLessThan(this.X - x, this.Y - y, Math.max(this.Radius, radius));
    },
    distanceTo: function(e) {
        return Math.hypot(this.X - e.X, this.Y - e.Y);
    },
    drop: function() {
        var x = game.controller.world.x;
        var y = game.controller.world.y;
        var biom = game.map.biomAt(x, y);
        if (!biom) {
            game.sendError(`Biom (${x} ${y}) not found`);
            return;
        }

        var cmd = "entity-drop";
        var align = false;
        // TODO: refactor
        if (this.is("seed")) {
            if (biom.Name == "plowed-soil" || biom.Name == "soil") {
                cmd = "plant";
                align = true;
            }
        } else if (this.is("soil")) {
            if (biom.Name == "plowed-soil" || biom.Name == "shallow-water") {
                cmd = "swamp";
                align = true;
            }
        }
        if (align) {
            var p = new Point(x, y);
            var data = this.alignedData(p);
            if (data) {
                p.x = data.x + data.w/2;
                p.y = data.y + data.h/2;
            }

            x = p.x;
            y = p.y;
        }
        game.network.send(cmd, {
            Id: +this.Id,
            X: x,
            Y: y,
        });

        game.controller.lastAction.set(() => {
            const items = game.player.findItems([this.Type])[this.Type];
            const entity = items.find(item => item != this);
            if (!entity) {
                return;
            }
            const slot = Container.getEntitySlot(entity);
            slot && slot.click();
        });
    },
    dwim: function() {
        game.network.send("dwim", {id: this.Id});
    },
    use: function(e) {
        if (Entity.usable(e)) {
            game.network.send("entity-use", {Id: this.Id, Equipment: e.Id});
        } else {
            game.network.send("entity-use", {Id: e.Id, Equipment: this.Id});
        }
        return true;
    },
    canUse: function(e) {
        return this._canUse || Entity.usable(e);
    },
    belongsTo: function(character) {
        if (this.Owner == character.Id)
            return true;
        var id = this.Container;
        var bag = character.bag();
        if (!bag)
            return false;
        while (id > 0) {
            if (id == bag.Id)
                return true;
            var e = Entity.get(id);
            if (!e)
                return false;
            id = e.Container;
        }
        return false;
    },
    icon: function() {
        if (!this.sprite) {
            this.initSprite();
        }
        return this.sprite.icon();
    },
    rotate: function(delta) {
        switch (this.Orientation) {
        case "v":
            this.Orientation = "h";
            break;
        case "h":
            this.Orientation = "v";
            break;
        case "n":
        case "w":
        case "s":
        case "e":
            if (delta < 0) {
                switch(this.Orientation) {
                case "n":
                    this.Orientation = "w";
                    break;
                case "w":
                    this.Orientation = "s";
                    break;
                case "s":
                    this.Orientation = "e";
                    break;
                case "e":
                    this.Orientation = "n";
                    break;
                default:
                    return;
                }
            } else {
                switch(this.Orientation) {
                case "n":
                    this.Orientation = "e";
                    break;
                case "e":
                    this.Orientation = "s";
                    break;
                case "s":
                    this.Orientation = "w";
                    break;
                case "w":
                    this.Orientation = "n";
                    break;
                default:
                    return;
                }
            }
            break;
        default:
            return
        }

        if (this.sprite)
            this.sprite.ready = false;

        var w = this.Width;
        this.Width = this.Height;
        this.Height = w;

        this.initSprite();
    },
    cast: function(callback = () => {}) {
        switch (this.Type) {
        case "scroll-of-town-portal":
        case "scroll-of-invisibility":
        case "scroll-of-wind-walk":
        case "hunter-scroll":
            game.network.send("cast", {Id: this.Id}, callback);
            break;
        case "embracing-web-scroll":
        case "minor-healing-scroll":
            game.controller.cursor.setSimpleCallback(this, callback);
            break;
        default:
            const spell = new Entity(this.Spell, this.Id);
            spell.initSprite();
            game.controller.creatingCursor(spell, "cast", callback);
        }
    },
    claimControls: function() {
        if (this.Creator != game.player.Id)
            return;

        var id = this.Id;
        function makeButtons(action) {
            return dom.wrap("claim-actions", ["north", "west", "south", "east"].map(function(dir) {
                return dom.button(
                    T(action + " " + dir),
                    "claim-action-" + dir,
                    function () {
                        var cmd = action + util.ucfirst(dir);
                        game.network.send(cmd, {Id: id});
                    }
                );
            }));
        }
        new Panel(
            "claim",
            "Claim",
            [
                T("claim-help-text"),
                dom.hr(),
                makeButtons("Extend"),
                dom.hr(),
                makeButtons("Shrink")
            ]
        ).setTemporary(true).show();
    },
    applyAdminCmd: function() {
        var id = this.Id;
        var prepare = function(cmd) {
            return function() {
                game.chat.append("*" + cmd + " " + id);
            };
        };
        var send = function(cmd) {
            return function() {
                game.chat.send("*" + cmd + " " + id);
            };
        };
        var self = this;
        var bind = function(method) {
            return method.bind(self);
        };
        game.menu.show({
            "Fix": bind(self.fix),
            "Set quality": prepare("set-quality"),
            "Set creator": prepare("set-creator"),
            "Get creator": send("get-creator"),
            "Set comment": prepare("set-comment"),
            "Finish building": send("finish-building"),
            "Fill building": send("fill-building"),
            "Summon": send("summon"),
            "100q": function() {
                game.chat.send("*set-quality " + self.Id + " " + 100);
            },
            "Clone": function() {
                var args = {
                    Type: self.Type,
                    X: game.player.X,
                    Y: game.player.Y,
                };
                game.network.send("entity-add", args, function(data) {
                    for (var id in data.Entities) {
                        var entity = data.Entities[id];
                        if (entity.Type == self.Type && entity.Creator == 0) {
                            game.chat.send("*set-quality " + id + " " + self.Quality);
                            return;
                        }
                    }
                });
            },
            "$prompt": function() {
                var lastCmd = Entity.lastPromptCmd || "set-quality";
                game.popup.prompt("cmd?", lastCmd, function(cmd) {
                    Entity.lastPromptCmd = cmd;
                    game.chat.append("*" + cmd + " " + id);
                });
            },
        });
    },
    isContainer: function() {
        return "Slots" in this.Props;
    },
    onremove: function() {
        switch (this.Group) {
        case "jukebox":
            game.jukebox.stop();
            game.jukebox.panel.hide();
        }
    },
    template: function() {
        return Entity.templates[this.Type];
    },
    bbox: function() {
        const width = (this.Width || 2*this.Radius);
        const height = (this.Height || 2*this.Radius);
        return new BBox(
            this.X - width/2,
            this.Y - height/2,
            width,
            height
        );
    },
};
