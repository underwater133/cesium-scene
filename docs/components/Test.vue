<template>
    <div id="cesiumContainer" style="width: 100vw; height: 100vh;"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import * as Cesium from 'cesium'
window.CESIUM_BASE_URL = '/cesium/'
onMounted(async () => {
    Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZjEwMDUyMS1kZjJmLTRmZjUtODRkMy03YTMxZWY4MzEyMTQiLCJpZCI6MjYwMTkzLCJpYXQiOjE3MzMzNjQ5Nzh9.uAHIgn1GrmQG8VSYgojcdVsr8kR4kCr8cxyhwbD19jg"
    const viewer = new Cesium.Viewer('cesiumContainer');
})
</script>