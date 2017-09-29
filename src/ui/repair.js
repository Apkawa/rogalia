/* global game, dom, T, TT, Panel, ContainerSlot, Container, Vendor */

"use strict";

function Repair(npc) {
    const container = {entity: {}};
    const slot = new ContainerSlot(container, 0);
    slot.element.check = ({entity}) => {
        return ["sword", "spear", "bow", "crossbow", "necklace"].includes(entity.Group) || "Armor" in entity;
    };
    slot.element.cleanUp = () => {
        if (slot.entity) {
            const from = Container.getEntitySlot(slot.entity);
            from && from.unlock();
        }
        slot.clear();
        slot.unlock();
        this.price = dom.replace(this.price, Vendor.createPrice(0));
        this.button.disabled = true;
    };
    slot.element.onmousedown = slot.element.cleanUp;
    slot.element.use = (entity) => {
        slot.set(entity);
        game.network.send("repair", {Name: "get-price", Master: npc.Id, Id: entity.Id}, ({RepairPrice}) => {
            this.price = dom.replace(this.price, Vendor.createPrice(RepairPrice));
        });
        this.button.disabled = false;
        return true;
    };

    this.slot = slot;
    this.price = Vendor.createPrice(0);
    this.button = dom.button(T("Repair"), "", () => {
        this.button.disabled = true;
        game.network.send("repair", {Master: npc.Id, Id: this.slot.entity.Id}, () => {
            slot.element.cleanUp();
        });
    });
    this.button.disabled = true;

    const wrapper = dom.wrap("repair-slot-wrapper");
    this.panel = new Panel("repair", "Repair", [
        this.slot.element,
        dom.wrap("repair-price", [
            T("Price"),
            ": ",
            this.price,
        ]),
        this.button,
        dom.button(T("Repair all"), "", () => {
            game.network.send("repair", {Name: "get-price-all", Master: npc.Id}, repairAll);
        }),
    ]).setEntity(npc).show();

    container.panel = this.panel;

    function repairAll({RepairPrice}) {
        game.popup.confirm([TT("Repair all for"), " ", Vendor.createPrice(RepairPrice)], () => {
            game.network.send("repair", {Name: "repair-all", Master: npc.Id});
        });
    }
};
