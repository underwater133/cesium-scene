import * as Cesium from "cesium";
import { computedPathData } from "./computedPathData";
import { FlyLineMaterialGLSL } from "./FlyLineMaterialGLSL";
class FlyLine {
    constructor(viewer) {
        this.viewer = viewer;
        this.flyLines = new Cesium.PrimitiveCollection();
        this.viewer.scene.primitives.add(this.flyLines);
    }
    
    addLine(startPoint, endPoint, color) {
        const positions = computedPathData(startPoint, endPoint);
        
        let colors = [];
        let length = positions.length;
        for (let i = 0; i < length; ++i) {
            let alpha = 0;
            if (i < length / 2) {
                alpha = (i / length) * 2 * 0.6 + 0.2;
            } else {
                alpha = ((length - i) / length) * 2 * 0.6 + 0.2;
            }
            colors.push(
                Cesium.Color.fromCssColorString(color).withAlpha(alpha),
            );
        }

        // 添加飞线轨迹
        this.flyLines.add(
            new Cesium.Primitive({
                geometryInstances: new Cesium.GeometryInstance({
                    geometry: new Cesium.PolylineGeometry({
                        positions: positions,
                        width: 2.0,
                        vertexFormat: Cesium.PolylineColorAppearance.VERTEX_FORMAT,
                        colors: colors,
                        colorsPerVertex: true,
                    }),
                }),
                appearance: new Cesium.PolylineColorAppearance(),
            }),
        );

        let FlyLineMaterial = new Cesium.Material({
            fabric: {
                type: 'FlyLineMaterial',
                uniforms: {
                    color: Cesium.Color.fromCssColorString(color),
                    speed: 1.5, // flowing speed, speed > 0.0
                    headsize: 0.05, // 0.0 < headsize < 1.0
                    tailsize: 0.5, // 0.0 < tailsize < 1.0
                    widthoffset: 0.1, // 0.0 < widthoffset < 1.0
                    coresize: 0.05, // 0.0 < coresize < 1.0
                },
                source: FlyLineMaterialGLSL,
            },
        });

        let primitive = new Cesium.Primitive({
            geometryInstances: new Cesium.GeometryInstance({
                geometry: new Cesium.PolylineGeometry({
                    positions: positions,
                    width: 20.0,
                    vertexFormat: Cesium.VertexFormat.ALL,
                }),
            }),
            appearance: new Cesium.PolylineMaterialAppearance({
                material: FlyLineMaterial,
            }),
        });

        this.flyLines.add(primitive);
        
    }

    clear() {
        this.flyLines.removeAll();
        this.viewer.scene.primitives.remove(this.flyLines);
    }
    
}

export default FlyLine;