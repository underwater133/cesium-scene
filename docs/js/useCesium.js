import { onUnmounted } from 'vue'
import * as Cesium from 'cesium'

export default function useCesium(domId, options = {}) {
    Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZjEwMDUyMS1kZjJmLTRmZjUtODRkMy03YTMxZWY4MzEyMTQiLCJpZCI6MjYwMTkzLCJpYXQiOjE3MzMzNjQ5Nzh9.uAHIgn1GrmQG8VSYgojcdVsr8kR4kCr8cxyhwbD19jg"
    window.CESIUM_BASE_URL = '/cesium/'
    const viewer = new Cesium.Viewer(domId, options);
    window.viewer = viewer;
    viewer.scene.globe.depthTestAgainstTerrain = true;//地形深度测试 

    onUnmounted(() => {
        viewer.destroy();
    });

    return viewer
}