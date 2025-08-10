import { onUnmounted } from 'vue'
import * as Cesium from 'cesium'
import CesiumNavigation from "cesium-navigation-es6";


export default function useCesium(domId, options = {}) {
    Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZjEwMDUyMS1kZjJmLTRmZjUtODRkMy03YTMxZWY4MzEyMTQiLCJpZCI6MjYwMTkzLCJpYXQiOjE3MzMzNjQ5Nzh9.uAHIgn1GrmQG8VSYgojcdVsr8kR4kCr8cxyhwbD19jg"
    window.CESIUM_BASE_URL = import.meta.env.BASE_URL + 'cesium/';
    const viewer = new Cesium.Viewer(domId, options);
    window.viewer = viewer;
    viewer.scene.globe.depthTestAgainstTerrain = true;//地形深度测试 

    const navigation = new CesiumNavigation(viewer, {
        enableZoomControls: false,
    });

    // 监听鼠标左键点击事件，获取点击的经纬度
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    handler.setInputAction((event) => {
        // 获取点的世界坐标系中的笛卡尔坐标
        const start_point = viewer.scene.camera.pickEllipsoid(event.position, viewer.scene.globe.ellipsoid)
        // 笛卡尔坐标转弧度
        let cartographic = Cesium.Cartographic.fromCartesian(start_point, viewer.scene.globe.ellipsoid, new Cesium.Cartographic())
        // Cesium.Math.toDegrees 弧度转度，将弧度转换成经纬度
        let lng = Cesium.Math.toDegrees(cartographic.longitude)
        let lat = Cesium.Math.toDegrees(cartographic.latitude)
        console.log('经纬度', lng, lat)
    }, Cesium.ScreenSpaceEventType.LEFT_UP)

    onUnmounted(() => {
        // 清除所有实体
        viewer.entities.removeAll();
        console.log("清除所有实体");

        // 移除所有影像图层
        viewer.imageryLayers.removeAll();
        console.log("移除所有影像图层");

        // 移除所有数据源
        viewer.dataSources.removeAll();
        console.log("移除所有数据源");

        // 销毁 Viewer 实例
        viewer.destroy();
        console.log("销毁 Viewer 实例");

        // 移除 DOM 容器
        const cesiumContainer = document.getElementById("cesium_container");
        if (cesiumContainer) {
            cesiumContainer.remove();
            console.log("移除 DOM 容器");
        }
    });

    return viewer
}