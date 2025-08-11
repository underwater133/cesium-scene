import * as Cesium from 'cesium';
class Roaming {
    constructor(viewer, options) {
        this.viewer = viewer;
        this.path = [];
        this.loop = options?.loop || false;
        this.multiplier = options?.multiplier || 1;
        this.entity = null;
        this.exection = null;
    }

    cameraRoaming(path, duration, headingPitchRangeList) {
        this.clear();
        this.path = Cesium.Cartesian3.fromDegreesArrayHeights(path.flat());
        this._initClock(duration);
        const { positionProperty, headingProperty, pitchProperty, rangeProperty } = this._computeRoamingPathAndHprProperty(duration, headingPitchRangeList);
        this.entity = this.viewer.entities.add({
            id: 'roaming-entity',
            availability: new Cesium.TimeIntervalCollection([
                new Cesium.TimeInterval({
                    start: this.viewer.clock.startTime,
                    stop: this.viewer.clock.stopTime
                })
            ]),
            position: positionProperty,
            orientation: new Cesium.VelocityOrientationProperty(positionProperty),
        })

        this.viewer.trackedEntity = this.entity;

        this.exection = () => {
            if (this.entity) {
                console.log(this.viewer.orientation)
                var center = this.entity.position.getValue(this.viewer.clock.currentTime);
                const heading = headingProperty.getValue(this.viewer.clock.currentTime);
                const pitch = pitchProperty.getValue(this.viewer.clock.currentTime);
                const range = rangeProperty.getValue(this.viewer.clock.currentTime);
                if (center) this.viewer.camera.lookAt(center, {
                    heading: Cesium.Math.toRadians(heading),
                    pitch: Cesium.Math.toRadians(pitch),
                    range: range
                });
            } else {
                this.viewer.scene.preUpdate.removeEventListener(this.exection);
            }
        }
        this.viewer.scene.preUpdate.addEventListener(this.exection);

        this.start();
    }

    _initClock(duration) {
        const clock = this.viewer.clock;
        clock.startTime = Cesium.JulianDate.now();
        clock.stopTime = Cesium.JulianDate.addSeconds(clock.startTime, duration, new Cesium.JulianDate());
        clock.currentTime = clock.startTime;
        clock.clockRange = this.loop ? Cesium.ClockRange.LOOP_STOP : Cesium.ClockRange.UNBOUNDED;
        clock.multiplier = this.multiplier;
    }

    _computeRoamingPathAndHprProperty(duration, headingPitchRangeList) {
        const positionProperty = new Cesium.SampledPositionProperty();
        const headingProperty = new Cesium.SampledProperty(Number);
        const pitchProperty = new Cesium.SampledProperty(Number);
        const rangeProperty = new Cesium.SampledProperty(Number);
        const startTime = this.viewer.clock.startTime;
        const stopTime = this.viewer.clock.stopTime;
        const path = this.path;
        let distance = 0;
        for (let i = 0; i < path.length - 1; i++) {
            const position1 = path[i];
            const position2 = path[i + 1];
            distance += Cesium.Cartesian3.distance(position1, position2);
        }
        positionProperty.addSample(startTime, path[0]);
        headingProperty.addSample(startTime, headingPitchRangeList[0][0]);
        pitchProperty.addSample(startTime, headingPitchRangeList[0][1]);
        rangeProperty.addSample(startTime, headingPitchRangeList[0][2]);
        let time = startTime;
        for (let i = 0; i < path.length - 1; i++) {
            const position1 = path[i];
            const position2 = path[i + 1];
            const part = Cesium.Cartesian3.distance(position1, position2);
            time = Cesium.JulianDate.addSeconds(time, (part / distance) * duration, new Cesium.JulianDate());
            if (i === path.length - 2) time = stopTime;
            positionProperty.addSample(time, position2);
            headingProperty.addSample(time, headingPitchRangeList[i + 1][0]);
            pitchProperty.addSample(time, headingPitchRangeList[i + 1][1]);
            rangeProperty.addSample(time, headingPitchRangeList[i + 1][2]);
        }
        return {
            positionProperty,
            headingProperty,
            pitchProperty,
            rangeProperty
        };
    }

    start() {
        const currentTime = this.viewer.clock.currentTime;
        const startTime = this.viewer.clock.startTime;
        const stopTime = this.viewer.clock.stopTime;
        if (Cesium.JulianDate.lessThanOrEquals(currentTime, startTime)
            || Cesium.JulianDate.greaterThanOrEquals(currentTime, stopTime)) {
            this.viewer.clock.currentTime = startTime;
        }
        this.viewer.clock.shouldAnimate = true;
    }

    pause() {
        this.viewer.clock.shouldAnimate = false;
    }

    clear() {
        if (this.entity) {
            this.viewer.entities.remove(this.entity);
            this.entity = null;
            this.path = [];
            this.viewer.trackedEntity = undefined;
            this.viewer.scene.preUpdate.removeEventListener(this.exection);
            this.pause();
        }
    }
}

export default Roaming;