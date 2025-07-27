import * as Cesium from 'cesium'

/**基于本地的ENU坐标系的偏移，也就是垂直于地表向上为Z，东为X，北为Y
 * @param tileset Cesium3DTileset
 * @param dx x轴偏移量。单位：米
 * @param dy y轴偏移量。单位：米
 * @param dz z轴偏移量。单位：米
 * @param originCenter 平移的中心点。默认是tileset的包围球中心
 * @param originMatrix 平移前的模型矩阵。默认是tileset的模型矩阵
 */
export function translate(tileset, dx, dy, dz, originCenter, originMatrix) {
  if (dx === 0 && dy === 0 && dz === 0) return;
  // 对于3DTileset，我们需要的结果是一个模型矩阵，那么平移就是计算一个世界坐标下的平移矩阵。
  // 获取中心点
  const origin = originCenter ?? tileset.boundingSphere.center;
  // 以该点建立ENU坐标系
  const toWorldMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(origin);
  // 该坐标系下平移后的位置
  const translatePosition = new Cesium.Cartesian3(dx, dy, dz);
  // 获取平移后位置的世界坐标
  const worldPosition = Cesium.Matrix4.multiplyByPoint(toWorldMatrix, translatePosition, new Cesium.Cartesian3());
  // 计算世界坐标下的各个平移量
  const offset = Cesium.Cartesian3.subtract(worldPosition, origin, new Cesium.Cartesian3());
  // 从世界坐标下的平移量计算世界坐标的平移矩阵
  const translateMatrix = Cesium.Matrix4.fromTranslation(offset);
  // 应用平移矩阵。这里应该与原本的模型矩阵点乘，而不是直接赋值
  tileset.modelMatrix = Cesium.Matrix4.multiply(translateMatrix, originMatrix ?? tileset.modelMatrix, new Cesium.Matrix4());
}

/**基于本地的ENU坐标系的缩放，也就是垂直于地表向上为Z，东为X，北为Y
 * @param tileset Cesium3DTileset
 * @param sx x轴缩放倍数
 * @param sy y轴缩放倍数
 * @param sz z轴缩放倍数
 * @param originCenter 缩放的中心点。默认是tileset的包围球中心
 * @param originMatrix 缩放前的模型矩阵。默认是tileset的模型矩阵
 */
export function scale(tileset, sx, sy, sz, originCenter, originMatrix) {
  if (sx <= 0 || sy <= 0 || sz <= 0) throw Error("缩放倍数必须大于0");
  if (sx === 1 && sy === 1 && sz === 1) return;
  // 具体步骤是将3DTileset先转为ENU坐标系，再在ENU坐标系下计算缩放后的结果，再转回世界坐标系。一个步骤代表一个矩阵
  // 获取中心点。
  const origin = originCenter ?? tileset.boundingSphere.center;
  // 以该点建立ENU坐标系
  const toWorldMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(origin);
  // 获取ENU矩阵的逆矩阵。也就是可以将世界坐标重新转为ENU坐标系的矩阵
  const toLocalMatrix = Cesium.Matrix4.inverse(toWorldMatrix, new Cesium.Matrix4());
  // 计算缩放矩阵
  const scaleMatrix = Cesium.Matrix4.fromScale(new Cesium.Cartesian3(sx, sy, sz));
  // ENU坐标系下的结果矩阵
  const localResultMatrix = Cesium.Matrix4.multiply(scaleMatrix, toLocalMatrix, new Cesium.Matrix4());
  // 世界坐标系下的结果矩阵
  const worldResultMatrix = Cesium.Matrix4.multiply(toWorldMatrix, localResultMatrix, new Cesium.Matrix4());
  // 应用结果
  tileset.modelMatrix = Cesium.Matrix4.multiply(worldResultMatrix, originMatrix ?? tileset.modelMatrix, new Cesium.Matrix4());
}


/**基于本地的ENU坐标系的旋转，也就是垂直于地表向上为Z，东为X，北为Y
 * @param tileset Cesium3DTileset
 * @param rx 绕X轴旋转的角度。单位：度
 * @param ry 绕Y轴旋转的角度。单位：度
 * @param rz 绕Z轴旋转的角度。单位：度
 * @param originCenter 旋转的中心点。默认是tileset的包围球中心
 * @param originMatrix 旋转前的模型矩阵。默认是tileset的模型矩阵
 */
export function rotate(tileset, rx, ry, rz, originCenter, originMatrix) {
  if (rx === 0 && ry === 0 && rz === 0) return;
  // 获取中心点。
  const origin = originCenter ?? tileset.boundingSphere.center;
  // 以该点建立ENU坐标系
  const toWorldMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(origin);
  // 获取ENU矩阵的逆矩阵。也就是可以将世界坐标重新转为ENU坐标系的矩阵
  const toLocalMatrix = Cesium.Matrix4.inverse(toWorldMatrix, new Cesium.Matrix4());
  // 计算旋转矩阵
  const rotateMatrix = Cesium.Matrix4.clone(Cesium.Matrix4.IDENTITY);
  if (rx !== 0) {
    const rotateXMatrix = Cesium.Matrix4.fromRotation(Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(rx)));
    Cesium.Matrix4.multiply(rotateXMatrix, rotateMatrix, rotateMatrix);
  }
  if (ry !== 0) {
    const rotateYMatrix = Cesium.Matrix4.fromRotation(Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(ry)));
    Cesium.Matrix4.multiply(rotateYMatrix, rotateMatrix, rotateMatrix);
  }
  if (rz !== 0) {
    const rotateZMatrix = Cesium.Matrix4.fromRotation(Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(rz)));
    Cesium.Matrix4.multiply(rotateZMatrix, rotateMatrix, rotateMatrix);
  }
  // ENU坐标系下的结果矩阵
  const localResultMatrix = Cesium.Matrix4.multiply(rotateMatrix, toLocalMatrix, new Cesium.Matrix4());
  // 世界坐标系下的结果矩阵
  const worldResultMatrix = Cesium.Matrix4.multiply(toWorldMatrix, localResultMatrix, new Cesium.Matrix4());
  // 应用结果
  tileset.modelMatrix = Cesium.Matrix4.multiply(worldResultMatrix, originMatrix ?? tileset.modelMatrix, new Cesium.Matrix4());
}

/**移动模型到指定的位置
 * @param tileset Cesium3DTileset
 * @param longitude 经度
 * @param latitude 纬度
 * @param height 高度
 * @param originCenter 平移的中心点。默认是tileset的包围球中心
 * @param originMatrix 平移前的模型矩阵。默认是tileset的模型矩阵
 * @returns {Matrix4} 返回一个变换矩阵，将模型从原始位置移动到目标位置
 */
export function moveModel(tileset, longitude, latitude, height, originCenter, originMatrix) {
    //计算世界坐标系中的目标位置offset
    var cartographic = new Cesium.Cartographic.fromCartesian(
      originCenter ?? tileset.boundingSphere.center,
    );
    var offset = Cesium.Cartesian3.fromDegrees(longitude, latitude, cartographic.height + height);
  
    //将模型位移至地心
    const origin = originCenter ?? tileset.boundingSphere.center;
    originMatrix = originMatrix ?? tileset.modelMatrix;//模型的初始变换矩阵
    const backToEarthCenter = new Cesium.Cartesian3(-origin.x, -origin.y, -origin.z);//初始位置到地心的位移向量
    let backToEarthCenterMatrix = Cesium.Matrix4.fromTranslation(backToEarthCenter);//初始位置到地心的变换矩阵
    Cesium.Matrix4.multiply(backToEarthCenterMatrix, originMatrix, backToEarthCenterMatrix);//移动模型到地心的矩阵
  
    // 旋转模型使得Z轴与世界坐标Z轴重合
    let arrowX = new Cesium.Cartesian3(1, 0, 0);
    let arrowZ = new Cesium.Cartesian3(0, 0, 1);
    let angleToXZ = Cesium.Cartesian3.angleBetween(arrowX, new Cesium.Cartesian3(origin.x, origin.y, 0));//局部Z轴在世界坐标系XY平面上投影到X轴角度，即绕Z顺时针旋转这个角度可以到XZ平面上
    let angleToZ = Cesium.Cartesian3.angleBetween(origin, arrowZ);//然后绕Y轴顺时针旋转此角度可使得Z轴与世界坐标系Z轴重合
    const rotationAngleToXZ = Cesium.Matrix3.fromRotationZ((origin.y > 0 ? -1 : +1) * angleToXZ);//绕Z轴旋转的Matrix3矩阵，正角度逆时针旋转
    const rotationAngleToZ = Cesium.Matrix3.fromRotationY(-angleToZ);//绕Y轴旋转的Matrix3矩阵，负角度顺时针旋转
    let rotationAngleToZMatrix = Cesium.Matrix3.multiply(rotationAngleToZ, rotationAngleToXZ, new Cesium.Matrix3);//连续旋转的Matrix3矩阵，即先绕Z轴旋转，后绕Y旋转的矩阵。
    rotationAngleToZMatrix = Cesium.Matrix4.fromRotationTranslation(rotationAngleToZMatrix);//连续旋转的Matrix4矩阵
    Cesium.Matrix4.multiply(rotationAngleToZMatrix, backToEarthCenterMatrix, rotationAngleToZMatrix);//将移动至地心模型，旋转至Z轴重合的矩阵
  
    // 旋转模型使得X，Y轴与世界坐标X，Y轴重合
    const rotationZ = Cesium.Matrix3.fromRotationZ(-Math.PI / 2); // 绕Z轴旋转90°的Matrix3变换矩阵
    let rotationMatrix = Cesium.Matrix4.fromRotationTranslation(rotationZ); // 绕Z轴旋转90°的Matrix4变换矩阵
    Cesium.Matrix4.multiply(rotationMatrix, rotationAngleToZMatrix, rotationMatrix);//将移动至地心模型的物体坐标系，旋转到与世界坐标系重合的矩阵
  
    //在地心位置，旋转物体坐标系和世界坐标系重合的模型，使得与目标坐标系重合
    const offsetToWorldMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(offset);//获取到以目标位置为原点,的eastNorthUp局部坐标系的变换矩阵
    const backToEarthCenterOffset = new Cesium.Cartesian3(-offset.x, -offset.y, -offset.z);//目标位置到地心的位移向量
    let backToEarthCenterMatrixOffset = Cesium.Matrix4.fromTranslation(backToEarthCenterOffset);//目标位置到地心的变换矩阵
    Cesium.Matrix4.multiply(backToEarthCenterMatrixOffset, offsetToWorldMatrix, backToEarthCenterMatrixOffset);//获得从世界坐标系旋转至目标坐标系的旋转矩阵（只有旋转，没有位移）
    Cesium.Matrix4.multiply(backToEarthCenterMatrixOffset, rotationMatrix, backToEarthCenterMatrixOffset);//将移动至地心模型的物体坐标系，旋转到与目标坐标系重合的矩阵（完成模型的最终旋转，没有位移）
  
    //移动到目标位置
    const backToOriginMatrix = Cesium.Matrix4.fromTranslation(offset);//地心到目标位置位移向量
    const lastMatrix = Cesium.Matrix4.multiply(backToOriginMatrix, backToEarthCenterMatrixOffset, new Cesium.Matrix4());//最终矩阵，即将地心位置的模型移动到目标位置（完成模型的最终旋转，最终位移）
    return lastMatrix; //返回最终变换矩阵
  }