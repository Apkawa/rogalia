"use strict";

importScripts("image-filters.js");
onmessage = function (e) {
    postMessage(ImageFilter.applyTint(e.data.imageData, e.data.color, e.data.opacity));
};
