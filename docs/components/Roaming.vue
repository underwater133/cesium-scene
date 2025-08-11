<template>
    <div id="cesiumContainer" style="width: 100vw; height: 100vh;"></div>
    <div class="cotrols">
        <button @click="cameraRoaming">开始相机漫游</button>
        <button @click="pauseOrContinue(false)">暂停</button>
        <button @click="pauseOrContinue(true)">继续</button>
        <button @click="endRoaming">取消</button>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";
import useCesium from '../js/useCesium.js'
import Roaming from '../js/roaming/Roaming.js'
import * as Cesium from 'cesium'

let viewer = null;
let roaming = null;
const path = [
    [-122.3297489052724, 47.602683039216046, 30],
    [-122.33061221665588, 47.60358220207023, 70],
    [-122.33136617050747, 47.60441053443889, 110],
    [-122.33127708791835, 47.604842428130816, 150],
    [-122.33074023003361, 47.605039846340485, 190],
    [-122.32904618949662, 47.60572033574011, 230],
    [-122.32855938469798, 47.6051074735877, 270],
    [-122.32929748813685, 47.60457302333626, 310]
]

const headingPitchRangeList = [
    [-30, 0, 100],
    [-30, 0, 50],
    [15, 10, 20],
    [50, 20, 5],
    [90, 10, 20],
    [160, 5, 50],
    [220, 0, 200],
    [300, 0, 300],
]

const cameraRoaming = () => {
    roaming.cameraRoaming(path, 16, headingPitchRangeList);
}

const pauseOrContinue = (isContinue) => {
    if (isContinue) {
        roaming.start();
    } else {
        roaming.pause();
    }
}

const endRoaming = () => {
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(path[0][0], path[0][1], 50),
        orientation: {
            heading: Cesium.Math.toRadians(headingPitchRangeList[0][0]),
            pitch: Cesium.Math.toRadians(headingPitchRangeList[0][1]),
            roll: 0
        }
    })
    roaming.clear();
}

onMounted(() => {
    viewer = useCesium('cesiumContainer', {
        terrainProvider: Cesium.createWorldTerrain(),
    });
    setTimeout(() => {
        viewer.scene.primitives.add(new Cesium.createOsmBuildings());// 3D建筑
    })

    roaming = new Roaming(viewer, { loop: false, multiplier: 1 });


    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(path[0][0], path[0][1], 50),
        orientation: {
            heading: Cesium.Math.toRadians(headingPitchRangeList[0][0]),
            pitch: Cesium.Math.toRadians(headingPitchRangeList[0][1]),
            roll: 0
        }
    })
})

onUnmounted(() => {
    roaming?.clear();
})

</script>

<style>
.cotrols {
    position: absolute;
    left: 10px;
    top: 10px;
    z-index: 10000;

    button {
        margin-right: 10px;
        padding: 5px 10px;
        border-radius: 5px;
        background-color: #4CAF50;
    }
}
</style>