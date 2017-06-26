/* global game */

"use strict";

const CELL_SIZE = 32;
const FONT_SIZE = 14;
const DEFAULT_CLIENT_WIDTH = 1280;
const DEFAULT_CLIENT_HEIGHT = 720;

var config = {
    character: {
        // pathfinding: false,
        hideHelmet: () => game.player.Style.HideHelmet,
        rotateWasd: false,
        autoTarget: true,
        autoAttack: false,
        obstacleAvoidance: () => game.player.Settings.ObstacleAvoidance,
    },
    ui: {
        language: function(current) {
            return  (current)
                ? game.lang
                : ["en", "ru", "ja", "pt-br", "zh-cht", "zh-chs"];
        },
        hp: true,
        name: true,
        npc: true,
        allowSelfSelection: false,
        chatAttached: true,
        chatBalloons: true,
        chatEnterBlur: false,
        showAttackRadius: true,
        fillClaim: false,
        strokeClaim: true,
        comboHelper: true,
    },
    graphics: {
        fullscreen: false,
        gpuRender: true,
        autoHighlightDoors: false,
        snowflakes: false,
        movingSpace: false,
        centerScreen: true,
        autoHideWalls: true,
        autoHideObjects: true,
        semiTransparentWalls: true,
        topologicalSort: false,
        // drawPath: true,
    },
    sound: {
        playSound: true,
        playMusic: true,
        jukebox: true,
        chatNotifications: false,
        soundVolume: 0.50,
        musicVolume: 0.25,
        voiceVolume: 1.00,
    },
};

var debug = {
    map: {
        world: true,
        darkness: false,
        simpleDarkness: false,
        ray: false,
        position: false,
    },
    player: {
        box: false,
        position: false,
        path: false,
    },
    entity: {
        box: false,
        position: false,
        logOnClick: false,
    },
    network: {
        length: false,
        data: false,
    },
};
