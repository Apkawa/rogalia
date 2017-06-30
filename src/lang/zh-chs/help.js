/* global T, dom */

"use strict";

T.help = {
    fight: function(combos) {
        return dom.wrap("", [
            dom.make("h3", "近战"),
            dom.make("p", "可以通过击中敌人来激活增益（Nya除外）"),
            dom.make("p", "如果角色有任何buff，Irimi会提高速度"),
            dom.table(["Name", "Combo", "Description"], combos),
            dom.hr(),
            dom.make("h3", "远程攻击"),
            dom.make("p", "使用远程武器你的另一只手必须是空的"),
            dom.make("p", "射击需要弹药，这取决于武器类型"),
            dom.make("p", "你在竞技场上不需要弹药"),
            dom.wrap("", [
                "Every range weapon has:",
                dom.ul([
                    "最大范围：其外的目标无法射击",
                    "有效范围：在这个半径内，你有100％的准确度。",
                    "射击速度：你能够多快的射击",
                    "弹药类型：例如石头，箭头，原子",
                    "弹药速度：弹药达到目标的速度",
                ])
            ]),
            dom.make("p", "查看最大和有效范围按ctrl + shift"),
            dom.make("p", "目标可以逃避你的射击，如果它离开射击半径"),
            dom.make("p", "在有效范围之外你命中率越来越低"),
        ]);
    },
    combos: {
        de: {
            desc: "Buff",
            effect: "+吸收，+抵挡几率",
        },
        su: {
            desc: "Buff",
            effect: "+伤害，+暴击几率",
        },
        nya: {
            desc: "AoE Buff",
            effect: "+暴击几率[de]，+吸收[su]",
        },
        ikkyo: {
            desc: "爆发",
            effect: "嘲讽, pvp: 50% 昏迷1-5秒",
        },
        shihonage: {
            desc: "爆发",
            effect: "大量伤害，缓速5秒",
        },
        iriminage: {
            desc: "爆发",
            effect: "20% 昏迷2秒",
        },
    },
};
