<template>
    <div id="cesiumContainer" style="width: 100vw; height: 100vh;"></div>
    <div class="click-info">
        <p>点击坐标</p>
        <p>经度：{{ clickPosition.longitude }}</p>
        <p>纬度：{{ clickPosition.latitude }}</p>
        <button class="set-location-btn" @click="setLocation">赋值</button>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, reactive } from "vue";
import { scale, rotate, moveModel } from "../js/cesiumTools.js";
import useCesium from '../js/useCesium.js'
import * as Cesium from "cesium";
import * as dat from 'dat.gui';

let viewer = null;
let tileset = null;
let originCenter = null;
let originMatrix = null;
let gui = null;

const clickPosition = reactive({
    longitude: 0,
    latitude: 0
})

const form = reactive({
    scale: 1,
    longitude: 0,
    latitude: 0,
    height: 0,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0
});

const initGUI = () => {
    gui = new dat.GUI();
    gui.domElement.style.position = 'absolute';
    gui.domElement.style.top = '80px';
    gui.domElement.style.left = '10px';

    // 位置控制
    const positionFolder = gui.addFolder('位置控制');
    positionFolder.add(form, 'longitude', -180, 180, 0.000001).name('经度').onChange(() => {
        if (tileset) {
            tileset.modelMatrix = moveModel(tileset, form.longitude, form.latitude, form.height, originCenter, originMatrix);
            actions.applyTransform();
        }
    });
    positionFolder.add(form, 'latitude', -90, 90, 0.000001).name('纬度').onChange(() => {
        if (tileset) {
            tileset.modelMatrix = moveModel(tileset, form.longitude, form.latitude, form.height, originCenter, originMatrix);
            actions.applyTransform();
        }
    });
    positionFolder.add(form, 'height', 0, 10000, 1).name('高度').onChange(() => {
        if (tileset) {
            tileset.modelMatrix = moveModel(tileset, form.longitude, form.latitude, form.height, originCenter, originMatrix);
            actions.applyTransform();
        }
    });
    positionFolder.open();

    // 缩放控制
    const scaleFolder = gui.addFolder('缩放控制');
    scaleFolder.add(form, 'scale', 0.1, 10, 0.1).name('缩放').onChange(() => {
        if (tileset) {
            scale(tileset, form.scale, form.scale, form.scale, originCenter, originMatrix);
            actions.applyTransform();
        }
    });
    scaleFolder.open();

    // 旋转控制
    const rotationFolder = gui.addFolder('旋转控制');
    rotationFolder.add(form, 'rotateX', 0, 360, 1).name('X轴旋转').onChange(() => {
        if (tileset) {
            rotate(tileset, form.rotateX, form.rotateY, form.rotateZ, originCenter, originMatrix);
            actions.applyTransform();
        }
    });
    rotationFolder.add(form, 'rotateY', 0, 360, 1).name('Y轴旋转').onChange(() => {
        if (tileset) {
            rotate(tileset, form.rotateX, form.rotateY, form.rotateZ, originCenter, originMatrix);
            actions.applyTransform();
        }
    });
    rotationFolder.add(form, 'rotateZ', 0, 360, 1).name('Z轴旋转').onChange(() => {
        if (tileset) {
            rotate(tileset, form.rotateX, form.rotateY, form.rotateZ, originCenter, originMatrix);
            actions.applyTransform();
        }
    });
    rotationFolder.open();

    // 操作按钮
    const actionsFolder = gui.addFolder('操作');
    const actions = {
        locateModel: () => {
            if (tileset) {
                viewer.zoomTo(tileset);
            } else {
                alert("请先选择模型");
            }
        },
        resetModel: () => {
            if (!tileset) {
                alert("请先选择模型");
                return;
            }
            tileset.boundingSphere.center = Cesium.clone(originCenter, true);
            tileset.modelMatrix = Cesium.clone(originMatrix, true);
            // 重置表单值
            const originCartographic = Cesium.Cartographic.fromCartesian(originCenter);
            form.longitude = Cesium.Math.toDegrees(originCartographic.longitude);
            form.latitude = Cesium.Math.toDegrees(originCartographic.latitude);
            form.height = 0;
            form.scale = 1;
            form.rotateX = 0;
            form.rotateY = 0;
            form.rotateZ = 0;
            // 更新GUI显示
            gui.updateDisplay();
        },
        applyTransform: () => {
            if (!tileset) {
                alert("请先选择模型");
                return;
            }
            tileset.modelMatrix = moveModel(tileset, form.longitude, form.latitude, form.height, originCenter, originMatrix);
            scale(tileset, form.scale, form.scale, form.scale);
            rotate(tileset, form.rotateX, form.rotateY, form.rotateZ);
        }
    };

    actionsFolder.add(actions, 'locateModel').name('定位模型');
    actionsFolder.add(actions, 'resetModel').name('重置模型');
    // actionsFolder.add(actions, 'applyTransform').name('应用变换');
    actionsFolder.open();
}

const initHandlers = () => {
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(e => {
        const start_point = viewer.scene.camera.pickEllipsoid(e.position, viewer.scene.globe.ellipsoid);
        let cartographic = Cesium.Cartographic.fromCartesian(start_point, viewer.scene.globe.ellipsoid, new Cesium.Cartographic());
        let lng = Cesium.Math.toDegrees(cartographic.longitude);
        let lat = Cesium.Math.toDegrees(cartographic.latitude);
        clickPosition.longitude = lng;
        clickPosition.latitude = lat;
        console.log("点击坐标：", lng, lat);
    }, Cesium.ScreenSpaceEventType.LEFT_UP);
}

const setLocation = () => {
    form.longitude = clickPosition.longitude;
    form.latitude = clickPosition.latitude;
    if (gui) {
        gui.updateDisplay();
    }
}

const load3DTiles = () => {
    tileset = new Cesium.Cesium3DTileset(
        {
            url: "/public/3dtiles/Quaint_Village/tileset.json",
            maximumScreenSpaceError: 1 // 默认16  值越大在同等距离下模型就越模糊，值越小则越清晰
        }
    );
    viewer.scene.primitives.add(tileset);
    tileset.readyPromise.then(() => {
        // 记录原始模型的位置信息
        const originCartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);
        const longitude = Cesium.Math.toDegrees(originCartographic.longitude);
        const latitude = Cesium.Math.toDegrees(originCartographic.latitude);
        tileset.modelMatrix = moveModel(tileset, longitude, latitude, 9);
        originCenter = Cesium.clone(tileset.boundingSphere.center);
        originMatrix = Cesium.clone(tileset.modelMatrix);
        form.longitude = longitude;
        form.latitude = latitude;
        form.height = 0;
        form.scale = 1;
        form.rotateX = 0;
        form.rotateY = 0;
        form.rotateZ = 0;


        viewer.zoomTo(tileset)

        initGUI();
        initHandlers();
    });
    
}

onMounted(() => {
    viewer = useCesium('cesiumContainer');
    load3DTiles();
})

onUnmounted(() => {
    if (gui) {
        gui.destroy();
        gui = null;
    }
})
</script>

<style scoped>
.click-info {
    position: absolute;
    top: 80px;
    right: 10px;
    width: 200px;
    background: rgba(0, 0, 0, 0.7);
    padding: 15px;
    color: white;
    border-radius: 5px;
    font-size: 14px;
}

.click-info p {
    margin: 5px 0;
    user-select: text;
}

.set-location-btn {
    background: #409eff;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
    width: 100%;
}

.set-location-btn:hover {
    background: #66b1ff;
}
</style>
<style>
.dg.main.a {
    width: 300px !important;
}
.dg .property-name {
    width: 60px !important;
}
.dg .slider {
    width: 50% !important;
}
.dg .c {
    width: 70% !important;
}
.dg .c input {
    width: 100px !important;
    height: 19px;
}
.close-button {
    width: 300px !important;
}
</style>