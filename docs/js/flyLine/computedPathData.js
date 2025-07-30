import * as Cesium from "cesium";

// 计算两点之间的地理距离（单位：米）
const calculateDistance = (lon1, lat1, lon2, lat2) => {
  const R = 6371000; // 地球半径（米）
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// 根据距离自动计算高度
const calculateAutoHeight = (distance) => {
  // // 距离范围（米）和对应的高度系数
  // const distanceRanges = [
  //   { min: 0, max: 10000, factor: 0.2 },      // 0-10km: 距离的12%
  //   { min: 10000, max: 50000, factor: 0.18 }, // 10-50km: 距离的10%
  //   { min: 50000, max: 100000, factor: 0.16 }, // 50-100km: 距离的8%
  //   { min: 100000, max: 500000, factor: 0.14 }, // 100-500km: 距离的6%
  //   { min: 500000, max: Infinity, factor: 0.12 } // >500km: 距离的4%
  // ];

  // // 找到对应的距离范围
  // const range = distanceRanges.find(r => distance >= r.min && distance < r.max);
  // const factor = range ? range.factor : 0.12;

  // // 计算高度，并设置最小和最大限制
  // let height = distance * factor;
  // const minHeight = 100;   // 最小高度100米
  // const maxHeight = 100000; // 最大高度100公里

  // return Math.max(minHeight, Math.min(maxHeight, height));
  return distance * 0.3;
};

// 贝赛尔曲线算法
// 参数：
// anchorpoints: [{ x: 116.30, y: 39.60 }, { x: 37.50, y: 40.25 }, { x: 39.51, y: 36.25 }]
const CreateBezierPoints = (anchorpoints, pointsAmount) => {
  let points = [];
  for (let i = 0; i < pointsAmount; i++) {
    let point = MultiPointBezier(anchorpoints, i / (pointsAmount - 1));
    points.push([point.x, point.y]);
  }
  return points;
};

// 生成贝塞尔曲线
const getBSR = (pointStart, pointEnd, point3) => {
  let ps = [
    { x: pointStart[0], y: pointStart[1] },
    { x: pointEnd[0], y: pointEnd[1] },
    { x: point3[0], y: point3[1] },
  ];
  // 100 每条线由100个点组成
  let guijipoints = CreateBezierPoints(ps, 100);
  return guijipoints;
};

const MultiPointBezier = (points, t) => {
  let len = points.length;
  let x = 0,
    y = 0;
  let erxiangshi = function (start, end) {
    let cs = 1,
      bcs = 1;
    while (end > 0) {
      cs *= start;
      bcs *= end;
      start--;
      end--;
    }
    return cs / bcs;
  };
  for (let i = 0; i < len; i++) {
    let point = points[i];
    x +=
      point.x *
      Math.pow(1 - t, len - 1 - i) *
      Math.pow(t, i) *
      erxiangshi(len - 1, i);
    y +=
      point.y *
      Math.pow(1 - t, len - 1 - i) *
      Math.pow(t, i) *
      erxiangshi(len - 1, i);
  }
  return { x: x, y: y };
};

const getBSRPoints = (
  x1,
  y1,
  x2,
  y2,
  h,
) => {
  let pointStart = [x1, 0];
  let pointEnd = [(x2 + x1) / 2, h];
  let point3 = [x2, 0];
  let arr = getBSR(pointStart, pointEnd, point3);
  let arr3d = [];
  for (let i = 0; i < arr.length; i++) {
    let y = ((y2 - y1) * (arr[i][0] - x1)) / (x2 - x1) + y1;
    arr3d.push([arr[i][0], y, arr[i][1]]);
  }
  return arr3d;
};

// 将数据转换为cesium polyline positions格式
const getBSRxyz = (
  x1,
  y1,
  x2,
  y2,
  h,
) => {
  let arr3d = getBSRPoints(x1, y1, x2, y2, h);
  let arrAll = [];
  for (let ite of arr3d) {
    arrAll.push(ite[0]);
    arrAll.push(ite[1]);
    arrAll.push(ite[2]);
  }
  return Cesium.Cartesian3.fromDegreesArrayHeights(arrAll);
};

export const computedPathData = (
  pointStart,
  pointEnd,
  h
) => {
  let finalHeight = h;
  // 如果没有提供高度，则自动计算
  if (finalHeight === undefined) {
    const distance = calculateDistance(pointStart[0], pointStart[1], pointEnd[0], pointEnd[1]);
    finalHeight = calculateAutoHeight(distance);
    console.log("finalHeight", distance, finalHeight);
  }
  
  let pathData = getBSRxyz(pointStart[0], pointStart[1], pointEnd[0], pointEnd[1], finalHeight);
  return pathData;
};