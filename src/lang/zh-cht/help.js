/* global T, dom */

"use strict";

T.help = {
    fight: function(combos) {
        return dom.wrap("", [
            dom.make("h3", "近戰"),
            dom.make("p", "可以通過擊中敵人來激活增益（Nya除外）"),
            dom.make("p", "如果角色有任何buff，Irimi會提高速度"),
            dom.table(["Name", "Combo", "Description"], combos),
            dom.hr(),
            dom.make("h3", "遠程攻擊"),
            dom.make("p", "使用遠程武器你的另一隻手必須是空的"),
            dom.make("p", "射擊需要彈藥，這取決於武器類型"),
            dom.make("p", "你在競技場上不需要彈藥"),
            dom.wrap("", [
                "Every range weapon has:",
                dom.ul([
                    "最大範圍：其外的目標無法射擊",
                    "有效範圍：在這個半徑內，你有100％的準確度。",
                    "射擊速度：你能夠多快的射擊",
                    "彈藥類型：例如石頭，箭頭，原子",
                    "彈藥速度：彈藥達到目標的速度",
                ])
            ]),
            dom.make("p", "查看最大和有效範圍按ctrl + shift"),
            dom.make("p", "目標可以逃避你的射擊，如果它離開射擊半徑"),
            dom.make("p", "在有效範圍之外你命中率越來越低"),
        ]);
    },
    combos: {
        de: {
            desc: "Buff",
            effect: "+吸收，+抵擋幾率",
        },
        su: {
            desc: "Buff",
            effect: "+傷害，+暴擊幾率",
        },
        nya: {
            desc: "AoE Buff",
            effect: "+暴擊幾率[de]，+吸收[su]",
        },
        ikkyo: {
            desc: "爆發",
            effect: "嘲諷, pvp: 50% 昏迷1-5秒",
        },
        shihonage: {
            desc: "爆發",
            effect: "大量傷害，緩速5秒",
        },
        iriminage: {
            desc: "爆發",
            effect: "20% 昏迷2秒",
        },
    },
};

