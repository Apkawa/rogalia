/* global T, dom */

"use strict";

T.help = {
    fight: function(combos) {
        return dom.wrap("", [
            dom.make("h3", "근접 전투"),
            dom.make("p", "버프는 적을 공격함으로써 활성화 할 수 있습니다(Nya는 제외)."),
            dom.make("p", "캐릭터가 아무 버프나 가지고 있다면 입신의 속도가 약간 증가합니다."),
            dom.table(["Name", "Combo", "Description"], combos),
            dom.hr(),
            dom.make("h3", "원거리 전투"),
            dom.make("p", "원거리 무기를 사용하려면 다른 손이 비어있어야 합니다."),
            dom.make("p", "탄약은 발사하는데 사용합니다. 이는 무기의 종류에 따라 다릅니다."),
            dom.make("p", "아레나에선 탄약이 필요 없습니다."),
            dom.wrap("", [
                "Every range weapon has:",
                dom.ul([
                    "최대 사거리 : 이 범위를 벗어난 적은 공격할 수 없습니다.",
                    "유효 사거리 : 이 범위 내의 적은 100%의 정확도로 공격합니다.",
                    "발사 속도 : 쏘는 속도",
                    "탄약 타입 : 예로 돌, 화살, 원자들이 있습니다.",
                    "탄약 속도 : 탄이 타겟에게 도달하는 속도",
                ])
            ]),
            dom.make("p", "최대, 유효 사거리는 ctrl + shift 키를 눌러 확인할 수 있습니다."),
            dom.make("p", "타겟이 사거리를 벗어나면 회피할 수 있습니다."),
            dom.make("p", "유효 사거리 밖에선 빗맞을 확률이 높아집니다."),
        ]);
    },
    combos: {
        de: {
            desc: "Buff",
            effect: "데미지 흡수량 증가, 방패 블럭 확률 증가.",
        },
        su: {
            desc: "Buff",
            effect: "데미지 증가, 크리티컬 확률 증가.",
        },
        nya: {
            desc: "AoE Buff",
            effect: "[su]의 크리티컬 확률 증가, [de]의 데미지 흡수량 증가.",
        },
        ikkyo: {
            desc: "Strike",
            effect: "도발, pvp : 50% 확률로 0.5-1.5초 스턴.",
        },
        shihonage: {
            desc: "Strike",
            effect: "매우 강한 데미지, 5초간 슬로우.",
        },
        iriminage: {
            desc: "Strike",
            effect: "20% 확률로 2초간 스턴. pve에도 적용됩니다.",
        },
    },
};
