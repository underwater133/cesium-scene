<template>
    <div id="cesiumContainer" style="width: 100vw; height: 100vh;"></div>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";
import useCesium from '../js/useCesium.js'
import FlyLine from "../js/flyLine/FlyLine.js";
import * as Cesium from "cesium";

let viewer = null;
let flyLine = null;
const odList = [
    [[114.404, 30.535], [112.404, 22.535], "#FF0000"],
    [[110.978, 28.343], [112.404, 22.535], "#00FF00"],
    [[112.404, 22.535], [115.926, 23.191], "#0000FF"],
    [[112.404, 22.535], [119.584, 26.864], "#FF00FF"],
]

onMounted(() => {
    viewer = useCesium('cesiumContainer');
    flyLine = new FlyLine(viewer);
    odList.forEach(od => {
        flyLine.addLine(od[0], od[1], od[2]);
    })
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(108.404, 19.535, 700000),
        orientation: {
            heading: Cesium.Math.toRadians(45),
            pitch: Cesium.Math.toRadians(-40),
            roll: 0.0
        }
    });
})

onUnmounted(() => {
    flyLine?.clear();
})

</script>