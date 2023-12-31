var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
import { LineAnimateType, LockState } from './model';
import { getLineRect, getSplitAnchor } from '../diagrams';
import { Direction, inheritanceProps } from '../data';
import { calcRotate, distance, facePoint, rotatePoint, scalePoint, translatePoint, TwoWay, } from '../point';
import { calcCenter, calcRightBottom, calcRelativePoint, calcRelativeRect, rectInRect, scaleRect, translateRect, } from '../rect';
import { globalStore } from '../store';
import { calcTextLines, calcTextDrawRect, calcTextRect } from './text';
import { deepClone } from '../utils/clone';
import { renderFromArrow, renderToArrow } from './arrow';
import { Gradient, PenType } from '@meta2d/core';
import { rgba } from '../utils';
/**
 * ancestor 是否是 pen 的祖先
 * @param pen 当前画笔
 * @param ancestor 祖先画笔
 */
export function isAncestor(pen, ancestor) {
    if (!pen || !ancestor) {
        return false;
    }
    var parent = getParent(pen);
    while (parent) {
        if (parent.id === ancestor.id) {
            return true;
        }
        parent = getParent(parent);
    }
    return false;
}
export function getParent(pen, root) {
    if (!pen || !pen.parentId || !pen.calculative) {
        return undefined;
    }
    var store = pen.calculative.canvas.store;
    var parent = store.pens[pen.parentId];
    if (!root) {
        return parent;
    }
    return getParent(parent, root) || parent;
}
export function getAllChildren(pen, store) {
    if (!pen || !pen.children) {
        return [];
    }
    var children = [];
    pen.children.forEach(function (id) {
        var child = store.pens[id];
        if (child) {
            children.push(child);
            children.push.apply(children, __spreadArray([], __read(getAllChildren(child, store)), false));
        }
    });
    return children;
}
function drawBkLinearGradient(ctx, pen) {
    var _a = pen.calculative, worldRect = _a.worldRect, gradientFromColor = _a.gradientFromColor, gradientToColor = _a.gradientToColor, gradientAngle = _a.gradientAngle;
    return linearGradient(ctx, worldRect, gradientFromColor, gradientToColor, gradientAngle);
}
/**
 * 避免副作用，把创建好后的径向渐变对象返回出来
 * @param ctx 画布绘制对象
 * @param pen 当前画笔
 * @returns 径向渐变
 */
function drawBkRadialGradient(ctx, pen) {
    var _a = pen.calculative, worldRect = _a.worldRect, gradientFromColor = _a.gradientFromColor, gradientToColor = _a.gradientToColor, gradientRadius = _a.gradientRadius;
    if (!gradientFromColor || !gradientToColor) {
        return;
    }
    var width = worldRect.width, height = worldRect.height, center = worldRect.center;
    var centerX = center.x, centerY = center.y;
    var r = width;
    if (r < height) {
        r = height;
    }
    r *= 0.5;
    var grd = ctx.createRadialGradient(centerX, centerY, r * (gradientRadius || 0), centerX, centerY, r);
    grd.addColorStop(0, gradientFromColor);
    grd.addColorStop(1, gradientToColor);
    return grd;
}
function getLinearGradientPoints(x1, y1, x2, y2, r) {
    var slantAngle = 0;
    slantAngle = Math.PI / 2 - Math.atan2(y2 - y1, x2 - x1);
    var originX = (x1 + x2) / 2;
    var originY = (y1 + y2) / 2;
    var perpX1 = originX + r * Math.sin((90 * Math.PI) / 180 - slantAngle);
    var perpY1 = originY + r * -Math.cos((90 * Math.PI) / 180 - slantAngle);
    var perpX2 = originX + r * Math.sin((270 * Math.PI) / 180 - slantAngle);
    var perpY2 = originY + r * -Math.cos((270 * Math.PI) / 180 - slantAngle);
    return [perpX1, perpY1, perpX2, perpY2];
}
function getBkRadialGradient(ctx, pen) {
    var _a = pen.calculative, worldRect = _a.worldRect, gradientColors = _a.gradientColors, gradientRadius = _a.gradientRadius;
    if (!gradientColors) {
        return;
    }
    var width = worldRect.width, height = worldRect.height, center = worldRect.center;
    var centerX = center.x, centerY = center.y;
    var r = width;
    if (r < height) {
        r = height;
    }
    r *= 0.5;
    var colors = formatGradient(gradientColors).colors;
    var grd = ctx.createRadialGradient(centerX, centerY, r * (gradientRadius || 0), centerX, centerY, r);
    colors.forEach(function (stop) {
        grd.addColorStop(stop.i, stop.color);
    });
    return grd;
}
function getBkGradient(ctx, pen) {
    var _a = pen.calculative.worldRect, x = _a.x, y = _a.y, ex = _a.ex, width = _a.width, height = _a.height, center = _a.center;
    var points = [
        { x: ex, y: y + height / 2 },
        { x: x, y: y + height / 2 },
    ];
    var _b = formatGradient(pen.calculative.gradientColors), angle = _b.angle, colors = _b.colors;
    var r = getGradientR(angle, width, height);
    points.forEach(function (point) {
        rotatePoint(point, angle, center);
    });
    return getLinearGradient(ctx, points, colors, r);
}
function getTextRadialGradient(ctx, pen) {
    var _a = pen.calculative, worldRect = _a.worldRect, textGradientColors = _a.textGradientColors;
    if (!textGradientColors) {
        return;
    }
    var width = worldRect.width, height = worldRect.height, center = worldRect.center;
    var centerX = center.x, centerY = center.y;
    var r = width;
    if (r < height) {
        r = height;
    }
    r *= 0.5;
    var colors = formatGradient(textGradientColors).colors;
    var grd = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, r);
    colors.forEach(function (stop) {
        grd.addColorStop(stop.i, stop.color);
    });
    return grd;
}
function getTextGradient(ctx, pen) {
    var _a = pen.calculative.worldRect, x = _a.x, y = _a.y, ex = _a.ex, width = _a.width, height = _a.height, center = _a.center;
    var points = [
        { x: ex, y: y + height / 2 },
        { x: x, y: y + height / 2 },
    ];
    var _b = formatGradient(pen.calculative.textGradientColors), angle = _b.angle, colors = _b.colors;
    var r = getGradientR(angle, width, height);
    points.forEach(function (point) {
        rotatePoint(point, angle, center);
    });
    return getLinearGradient(ctx, points, colors, r);
}
function getGradientR(angle, width, height) {
    var dividAngle = (Math.atan(height / width) / Math.PI) * 180;
    var calculateAngle = (angle - 90) % 360;
    var r = 0;
    if ((calculateAngle > dividAngle && calculateAngle < 180 - dividAngle) ||
        (calculateAngle > 180 + dividAngle && calculateAngle < 360 - dividAngle) ||
        calculateAngle < 0) {
        //根据高计算
        if (calculateAngle > 270) {
            calculateAngle = 360 - calculateAngle;
        }
        else if (calculateAngle > 180) {
            calculateAngle = calculateAngle - 180;
        }
        else if (calculateAngle > 90) {
            calculateAngle = 180 - calculateAngle;
        }
        r = Math.abs(height / Math.sin((calculateAngle / 180) * Math.PI) / 2);
    }
    else {
        //根据宽计算
        if (calculateAngle > 270) {
            calculateAngle = 360 - calculateAngle;
        }
        else if (calculateAngle > 180) {
            calculateAngle = calculateAngle - 180;
        }
        else if (calculateAngle > 90) {
            calculateAngle = 180 - calculateAngle;
        }
        r = Math.abs(width / Math.cos((calculateAngle / 180) * Math.PI) / 2);
    }
    return r;
}
function formatGradient(color) {
    if (typeof color == 'string' && color.startsWith('linear-gradient')) {
        var arr = color.slice(16, -2).split('deg,');
        if (arr.length > 1) {
            var _arr = arr[1].split('%,');
            var colors_1 = [];
            _arr.forEach(function (stap) {
                if (/rgba?/.test(stap)) {
                    var _arr_1 = stap.split(') ');
                    colors_1.push({
                        color: rgbaToHex(_arr_1[0] + ')'),
                        i: parseFloat(_arr_1[1]) / 100,
                    });
                }
                else {
                    var _arr_2 = stap.split(' ');
                    if (_arr_2.length > 2) {
                        colors_1.push({
                            color: _arr_2[1],
                            i: parseFloat(_arr_2[2]) / 100,
                        });
                    }
                    else {
                        colors_1.push({
                            color: _arr_2[0],
                            i: parseFloat(_arr_2[1]) / 100,
                        });
                    }
                }
            });
            return {
                angle: parseFloat(arr[0]),
                colors: colors_1,
            };
        }
        else {
            return {
                angle: parseFloat(arr[0]),
                colors: [],
            };
        }
    }
    else {
        return {
            angle: 0,
            colors: [],
        };
    }
}
function rgbaToHex(value) {
    if (/rgba?/.test(value)) {
        var array = value.split(',');
        //不符合rgb或rgb规则直接return
        if (array.length < 3)
            return '';
        value = '#';
        for (var i = 0, color = void 0; (color = array[i++]);) {
            if (i < 4) {
                //前三位转换成16进制
                color = parseInt(color.replace(/[^\d]/gi, ''), 10).toString(16);
                value += color.length == 1 ? '0' + color : color;
            }
            else {
                //rgba的透明度转换成16进制
                color = color.replace(')', '');
                var colorA = parseInt(color * 255 + '');
                var colorAHex = colorA.toString(16);
                colorAHex = colorAHex.length === 2 ? colorAHex : '0' + colorAHex;
                value += colorAHex;
            }
        }
        value = value.toUpperCase();
    }
    return value;
}
function getLineGradient(ctx, pen) {
    var _a = pen.calculative.worldRect, x = _a.x, y = _a.y, ex = _a.ex, width = _a.width, height = _a.height, center = _a.center;
    var points = [
        { x: ex, y: y + height / 2 },
        { x: x, y: y + height / 2 },
    ];
    var _b = formatGradient(pen.calculative.lineGradientColors), angle = _b.angle, colors = _b.colors;
    var r = getGradientR(angle, width, height);
    points.forEach(function (point) {
        rotatePoint(point, angle, center);
    });
    return getLinearGradient(ctx, points, colors, r);
}
function getLinearGradient(ctx, points, colors, radius) {
    var arr = getLinearGradientPoints(points[0].x, points[0].y, points[1].x, points[1].y, radius);
    var gradient = ctx.createLinearGradient(arr[0], arr[1], arr[2], arr[3]);
    colors.forEach(function (stop) {
        gradient.addColorStop(stop.i, stop.color);
    });
    return gradient;
}
function drawLinearGradientLine(ctx, pen, points) {
    var colors = [];
    if (pen.calculative.gradientColorStop) {
        colors = pen.calculative.gradientColorStop;
    }
    else {
        colors = formatGradient(pen.calculative.lineGradientColors).colors;
        pen.calculative.gradientColorStop = colors;
    }
    ctx.strokeStyle = getLinearGradient(ctx, points, colors, pen.calculative.lineWidth / 2);
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    ctx.lineTo(points[1].x, points[1].y);
    ctx.stroke();
}
function ctxDrawLinearGradientPath(ctx, pen) {
    var anchors = pen.calculative.worldAnchors;
    var smoothLenth = pen.calculative.lineWidth * (pen.calculative.gradientSmooth || 0);
    for (var i = 0; i < anchors.length - 1; i++) {
        if ((pen.lineName === 'curve' || pen.lineName === 'mind') &&
            anchors[i].curvePoints) {
            if (i > 0) {
                var lastCurvePoints = anchors[i - 1].curvePoints;
                if (lastCurvePoints) {
                    //上一个存在锚点
                    smoothTransition(ctx, pen, smoothLenth, lastCurvePoints[lastCurvePoints.length - 1], anchors[i], anchors[i].curvePoints[0]);
                }
                else {
                    smoothTransition(ctx, pen, smoothLenth, anchors[i - 1], anchors[i], anchors[i].curvePoints[0]);
                }
                //获取当前相对于0的位置
                var next = getSmoothAdjacent(smoothLenth, anchors[i], anchors[i].curvePoints[0]);
                drawLinearGradientLine(ctx, pen, [next, anchors[i].curvePoints[1]]);
            }
            else {
                drawLinearGradientLine(ctx, pen, [
                    anchors[i],
                    anchors[i].curvePoints[0],
                ]);
                drawLinearGradientLine(ctx, pen, [
                    anchors[i].curvePoints[0],
                    anchors[i].curvePoints[1],
                ]);
            }
            var len = anchors[i].curvePoints.length - 1;
            for (var j = 1; j < len; j++) {
                drawLinearGradientLine(ctx, pen, [
                    anchors[i].curvePoints[j],
                    anchors[i].curvePoints[j + 1],
                ]);
            }
            var last = getSmoothAdjacent(smoothLenth, anchors[i + 1], anchors[i].curvePoints[len]);
            drawLinearGradientLine(ctx, pen, [anchors[i].curvePoints[len], last]);
        }
        else {
            var _next = anchors[i];
            var _last = anchors[i + 1];
            if (i > 0 && i < anchors.length - 1) {
                //有突兀的地方
                var lastCurvePoints = anchors[i - 1].curvePoints;
                if (lastCurvePoints) {
                    smoothTransition(ctx, pen, smoothLenth, lastCurvePoints[lastCurvePoints.length - 1], anchors[i], anchors[i + 1]);
                }
                else {
                    smoothTransition(ctx, pen, smoothLenth, anchors[i - 1], anchors[i], anchors[i + 1]);
                }
            }
            if (i > 0 && i < anchors.length - 1) {
                _next = getSmoothAdjacent(smoothLenth, anchors[i], anchors[i + 1]);
            }
            if (i < anchors.length - 2) {
                _last = getSmoothAdjacent(smoothLenth, anchors[i + 1], anchors[i]);
            }
            drawLinearGradientLine(ctx, pen, [_next, _last]);
        }
    }
}
function getSmoothAdjacent(smoothLenth, p1, p2) {
    var nexLength = Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
    if (nexLength === 0) {
        return {
            x: p1.x,
            y: p1.y,
        };
    }
    if (smoothLenth < nexLength) {
        return {
            x: p1.x + ((p2.x - p1.x) * smoothLenth) / nexLength,
            y: p1.y + ((p2.y - p1.y) * smoothLenth) / nexLength,
        };
    }
    else {
        return {
            x: p1.x + (p2.x - p1.x) / nexLength / 2,
            y: p1.y + (p2.y - p1.y) / nexLength / 2,
        };
    }
}
function smoothTransition(ctx, pen, smoothLenth, p1, p2, p3) {
    var last = getSmoothAdjacent(smoothLenth, p2, p1);
    var next = getSmoothAdjacent(smoothLenth, p2, p3);
    var contrlPoint = { x: p2.x, y: p2.y };
    var points = getBezierPoints(100, last, contrlPoint, next);
    for (var k = 0; k < points.length - 1; k++) {
        drawLinearGradientLine(ctx, pen, [
            {
                x: points[k].x,
                y: points[k].y,
            },
            {
                x: points[k + 1].x,
                y: points[k + 1].y,
            },
        ]);
    }
}
function smoothAnimateTransition(ctx, smoothLenth, p2, p3) {
    var next = getSmoothAdjacent(smoothLenth, p2, p3);
    var contrlPoint = { x: p2.x, y: p2.y };
    ctx.quadraticCurveTo(contrlPoint.x, contrlPoint.y, next.x, next.y);
}
export function getGradientAnimatePath(pen) {
    var anchors = pen.calculative.worldAnchors;
    var smoothLenth = pen.calculative.lineWidth * (pen.calculative.gradientSmooth || 0);
    //只创建一次
    var _path = new Path2D();
    for (var i = 0; i < anchors.length - 1; i++) {
        var _next = anchors[i];
        var _last = anchors[i + 1];
        if (i == 0) {
            _path.moveTo(anchors[i].x, anchors[i].y);
        }
        if (i > 0 && i < anchors.length - 1) {
            //有突兀的地方
            var lastCurvePoints = anchors[i - 1].curvePoints;
            // const path = new Path2D();
            if (lastCurvePoints) {
                smoothAnimateTransition(_path, smoothLenth, anchors[i], anchors[i + 1]);
            }
            else {
                smoothAnimateTransition(_path, smoothLenth, anchors[i], anchors[i + 1]);
            }
        }
        if (i > 0 && i < anchors.length - 1) {
            _next = getSmoothAdjacent(smoothLenth, anchors[i], anchors[i + 1]);
        }
        if (i < anchors.length - 2) {
            _last = getSmoothAdjacent(smoothLenth, anchors[i + 1], anchors[i]);
        }
        _path.lineTo(_last.x, _last.y);
    }
    return _path;
}
function getAngle(p1, p2, p3) {
    var a = { x: 0, y: 0 }, b = { x: 0, y: 0 };
    a.x = p1.x - p2.x;
    a.y = p1.y - p2.y;
    b.x = p3.x - p2.x;
    b.y = p3.y - p2.y;
    return ((Math.acos((a.x * b.x + a.y * b.y) /
        (Math.sqrt(a.x * a.x + a.y * a.y) * Math.sqrt(b.x * b.x + b.y * b.y))) /
        Math.PI) *
        180);
}
function getBezierPoints(num, p1, p2, p3, p4) {
    if (num === void 0) { num = 100; }
    var func = null;
    var points = [];
    if (!p3 && !p4) {
        func = oneBezier;
    }
    else if (p3 && !p4) {
        func = twoBezier;
    }
    else if (p3 && p4) {
        func = threeBezier;
    }
    for (var i = 0; i < num; i++) {
        points.push(func(i / num, p1, p2, p3, p4));
    }
    if (p4) {
        points.push(p4);
    }
    else if (p3) {
        points.push(p3);
    }
    return points;
}
/**
 * @desc 一阶贝塞尔
 * @param  t 当前百分比
 * @param  p1 起点坐标
 * @param  p2 终点坐标
 */
function oneBezier(t, p1, p2) {
    var x1 = p1.x, y1 = p1.y;
    var x2 = p2.x, y2 = p2.y;
    var x = x1 + (x2 - x1) * t;
    var y = y1 + (y2 - y1) * t;
    return { x: x, y: y };
}
/**
 * @desc 二阶贝塞尔
 * @param  t 当前百分比
 * @param  p1 起点坐标
 * @param  p2 终点坐标
 * @param  cp 控制点
 */
function twoBezier(t, p1, cp, p2) {
    var x1 = p1.x, y1 = p1.y;
    var cx = cp.x, cy = cp.y;
    var x2 = p2.x, y2 = p2.y;
    var x = (1 - t) * (1 - t) * x1 + 2 * t * (1 - t) * cx + t * t * x2;
    var y = (1 - t) * (1 - t) * y1 + 2 * t * (1 - t) * cy + t * t * y2;
    return { x: x, y: y };
}
/**
 * @desc 三阶贝塞尔
 * @param  t 当前百分比
 * @param  p1 起点坐标
 * @param  p2 终点坐标
 * @param  cp1 控制点1
 * @param  cp2 控制点2
 */
function threeBezier(t, p1, cp1, cp2, p2) {
    var x1 = p1.x, y1 = p1.y;
    var x2 = p2.x, y2 = p2.y;
    var cx1 = cp1.x, cy1 = cp1.y;
    var cx2 = cp2.x, cy2 = cp2.y;
    var x = x1 * (1 - t) * (1 - t) * (1 - t) +
        3 * cx1 * t * (1 - t) * (1 - t) +
        3 * cx2 * t * t * (1 - t) +
        x2 * t * t * t;
    var y = y1 * (1 - t) * (1 - t) * (1 - t) +
        3 * cy1 * t * (1 - t) * (1 - t) +
        3 * cy2 * t * t * (1 - t) +
        y2 * t * t * t;
    return { x: x, y: y };
}
function strokeLinearGradient(ctx, pen) {
    var _a = pen.calculative, worldRect = _a.worldRect, lineGradientFromColor = _a.lineGradientFromColor, lineGradientToColor = _a.lineGradientToColor, lineGradientAngle = _a.lineGradientAngle;
    return linearGradient(ctx, worldRect, lineGradientFromColor, lineGradientToColor, lineGradientAngle);
}
/**
 * 避免副作用，把创建好后的线性渐变对象返回出来
 * @param ctx 画布绘制对象
 * @param worldRect 世界坐标
 * @returns 线性渐变
 */
function linearGradient(ctx, worldRect, fromColor, toColor, angle) {
    if (!fromColor || !toColor) {
        return;
    }
    var x = worldRect.x, y = worldRect.y, center = worldRect.center, ex = worldRect.ex, ey = worldRect.ey;
    var from = {
        x: x,
        y: center.y,
    };
    var to = {
        x: ex,
        y: center.y,
    };
    if (angle % 90 === 0 && angle % 180) {
        from.x = center.x;
        to.x = center.x;
        if (angle % 270) {
            from.y = y;
            to.y = ey;
        }
        else {
            from.y = ey;
            to.y = y;
        }
    }
    else if (angle) {
        rotatePoint(from, angle, worldRect.center);
        rotatePoint(to, angle, worldRect.center);
    }
    // contributor: https://github.com/sunnyguohua/meta2d
    var grd = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
    grd.addColorStop(0, fromColor);
    grd.addColorStop(1, toColor);
    return grd;
}
/**
 * 根据图片的宽高， imageRatio iconAlign 来获取图片的实际位置
 * @param pen 画笔
 */
function getImagePosition(pen) {
    var _a = pen.calculative, rect = _a.worldIconRect, iconWidth = _a.iconWidth, iconHeight = _a.iconHeight, imgNaturalWidth = _a.imgNaturalWidth, imgNaturalHeight = _a.imgNaturalHeight;
    var x = rect.x, y = rect.y, w = rect.width, h = rect.height;
    if (iconWidth) {
        w = iconWidth;
    }
    if (iconHeight) {
        h = iconHeight;
    }
    if (imgNaturalWidth && imgNaturalHeight && pen.imageRatio) {
        var scaleW = rect.width / imgNaturalWidth;
        var scaleH = rect.height / imgNaturalHeight;
        var scaleMin = Math.min(scaleW, scaleH);
        var wDivideH = imgNaturalWidth / imgNaturalHeight;
        if (iconWidth) {
            h = iconWidth / wDivideH;
        }
        else if (iconHeight) {
            w = iconHeight * wDivideH;
        }
        else {
            w = scaleMin * imgNaturalWidth;
            h = scaleMin * imgNaturalHeight;
        }
    }
    x += (rect.width - w) / 2;
    y += (rect.height - h) / 2;
    switch (pen.iconAlign) {
        case 'top':
            y = rect.y;
            break;
        case 'bottom':
            y = rect.ey - h;
            break;
        case 'left':
            x = rect.x;
            break;
        case 'right':
            x = rect.ex - w;
            break;
        case 'left-top':
            x = rect.x;
            y = rect.y;
            break;
        case 'right-top':
            x = rect.ex - w;
            y = rect.y;
            break;
        case 'left-bottom':
            x = rect.x;
            y = rect.ey - h;
            break;
        case 'right-bottom':
            x = rect.ex - w;
            y = rect.ey - h;
            break;
    }
    return {
        x: x,
        y: y,
        width: w,
        height: h,
    };
}
export function drawImage(ctx, pen) {
    var _a = getImagePosition(pen), x = _a.x, y = _a.y, width = _a.width, height = _a.height;
    var _b = pen.calculative, worldIconRect = _b.worldIconRect, iconRotate = _b.iconRotate, img = _b.img;
    if (iconRotate) {
        var _c = worldIconRect.center, centerX = _c.x, centerY = _c.y;
        ctx.translate(centerX, centerY);
        ctx.rotate((iconRotate * Math.PI) / 180);
        ctx.translate(-centerX, -centerY);
    }
    if (pen.imageRadius) {
        ctx.save();
        var wr = pen.calculative.imageRadius || 0, hr = wr;
        var _d = pen.calculative.worldRect, _x = _d.x, _y = _d.y, w = _d.width, h = _d.height, ex = _d.ex, ey = _d.ey;
        if (wr < 1) {
            wr = w * wr;
            hr = h * hr;
        }
        var r = wr < hr ? wr : hr;
        if (w < 2 * r) {
            r = w / 2;
        }
        if (h < 2 * r) {
            r = h / 2;
        }
        ctx.beginPath();
        ctx.moveTo(_x + r, _y);
        ctx.arcTo(ex, _y, ex, ey, r);
        ctx.arcTo(ex, ey, _x, ey, r);
        ctx.arcTo(_x, ey, _x, _y, r);
        ctx.arcTo(_x, _y, ex, _y, r);
        ctx.clip();
        ctx.drawImage(img, x, y, width, height);
        ctx.restore();
    }
    else {
        ctx.drawImage(img, x, y, width, height);
    }
}
/**
 * 获取文字颜色， textColor 优先其次 color
 */
export function getTextColor(pen, store) {
    var _a = pen.calculative, textColor = _a.textColor, color = _a.color;
    var data = store.data, options = store.options;
    return (textColor ||
        color ||
        data.textColor ||
        data.color ||
        options.textColor ||
        options.color);
}
function drawText(ctx, pen) {
    var _a = pen.calculative, fontStyle = _a.fontStyle, fontWeight = _a.fontWeight, fontSize = _a.fontSize, fontFamily = _a.fontFamily, lineHeight = _a.lineHeight, text = _a.text, hiddenText = _a.hiddenText, canvas = _a.canvas, textHasShadow = _a.textHasShadow, textBackground = _a.textBackground, textType = _a.textType;
    if (text == undefined || hiddenText) {
        return;
    }
    var store = canvas.store;
    ctx.save();
    if (!textHasShadow) {
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }
    var fill = undefined;
    if (pen.calculative.hover) {
        fill = pen.hoverTextColor || pen.hoverColor || store.options.hoverColor;
    }
    else if (pen.calculative.active) {
        fill = pen.activeTextColor || pen.activeColor || store.options.activeColor;
    }
    var gradient = undefined;
    if (textType === Gradient.Linear) {
        gradient = getTextGradient(ctx, pen);
    }
    else if (textType === Gradient.Radial) {
        gradient = getTextRadialGradient(ctx, pen);
    }
    ctx.fillStyle = fill || gradient || getTextColor(pen, store);
    ctx.font = getFont({
        fontStyle: fontStyle,
        fontWeight: fontWeight,
        fontFamily: fontFamily || store.options.fontFamily,
        fontSize: fontSize,
        lineHeight: lineHeight,
    });
    !pen.calculative.textDrawRect && calcTextDrawRect(ctx, pen);
    var _b = pen.calculative.textDrawRect, drawRectX = _b.x, drawRectY = _b.y, width = _b.width, height = _b.height;
    if (textBackground) {
        ctx.save();
        ctx.fillStyle = textBackground;
        ctx.fillRect(drawRectX, drawRectY, width, height);
        ctx.restore();
    }
    var y = 0.55;
    var textAlign = pen.textAlign || store.options.textAlign;
    var oneRowHeight = fontSize * lineHeight;
    pen.calculative.textLines.forEach(function (text, i) {
        var textLineWidth = pen.calculative.textLineWidths[i];
        var x = 0;
        if (textAlign === 'center') {
            x = (width - textLineWidth) / 2;
        }
        else if (textAlign === 'right') {
            x = width - textLineWidth;
        }
        // 下划线
        ctx.fillText(text, drawRectX + x, drawRectY + (i + y) * oneRowHeight);
        var textDecorationColor = pen.textDecorationColor, textDecorationDash = pen.textDecorationDash, textDecoration = pen.textDecoration;
        if (textDecoration) {
            drawUnderLine(ctx, {
                x: drawRectX + x,
                y: drawRectY + (i + y) * oneRowHeight,
                width: textLineWidth,
            }, { textDecorationColor: textDecorationColor, textDecorationDash: textDecorationDash, fontSize: fontSize });
        }
        // 删除线
        var textStrickoutColor = pen.textStrickoutColor, textStrickoutDash = pen.textStrickoutDash, textStrickout = pen.textStrickout;
        if (textStrickout) {
            drawStrickout(ctx, {
                x: drawRectX + x,
                y: drawRectY + (i + y) * oneRowHeight,
                width: textLineWidth,
            }, { textStrickoutColor: textStrickoutColor, textStrickoutDash: textStrickoutDash, fontSize: fontSize });
        }
    });
    ctx.restore();
}
function drawUnderLine(ctx, location, config) {
    var textDecorationColor = config.textDecorationColor, textDecorationDash = config.textDecorationDash, fontSize = config.fontSize;
    var x = location.x, y = location.y, width = location.width;
    switch (ctx.textBaseline) {
        case 'top':
            y += fontSize;
            break;
        case 'middle':
            y += fontSize / 2;
            break;
    }
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = textDecorationColor ? textDecorationColor : ctx.fillStyle;
    ctx.lineWidth = 1;
    ctx.moveTo(x, y);
    ctx.setLineDash(textDecorationDash || []);
    ctx.lineTo(x + width, y);
    ctx.stroke();
    ctx.restore();
}
function drawStrickout(ctx, location, config) {
    var textStrickoutColor = config.textStrickoutColor, textStrickoutDash = config.textStrickoutDash, fontSize = config.fontSize;
    var x = location.x, y = location.y, width = location.width;
    switch (ctx.textBaseline) {
        case 'top':
            y += fontSize / 2;
            break;
        case 'bottom':
            y -= fontSize / 2;
            break;
    }
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = textStrickoutColor ? textStrickoutColor : ctx.fillStyle;
    ctx.lineWidth = 1;
    ctx.moveTo(x, y);
    ctx.setLineDash(textStrickoutDash || []);
    ctx.lineTo(x + width, y);
    ctx.stroke();
    ctx.restore();
}
function drawFillText(ctx, pen, text) {
    var e_1, _a;
    if (text == undefined) {
        return;
    }
    var _b = pen.calculative, fontStyle = _b.fontStyle, fontWeight = _b.fontWeight, fontSize = _b.fontSize, fontFamily = _b.fontFamily, lineHeight = _b.lineHeight, canvas = _b.canvas;
    var store = canvas.store;
    ctx.save();
    var fill = undefined;
    if (pen.calculative.hover) {
        fill = pen.hoverTextColor || pen.hoverColor || store.options.hoverColor;
    }
    else if (pen.calculative.active) {
        fill = pen.activeTextColor || pen.activeColor || store.options.activeColor;
    }
    ctx.fillStyle = fill || getTextColor(pen, store);
    ctx.font = getFont({
        fontStyle: fontStyle,
        fontWeight: fontWeight,
        fontFamily: fontFamily || store.options.fontFamily,
        fontSize: fontSize,
        lineHeight: lineHeight,
    });
    var w = ctx.measureText(text).width;
    var t;
    var prev;
    try {
        for (var _c = __values(pen.calculative.worldAnchors), _d = _c.next(); !_d.done; _d = _c.next()) {
            var anchor = _d.value;
            if (!prev) {
                prev = anchor;
                continue;
            }
            var dis = distance(prev, anchor);
            var n = Math.floor(dis / w);
            t = '';
            for (var i = 0; i < n; i++) {
                t += text;
            }
            var angle = calcRotate(prev, anchor) - 270;
            ctx.save();
            if (angle % 360 !== 0) {
                var x = prev.x, y = prev.y;
                ctx.translate(x, y);
                var rotate = (angle * Math.PI) / 180;
                ctx.rotate(rotate);
                ctx.translate(-x, -y);
            }
            ctx.fillText(t, prev.x, prev.y + lineHeight / 2);
            ctx.restore();
            prev = anchor;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
        }
        finally { if (e_1) throw e_1.error; }
    }
    ctx.restore();
}
export function drawIcon(ctx, pen) {
    var store = pen.calculative.canvas.store;
    ctx.save();
    ctx.shadowColor = '';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    var iconRect = pen.calculative.worldIconRect;
    var x = iconRect.x + iconRect.width / 2;
    var y = iconRect.y + iconRect.height / 2;
    switch (pen.iconAlign) {
        case 'top':
            y = iconRect.y;
            ctx.textBaseline = 'top';
            break;
        case 'bottom':
            y = iconRect.ey;
            ctx.textBaseline = 'bottom';
            break;
        case 'left':
            x = iconRect.x;
            ctx.textAlign = 'left';
            break;
        case 'right':
            x = iconRect.ex;
            ctx.textAlign = 'right';
            break;
        case 'left-top':
            x = iconRect.x;
            y = iconRect.y;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            break;
        case 'right-top':
            x = iconRect.ex;
            y = iconRect.y;
            ctx.textAlign = 'right';
            ctx.textBaseline = 'top';
            break;
        case 'left-bottom':
            x = iconRect.x;
            y = iconRect.ey;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'bottom';
            break;
        case 'right-bottom':
            x = iconRect.ex;
            y = iconRect.ey;
            ctx.textAlign = 'right';
            ctx.textBaseline = 'bottom';
            break;
    }
    var fontWeight = pen.calculative.iconWeight;
    var fontSize = undefined;
    var fontFamily = pen.calculative.iconFamily;
    if (pen.calculative.iconSize > 0) {
        fontSize = pen.calculative.iconSize;
    }
    else if (iconRect.width > iconRect.height) {
        fontSize = iconRect.height;
    }
    else {
        fontSize = iconRect.width;
    }
    ctx.font = getFont({
        fontSize: fontSize,
        fontWeight: fontWeight,
        fontFamily: fontFamily,
    });
    ctx.fillStyle = pen.calculative.iconColor || getTextColor(pen, store);
    if (pen.calculative.iconRotate) {
        ctx.translate(iconRect.center.x, iconRect.center.y);
        ctx.rotate((pen.calculative.iconRotate * Math.PI) / 180);
        ctx.translate(-iconRect.center.x, -iconRect.center.y);
    }
    ctx.beginPath();
    ctx.fillText(pen.calculative.icon, x, y);
    ctx.restore();
}
/**
 * canvas2svg 中对 font 的解析规则比 canvas 中简单，能识别的类型很少
 * @returns ctx.font
 */
export function getFont(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.fontStyle, fontStyle = _c === void 0 ? 'normal' : _c, _d = _b.textDecoration, textDecoration = _d === void 0 ? 'normal' : _d, _e = _b.fontWeight, fontWeight = _e === void 0 ? 'normal' : _e, _f = _b.fontSize, fontSize = _f === void 0 ? 12 : _f, _g = _b.fontFamily, fontFamily = _g === void 0 ? 'Arial' : _g, _h = _b.lineHeight, lineHeight = _h === void 0 ? 1 : _h;
    return fontStyle + " " + textDecoration + " " + fontWeight + " " + fontSize + "px/" + lineHeight + " " + fontFamily;
}
// TODO: 0.5 偏移量在 图片中可能存在问题
export function ctxFlip(ctx, pen) {
    // worldRect 可能为 undefined
    var _a = pen.calculative.worldRect || {}, x = _a.x, ex = _a.ex, y = _a.y, ey = _a.ey;
    if (pen.calculative.flipX) {
        ctx.translate(x + ex + 0.5, 0.5);
        ctx.scale(-1, 1);
    }
    if (pen.calculative.flipY) {
        ctx.translate(0.5, y + ey + 0.5);
        ctx.scale(1, -1);
    }
}
export function ctxRotate(ctx, pen, noFlip) {
    if (noFlip === void 0) { noFlip = false; }
    var _a = pen.calculative.worldRect.center, x = _a.x, y = _a.y;
    ctx.translate(x, y);
    var rotate = (pen.calculative.rotate * Math.PI) / 180;
    // 目前只有水平和垂直翻转，都需要 * -1
    if (!noFlip) {
        if (pen.calculative.flipX) {
            rotate *= -1;
        }
        if (pen.calculative.flipY) {
            rotate *= -1;
        }
    }
    ctx.rotate(rotate);
    ctx.translate(-x, -y);
}
export function renderPen(ctx, pen, download) {
    var e_2, _a;
    ctx.save();
    ctx.translate(0.5, 0.5);
    ctx.beginPath();
    var store = pen.calculative.canvas.store;
    var textFlip = pen.textFlip || store.options.textFlip;
    var textRotate = pen.textRotate || store.options.textRotate;
    if (!textFlip || !textRotate) {
        ctx.save();
    }
    ctxFlip(ctx, pen);
    if (pen.calculative.rotate && pen.name !== 'line') {
        ctxRotate(ctx, pen);
    }
    if (pen.calculative.lineWidth > 1 || download) {
        ctx.lineWidth = pen.calculative.lineWidth;
    }
    inspectRect(ctx, store, pen); // 审查 rect
    var fill;
    // 该变量控制在 hover active 状态下的节点是否设置填充颜色
    // let setBack = true;
    var lineGradientFlag = false;
    var _stroke = undefined;
    if (pen.calculative.hover) {
        _stroke = pen.hoverColor || store.options.hoverColor;
        fill = pen.hoverBackground || store.options.hoverBackground;
        //  ctx.fillStyle = fill;
        //  fill && (setBack = false);
    }
    else if (pen.calculative.active) {
        _stroke = pen.activeColor || store.options.activeColor;
        fill = pen.activeBackground || store.options.activeBackground;
        // ctx.fillStyle = fill;
        // fill && (setBack = false);
    }
    else if (pen.calculative.isDock) {
        if (pen.type === PenType.Line) {
            _stroke = store.options.dockPenColor;
        }
        else {
            fill = rgba(store.options.dockPenColor, 0.2);
            //  ctx.fillStyle = fill;
            //  fill && (setBack = false);
        }
    }
    // else {
    var strokeImg = pen.calculative.strokeImg;
    if (pen.calculative.strokeImage && strokeImg) {
        ctx.strokeStyle = _stroke || ctx.createPattern(strokeImg, 'repeat');
        // fill = true;
    }
    else {
        var stroke = void 0;
        // TODO: 线只有线性渐变
        if (pen.calculative.strokeType) {
            if (pen.calculative.lineGradientColors) {
                if (pen.name === 'line') {
                    lineGradientFlag = true;
                }
                else {
                    if (pen.calculative.lineGradient) {
                        stroke = pen.calculative.lineGradient;
                    }
                    else {
                        stroke = getLineGradient(ctx, pen);
                        pen.calculative.lineGradient = stroke;
                    }
                }
            }
            else {
                stroke = strokeLinearGradient(ctx, pen);
            }
        }
        else {
            stroke = pen.calculative.color || getGlobalColor(store);
        }
        ctx.strokeStyle = _stroke || stroke;
    }
    // }
    //if (setBack) {
    var backgroundImg = pen.calculative.backgroundImg;
    if (pen.calculative.backgroundImage && backgroundImg) {
        ctx.fillStyle = fill || ctx.createPattern(backgroundImg, 'repeat');
        fill = true;
    }
    else {
        var back = void 0;
        if (pen.calculative.bkType === Gradient.Linear) {
            if (pen.calculative.gradientColors) {
                if (!pen.type) {
                    //连线不考虑渐进背景
                    if (pen.calculative.gradient) {
                        //位置变化/放大缩小操作不会触发重新计算
                        back = pen.calculative.gradient;
                    }
                    else {
                        back = getBkGradient(ctx, pen);
                        pen.calculative.gradient = back;
                    }
                }
            }
            else {
                back = drawBkLinearGradient(ctx, pen);
            }
        }
        else if (pen.calculative.bkType === Gradient.Radial) {
            if (pen.calculative.gradientColors) {
                if (pen.calculative.radialGradient) {
                    back = pen.calculative.radialGradient;
                }
                else {
                    back = getBkRadialGradient(ctx, pen);
                    pen.calculative.radialGradient = back;
                }
            }
            else {
                back = drawBkRadialGradient(ctx, pen);
            }
        }
        else {
            back = pen.calculative.background || store.data.penBackground;
        }
        ctx.fillStyle = fill || back;
        fill = !!back;
    }
    // }
    setLineCap(ctx, pen);
    setLineJoin(ctx, pen);
    setGlobalAlpha(ctx, pen);
    if (pen.calculative.lineDash) {
        ctx.setLineDash(pen.calculative.lineDash.map(function (item) { return item * pen.calculative.canvas.store.data.scale; }));
    }
    if (pen.calculative.lineDashOffset) {
        ctx.lineDashOffset = pen.calculative.lineDashOffset;
    }
    if (pen.calculative.shadowColor) {
        ctx.shadowColor = pen.calculative.shadowColor;
        ctx.shadowOffsetX = pen.calculative.shadowOffsetX;
        ctx.shadowOffsetY = pen.calculative.shadowOffsetY;
        ctx.shadowBlur = pen.calculative.shadowBlur;
    }
    if (lineGradientFlag) {
        ctxDrawLinearGradientPath(ctx, pen);
        ctxDrawLinePath(true, ctx, pen, store);
    }
    else {
        ctxDrawPath(true, ctx, pen, store, fill);
        ctxDrawCanvas(ctx, pen);
    }
    if (!(pen.image && pen.calculative.img) && pen.calculative.icon) {
        drawIcon(ctx, pen);
    }
    if (!textFlip || !textRotate) {
        ctx.restore();
    }
    if (textFlip && !textRotate) {
        ctxFlip(ctx, pen);
    }
    if (!textFlip && textRotate) {
        if (pen.calculative.rotate && pen.name !== 'line') {
            ctxRotate(ctx, pen, true);
        }
    }
    drawText(ctx, pen);
    if (pen.type === PenType.Line && pen.fillTexts) {
        try {
            for (var _b = __values(pen.fillTexts), _c = _b.next(); !_c.done; _c = _b.next()) {
                var text = _c.value;
                drawFillText(ctx, pen, text);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
    }
    ctx.restore();
}
/**
 * 更改 ctx 的 lineCap 属性
 */
export function setLineCap(ctx, pen) {
    var lineCap = pen.lineCap || (pen.type ? 'round' : 'square');
    if (lineCap) {
        ctx.lineCap = lineCap;
    }
    else if (pen.type) {
        ctx.lineCap = 'round';
    }
}
/**
 * 更改 ctx 的 lineJoin 属性
 */
export function setLineJoin(ctx, pen) {
    var lineJoin = pen.lineJoin;
    if (lineJoin) {
        ctx.lineJoin = lineJoin;
    }
    else if (pen.type) {
        ctx.lineJoin = 'round';
    }
}
/**
 * 通常用在下载 svg
 * canvas2svg 与 canvas ctx 设置 strokeStyle 表现不同
 * 若设置值为 undefined ，canvas2svg 为空， canvas ctx 为上一个值
 */
export function renderPenRaw(ctx, pen, rect, download) {
    var e_3, _a;
    var _b, _c;
    ctx.save();
    if (rect) {
        ctx.translate(-rect.x, -rect.y);
    }
    // for canvas2svg
    (_c = (_b = ctx).setAttrs) === null || _c === void 0 ? void 0 : _c.call(_b, pen);
    // end
    var store = pen.calculative.canvas.store;
    var textFlip = pen.textFlip || store.options.textFlip;
    var textRotate = pen.textRotate || store.options.textRotate;
    ctx.beginPath();
    if (!textFlip || !textRotate) {
        ctx.save();
    }
    if (pen.calculative.flipX) {
        if (rect) {
            ctx.translate(pen.calculative.worldRect.x + pen.calculative.worldRect.ex, 0);
        }
        else {
            ctx.translate(pen.calculative.worldRect.x + pen.calculative.worldRect.ex, 0);
        }
        ctx.scale(-1, 1);
    }
    if (pen.calculative.flipY) {
        if (rect) {
            ctx.translate(0, pen.calculative.worldRect.y + pen.calculative.worldRect.ey);
        }
        else {
            ctx.translate(0, pen.calculative.worldRect.y + pen.calculative.worldRect.ey);
        }
        ctx.scale(1, -1);
    }
    if (pen.calculative.rotate && pen.name !== 'line') {
        ctxRotate(ctx, pen);
    }
    if (pen.calculative.lineWidth > 1 || download) {
        ctx.lineWidth = pen.calculative.lineWidth;
    }
    var fill;
    if (pen.calculative.hover) {
        ctx.strokeStyle = pen.hoverColor || store.options.hoverColor;
        ctx.fillStyle = pen.hoverBackground || store.options.hoverBackground;
        fill = pen.hoverBackground || store.options.hoverBackground;
    }
    else if (pen.calculative.active) {
        ctx.strokeStyle = pen.activeColor || store.options.activeColor;
        ctx.fillStyle = pen.activeBackground || store.options.activeBackground;
        fill = pen.activeBackground || store.options.activeBackground;
    }
    else {
        if (pen.strokeImage) {
            if (pen.calculative.strokeImg) {
                ctx.strokeStyle = ctx.createPattern(pen.calculative.strokeImg, 'repeat');
                fill = true;
            }
        }
        else {
            ctx.strokeStyle = pen.calculative.color || getGlobalColor(store);
        }
        if (pen.backgroundImage) {
            if (pen.calculative.backgroundImg) {
                ctx.fillStyle = ctx.createPattern(pen.calculative.backgroundImg, 'repeat');
                fill = true;
            }
        }
        else {
            ctx.fillStyle = pen.background;
            fill = !!pen.background;
        }
    }
    setLineCap(ctx, pen);
    setLineJoin(ctx, pen);
    setGlobalAlpha(ctx, pen);
    if (pen.calculative.lineDash) {
        ctx.setLineDash(pen.calculative.lineDash);
    }
    if (pen.calculative.lineDashOffset) {
        ctx.lineDashOffset = pen.calculative.lineDashOffset;
    }
    if (pen.calculative.shadowColor) {
        ctx.shadowColor = pen.calculative.shadowColor;
        ctx.shadowOffsetX = pen.calculative.shadowOffsetX;
        ctx.shadowOffsetY = pen.calculative.shadowOffsetY;
        ctx.shadowBlur = pen.calculative.shadowBlur;
    }
    ctxDrawPath(false, ctx, pen, store, fill);
    ctxDrawCanvas(ctx, pen);
    // renderPenRaw 用在 downloadPng svg , echarts 等图形需要
    if (pen.calculative.img) {
        ctx.save();
        ctx.shadowColor = '';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        drawImage(ctx, pen);
        ctx.restore();
    }
    else if (pen.calculative.icon) {
        drawIcon(ctx, pen);
    }
    if (!textFlip || !textRotate) {
        ctx.restore();
    }
    if (textFlip && !textRotate) {
        if (pen.calculative.flipX) {
            if (rect) {
                ctx.translate(pen.calculative.worldRect.x + pen.calculative.worldRect.ex, 0);
            }
            else {
                ctx.translate(pen.calculative.worldRect.x + pen.calculative.worldRect.ex, 0);
            }
            ctx.scale(-1, 1);
        }
        if (pen.calculative.flipY) {
            if (rect) {
                ctx.translate(0, pen.calculative.worldRect.y + pen.calculative.worldRect.ey);
            }
            else {
                ctx.translate(0, pen.calculative.worldRect.y + pen.calculative.worldRect.ey);
            }
            ctx.scale(1, -1);
        }
    }
    if (!textFlip && textRotate) {
        if (pen.calculative.rotate && pen.name !== 'line') {
            ctxRotate(ctx, pen, true);
        }
    }
    drawText(ctx, pen);
    if (pen.type === PenType.Line && pen.fillTexts) {
        try {
            for (var _d = __values(pen.fillTexts), _e = _d.next(); !_e.done; _e = _d.next()) {
                var text = _e.value;
                drawFillText(ctx, pen, text);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            }
            finally { if (e_3) throw e_3.error; }
        }
    }
    ctx.restore();
}
/**
 * 根据 path2D 绘制 path
 * @param canUsePath 是否可使用 Path2D, downloadSvg 不可使用 path2D
 */
export function ctxDrawPath(canUsePath, ctx, pen, store, fill) {
    if (canUsePath === void 0) { canUsePath = true; }
    var path = canUsePath
        ? store.path2dMap.get(pen)
        : globalStore.path2dDraws[pen.name];
    if (path) {
        if (pen.type === PenType.Line && pen.borderWidth) {
            ctx.save();
            ctx.beginPath();
            var lineWidth = pen.calculative.lineWidth + pen.calculative.borderWidth;
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = pen.borderColor;
            if (path instanceof Path2D) {
                fill && ctx.fill(path);
                lineWidth && ctx.stroke(path);
            }
            else {
                path(pen, ctx);
                fill && ctx.fill();
                lineWidth && ctx.stroke();
            }
            ctx.restore();
        }
        if (path instanceof Path2D) {
            fill && ctx.fill(path);
        }
        else {
            ctx.save();
            path(pen, ctx);
            fill && ctx.fill();
            ctx.restore();
        }
        var progress = pen.calculative.progress;
        if (progress != null) {
            // 从左往右 x, y, x + width * progress, y
            // 从右往左 ex, y, x + width * (1-progress), y
            // 从下往上 x, y, x, y + height * progress
            // 从上往下 x, ey, x, y + height * (1 - progress)
            ctx.save();
            var _a = pen.calculative.worldRect, ex = _a.ex, x = _a.x, y = _a.y, width = _a.width, height = _a.height, ey = _a.ey;
            var grd = null;
            if (!pen.verticalProgress) {
                grd = !pen.reverseProgress
                    ? ctx.createLinearGradient(x, y, x + width * progress, y)
                    : ctx.createLinearGradient(ex, y, x + width * (1 - progress), y);
            }
            else {
                grd = !pen.reverseProgress
                    ? ctx.createLinearGradient(x, ey, x, y + height * (1 - progress))
                    : ctx.createLinearGradient(x, y, x, y + height * progress);
            }
            var color = pen.calculative.progressColor ||
                pen.calculative.color ||
                store.options.activeColor;
            grd.addColorStop(0, color);
            grd.addColorStop(1, color);
            grd.addColorStop(1, 'transparent');
            ctx.fillStyle = grd;
            if (path instanceof Path2D) {
                ctx.fill(path);
            }
            else {
                path(pen, ctx);
                ctx.fill();
            }
            ctx.restore();
        }
        if (pen.calculative.lineWidth) {
            if (path instanceof Path2D) {
                ctx.stroke(path);
            }
            else {
                path(pen, ctx);
                ctx.stroke();
            }
        }
        if (pen.type) {
            if (pen.calculative.animatePos) {
                ctx.save();
                setCtxLineAnimate(ctx, pen, store);
                if (path instanceof Path2D) {
                    ctx.stroke(path);
                }
                else {
                    path(pen, ctx);
                    ctx.stroke();
                }
                ctx.restore();
            }
            pen.fromArrow && renderFromArrow(ctx, pen, store);
            pen.toArrow && renderToArrow(ctx, pen, store);
            if (pen.calculative.active && !pen.calculative.pencil) {
                renderLineAnchors(ctx, pen);
            }
        }
    }
}
/**
 * 连线配置线条渐进后，动画效果、起始点、终点的绘制
 */
export function ctxDrawLinePath(canUsePath, ctx, pen, store) {
    if (canUsePath === void 0) { canUsePath = true; }
    var path = canUsePath
        ? store.path2dMap.get(pen)
        : globalStore.path2dDraws[pen.name];
    if (path) {
        if (pen.type) {
            if (pen.calculative.animatePos) {
                ctx.save();
                setCtxLineAnimate(ctx, pen, store);
                ctx.beginPath();
                if (path instanceof Path2D) {
                    //是否设置了平滑度
                    if (pen.calculative.gradientSmooth &&
                        (pen.lineName === 'polyline' || pen.lineName === 'line')) {
                        if (!pen.calculative.gradientAnimatePath) {
                            pen.calculative.gradientAnimatePath = getGradientAnimatePath(pen);
                        }
                        if (pen.calculative.gradientAnimatePath instanceof Path2D) {
                            ctx.stroke(pen.calculative.gradientAnimatePath);
                        }
                    }
                    else {
                        ctx.stroke(path);
                    }
                }
                else {
                    path(pen, ctx);
                    ctx.stroke();
                }
                ctx.restore();
            }
            pen.fromArrow && renderFromArrow(ctx, pen, store);
            pen.toArrow && renderToArrow(ctx, pen, store);
            //TODO 锚点处渐进色的过渡
            if (pen.calculative.active && !pen.calculative.pencil) {
                renderLineAnchors(ctx, pen);
            }
        }
    }
}
/**
 * 设置线条动画，ctx 的 strokeStyle lineDash 等属性更改
 */
export function setCtxLineAnimate(ctx, pen, store) {
    ctx.strokeStyle = pen.animateColor || store.options.animateColor;
    pen.calculative.animateLineWidth &&
        (ctx.lineWidth = pen.calculative.animateLineWidth * store.data.scale);
    var len = 0;
    switch (pen.lineAnimateType) {
        case LineAnimateType.Beads:
            if (pen.animateReverse) {
                ctx.lineDashOffset = pen.calculative.animatePos;
            }
            else {
                ctx.lineDashOffset = pen.length - pen.calculative.animatePos;
            }
            len = pen.calculative.lineWidth || 5;
            if (len < 5) {
                len = 5;
            }
            var dash = pen.animateLineDash &&
                pen.animateLineDash.map(function (item) { return (item * len) / 5; });
            ctx.setLineDash(dash || [len, len * 2]);
            break;
        case LineAnimateType.Dot:
            if (pen.animateReverse) {
                ctx.lineDashOffset = pen.calculative.animatePos;
            }
            else {
                ctx.lineDashOffset = pen.length - pen.calculative.animatePos;
            }
            len =
                pen.calculative.animateDotSize || pen.calculative.lineWidth * 2 || 10;
            if (len < 10) {
                len = 10;
            }
            ctx.lineWidth =
                (pen.calculative.animateLineWidth || len) * store.data.scale;
            ctx.setLineDash([0.1, pen.length]);
            break;
        case LineAnimateType.Line:
            if (pen.animateReverse) {
                ctx.lineDashOffset = pen.calculative.animatePos;
            }
            else {
                ctx.lineDashOffset = pen.length - pen.calculative.animatePos;
            }
            len =
                pen.calculative.animateDotSize || pen.calculative.lineWidth * 2 || 6;
            if (len < 6) {
                len = 6;
            }
            ctx.lineWidth =
                (pen.calculative.animateLineWidth || len) * store.data.scale;
            ctx.setLineDash([5, 5]);
            break;
        default:
            if (pen.animateReverse) {
                ctx.setLineDash([
                    0,
                    pen.length - pen.calculative.animatePos + 1,
                    pen.calculative.animatePos,
                ]);
            }
            else {
                ctx.setLineDash([
                    pen.calculative.animatePos,
                    pen.length - pen.calculative.animatePos,
                ]);
            }
            break;
    }
}
/**
 * 全局 color
 */
export function getGlobalColor(store) {
    var data = store.data, options = store.options;
    return data.color || options.color;
}
export function renderLineAnchors(ctx, pen) {
    var store = pen.calculative.canvas.store;
    ctx.save();
    ctx.lineWidth = 1;
    ctx.fillStyle = pen.activeColor || store.options.activeColor;
    pen.calculative.worldAnchors.forEach(function (pt) {
        !pt.hidden && !pt.isTemp && renderAnchor(ctx, pt, pen);
    });
    ctx.restore();
}
export function renderAnchor(ctx, pt, pen) {
    if (!pt) {
        return;
    }
    var active = pen.calculative.canvas.store.activeAnchor ===
        pen.calculative.activeAnchor && pen.calculative.activeAnchor === pt;
    var r = 3;
    if (pen.calculative.lineWidth > 3) {
        r = pen.calculative.lineWidth;
    }
    if (pen.anchorRadius) {
        r = pen.anchorRadius;
    }
    if (pt.radius) {
        r = pt.radius;
    }
    if (active) {
        if (pt.prev) {
            ctx.save();
            ctx.strokeStyle = '#4dffff';
            ctx.beginPath();
            ctx.moveTo(pt.prev.x, pt.prev.y);
            ctx.lineTo(pt.x, pt.y);
            ctx.stroke();
            ctx.restore();
            ctx.save();
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(pt.prev.x, pt.prev.y, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }
        if (pt.next) {
            ctx.save();
            ctx.strokeStyle = '#4dffff';
            ctx.beginPath();
            ctx.moveTo(pt.x, pt.y);
            ctx.lineTo(pt.next.x, pt.next.y);
            ctx.stroke();
            ctx.restore();
            ctx.save();
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(pt.next.x, pt.next.y, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }
    else {
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
}
export function calcWorldRects(pen) {
    var store = pen.calculative.canvas.store;
    var rect = {
        x: pen.x,
        y: pen.y,
    };
    if (!pen.parentId || (pen.parentId && !store.pens[pen.parentId])) {
        pen.parentId = undefined;
        rect.width = pen.width;
        rect.height = pen.height;
        rect.rotate = pen.rotate;
        calcRightBottom(rect);
        calcCenter(rect);
    }
    else {
        var parent_1 = store.pens[pen.parentId];
        var parentRect = parent_1.calculative.worldRect;
        if (!parentRect) {
            parentRect = calcWorldRects(parent_1);
        }
        rect.x = parentRect.x + parentRect.width * pen.x;
        rect.y = parentRect.y + parentRect.height * pen.y;
        rect.width = parentRect.width * pen.width;
        rect.height = parentRect.height * pen.height;
        if (parent_1.flipX) {
            rect.x =
                parentRect.width - (rect.x - parentRect.x + rect.width) + parentRect.x;
        }
        if (parent_1.flipY) {
            rect.y =
                parentRect.height -
                    (rect.y - parentRect.y + rect.height) +
                    parentRect.y;
        }
        calcRightBottom(rect);
        rect.rotate = parentRect.rotate + pen.rotate;
        calcCenter(rect);
    }
    pen.calculative.worldRect = rect;
    // 这里的 rect 均是绝对值
    calcPadding(pen, rect);
    return rect;
}
export function calcPadding(pen, rect) {
    !pen.paddingTop && (pen.calculative.paddingTop = 0);
    !pen.paddingBottom && (pen.calculative.paddingBottom = 0);
    !pen.paddingLeft && (pen.calculative.paddingLeft = 0);
    !pen.paddingRight && (pen.calculative.paddingRight = 0);
    Math.abs(pen.calculative.paddingTop) < 1 &&
        (pen.calculative.paddingTop *= rect.height);
    Math.abs(pen.calculative.paddingBottom) < 1 &&
        (pen.calculative.paddingBottom *= rect.height);
    Math.abs(pen.calculative.paddingLeft) < 1 &&
        (pen.calculative.paddingLeft *= rect.width);
    Math.abs(pen.calculative.paddingRight) < 1 &&
        (pen.calculative.paddingRight *= rect.width);
}
export function calcPenRect(pen) {
    var worldRect = pen.calculative.worldRect;
    if (!pen.parentId) {
        Object.assign(pen, worldRect);
        return;
    }
    var store = pen.calculative.canvas.store;
    var parentRect = store.pens[pen.parentId].calculative.worldRect;
    Object.assign(pen, calcRelativeRect(worldRect, parentRect));
}
export function calcWorldAnchors(pen) {
    var store = pen.calculative.canvas.store;
    var anchors = [];
    if (pen.anchors) {
        var _anchors = deepClone(pen.anchors);
        if (pen.flipX) {
            _anchors.forEach(function (anchor) {
                anchor.x = 0.5 - (anchor.x - 0.5);
            });
        }
        if (pen.flipY) {
            _anchors.forEach(function (anchor) {
                anchor.y = 0.5 - (anchor.y - 0.5);
            });
        }
        _anchors.forEach(function (anchor) {
            anchors.push(calcWorldPointOfPen(pen, anchor));
        });
    }
    // Default anchors of node
    if (!anchors.length &&
        !pen.type &&
        !pen.calculative.canvas.parent.isCombine(pen)) {
        var _a = pen.calculative.worldRect, x_1 = _a.x, y_1 = _a.y, width_1 = _a.width, height_1 = _a.height;
        anchors = store.options.defaultAnchors.map(function (anchor, index) {
            return {
                id: "" + index,
                penId: pen.id,
                x: x_1 + width_1 * anchor.x,
                y: y_1 + height_1 * anchor.y,
            };
        });
    }
    if (pen.calculative.rotate) {
        anchors.forEach(function (anchor) {
            rotatePoint(anchor, pen.calculative.rotate, pen.calculative.worldRect.center);
        });
    }
    if (!pen.type || pen.anchors) {
        pen.calculative.worldAnchors = anchors;
    }
    if (pen.calculative.activeAnchor && anchors.length) {
        pen.calculative.activeAnchor = anchors.find(function (a) {
            a.id === pen.calculative.activeAnchor.id;
        });
    }
    pen.calculative.gradientAnimatePath = undefined;
}
export function calcWorldPointOfPen(pen, pt) {
    var p = __assign({}, pt);
    var _a = pen.calculative.worldRect, x = _a.x, y = _a.y, width = _a.width, height = _a.height;
    p.x = x + width * pt.x;
    p.y = y + height * pt.y;
    if (pt.prev) {
        p.prev = {
            penId: pen.id,
            connectTo: pt.prev.connectTo,
            x: x + width * pt.prev.x,
            y: y + height * pt.prev.y,
        };
    }
    if (pt.next) {
        p.next = {
            penId: pen.id,
            connectTo: pt.next.connectTo,
            x: x + width * pt.next.x,
            y: y + height * pt.next.y,
        };
    }
    return p;
}
export function calcIconRect(pens, pen) {
    var _a = pen.calculative, paddingTop = _a.paddingTop, paddingBottom = _a.paddingBottom, paddingLeft = _a.paddingLeft, paddingRight = _a.paddingRight;
    var x = paddingLeft;
    var y = paddingTop;
    var width = pen.calculative.worldRect.width - paddingLeft - paddingRight;
    var height = pen.calculative.worldRect.height - paddingTop - paddingBottom;
    var iconLeft = pen.calculative.iconLeft;
    var iconTop = pen.calculative.iconTop;
    if (iconLeft && Math.abs(iconLeft) < 1) {
        iconLeft = pen.calculative.worldRect.width * iconLeft;
    }
    if (iconTop && Math.abs(iconTop) < 1) {
        iconTop = pen.calculative.worldRect.height * iconTop;
    }
    x += iconLeft || 0;
    y += iconTop || 0;
    width -= iconLeft || 0;
    height -= iconTop || 0;
    var rotate = pen.calculative.iconRotate || 0;
    if (pen.parentId) {
        var parentPen = pens[pen.parentId].calculative;
        if (parentPen) {
            rotate += parentPen.rotate;
            rotate %= 360;
        }
    }
    x = pen.calculative.worldRect.x + x;
    y = pen.calculative.worldRect.y + y;
    pen.calculative.worldIconRect = {
        x: x,
        y: y,
        width: width,
        height: height,
        rotate: rotate,
    };
    calcRightBottom(pen.calculative.worldIconRect);
    calcCenter(pen.calculative.worldIconRect);
}
export function scalePen(pen, scale, center) {
    scaleRect(pen.calculative.worldRect, scale, center);
    if (pen.calculative.initRect) {
        scaleRect(pen.calculative.initRect, scale, center);
    }
    if (pen.calculative.x) {
        scalePoint(pen.calculative, scale, center);
    }
    if (pen.type) {
        calcWorldAnchors(pen);
    }
}
export function pushPenAnchor(pen, pt) {
    if (!pen.anchors) {
        pen.anchors = [];
    }
    if (!pen.calculative.worldAnchors) {
        pen.calculative.worldAnchors = [];
    }
    var worldAnchor = {
        id: pt.id,
        penId: pen.id,
        x: pt.x,
        y: pt.y,
    };
    pen.calculative.worldAnchors.push(worldAnchor);
    if (pen.calculative.worldRect) {
        if (pen.rotate % 360) {
            rotatePoint(pt, -pen.rotate, pen.calculative.worldRect.center);
        }
        var anchor = {
            id: pt.id,
            penId: pen.id,
            x: (pt.x - pen.calculative.worldRect.x) / pen.calculative.worldRect.width,
            y: (pt.y - pen.calculative.worldRect.y) / pen.calculative.worldRect.height,
        };
        pen.anchors.push(anchor);
    }
    return worldAnchor;
}
export function addLineAnchor(pen, pt, index) {
    if (!pen.anchors) {
        pen.anchors = [];
    }
    if (!pen.calculative.worldAnchors) {
        pen.calculative.worldAnchors = [];
    }
    var worldAnchor = getSplitAnchor(pen, pt, index);
    pen.calculative.worldAnchors.splice(index + 1, 0, worldAnchor);
    pen.anchors.splice(index + 1, 0, calcRelativePoint(worldAnchor, pen.calculative.worldRect));
    pen.calculative.activeAnchor = worldAnchor;
    return worldAnchor;
}
export function removePenAnchor(pen, anchor) {
    if (!pen || !pen.calculative.worldAnchors) {
        return;
    }
    var i = pen.calculative.worldAnchors.findIndex(function (a) { return a.id === anchor.id; });
    if (i > -1) {
        pen.calculative.worldAnchors.splice(i, 1);
    }
    i = pen.anchors.findIndex(function (a) { return a.id === anchor.id; });
    if (i > -1) {
        pen.anchors.splice(i, 1);
    }
}
export function facePen(pt, pen) {
    if (!pen || !pen.calculative || !pen.calculative.worldRect.center) {
        return Direction.None;
    }
    if (pt.anchorId) {
        var anchor = pen.anchors.filter(function (_anchor) { return _anchor.id === pt.anchorId; });
        if (anchor.length) {
            if (anchor[0].direction > -1) {
                return anchor[0].direction;
            }
        }
    }
    return facePoint(pt, pen.calculative.worldRect.center);
}
export function nearestAnchor(pen, pt) {
    var dis = Infinity;
    var anchor;
    pen.calculative.worldAnchors.forEach(function (a) {
        var d = distance(pt, a);
        if (dis > d) {
            dis = d;
            anchor = a;
        }
    });
    return anchor;
}
export function translateLine(pen, x, y) {
    pen.x += x;
    pen.y += y;
    if (pen.anchors) {
        pen.anchors.forEach(function (a) {
            translatePoint(a, x, y);
        });
    }
    if (pen.calculative.worldAnchors) {
        pen.calculative.worldAnchors.forEach(function (a) {
            translatePoint(a, x, y);
        });
    }
}
export function deleteTempAnchor(pen) {
    if (pen && pen.calculative && pen.calculative.worldAnchors.length) {
        var to = getToAnchor(pen);
        // 第一次画线
        if (!pen.anchors || !pen.anchors.length) {
            while (pen.calculative.worldAnchors.length &&
                to !== pen.calculative.activeAnchor) {
                pen.calculative.worldAnchors.pop();
                to = getToAnchor(pen);
            }
        }
        // 拖拽终点
        else if (to === pen.calculative.activeAnchor) {
            pen.calculative.worldAnchors = [pen.calculative.worldAnchors[0]];
        }
        // 拖拽起点
        else if (pen.calculative.worldAnchors[0] === pen.calculative.activeAnchor) {
            pen.calculative.worldAnchors = [
                pen.calculative.worldAnchors[pen.calculative.worldAnchors.length - 1],
            ];
        }
    }
}
/**
 * 添加line到pen的connectedLines中，并关联相关属性
 * 不添加连线到画布中，请确保画布中已经有该连线。
 * */
export function connectLine(pen, anchor, line, lineAnchor) {
    if (!pen ||
        !anchor ||
        !line ||
        !lineAnchor ||
        anchor.twoWay === TwoWay.DisableConnected ||
        anchor.twoWay === TwoWay.Disable ||
        lineAnchor.twoWay === TwoWay.DisableConnectTo ||
        lineAnchor.twoWay === TwoWay.Disable) {
        return;
    }
    if (anchor.twoWay === TwoWay.In) {
        if (line.calculative.worldAnchors.length === 1) {
            return;
        }
        var to = getToAnchor(line);
        if (lineAnchor.id !== to.id) {
            return;
        }
    }
    if (anchor.twoWay === TwoWay.Out) {
        var from = getFromAnchor(line);
        if (lineAnchor.id !== from.id) {
            return;
        }
    }
    if (lineAnchor.connectTo === pen.id && lineAnchor.anchorId === anchor.id) {
        return;
    }
    if (lineAnchor.connectTo) {
        var p = pen.calculative.canvas.store.pens[lineAnchor.connectTo];
        disconnectLine(p, getAnchor(p, lineAnchor.anchorId), line, lineAnchor);
    }
    if (!pen.connectedLines) {
        pen.connectedLines = [];
    }
    var i = pen.connectedLines.findIndex(function (item) {
        return item.lineId === line.id &&
            item.lineAnchor === lineAnchor.id &&
            item.anchor === anchor.id;
    });
    if (i < 0) {
        pen.connectedLines.push({
            lineId: line.id,
            lineAnchor: lineAnchor.id,
            anchor: anchor.id,
        });
    }
    lineAnchor.connectTo = pen.id;
    lineAnchor.anchorId = anchor.id;
    // 如果两条连线，则相互关联
    if (pen.type) {
        connectLine(line, lineAnchor, pen, anchor);
    }
    pen.calculative.canvas.store.emitter.emit('connectLine', {
        line: line,
        lineAnchor: lineAnchor,
        pen: pen,
        anchor: anchor,
    });
    return true;
}
/**
 * 从 pen.connectedLines 中删除 lineId 和 lineAnchor
 */
export function disconnectLine(pen, anchor, line, lineAnchor) {
    if (!pen || !anchor || !line || !lineAnchor) {
        return;
    }
    if (!pen.connectedLines || !pen.connectedLines.length) {
        return;
    }
    pen.connectedLines.forEach(function (item, index, arr) {
        if ((item.lineId === line.id || item.lineId === line.id) &&
            item.lineAnchor === lineAnchor.id &&
            item.anchor === anchor.id) {
            arr.splice(index, 1);
        }
    });
    lineAnchor.connectTo = undefined;
    lineAnchor.anchorId = undefined;
    // 如果两条连线相互关联，则都取消关联
    if (pen.type &&
        anchor.connectTo === line.id &&
        anchor.anchorId === lineAnchor.id) {
        disconnectLine(line, lineAnchor, pen, anchor);
    }
    pen.calculative.canvas.store.emitter.emit('disconnectLine', {
        line: line,
        lineAnchor: lineAnchor,
        pen: pen,
        anchor: anchor,
    });
    return true;
}
export function getAnchor(pen, anchorId) {
    var _a;
    if (!pen || !anchorId) {
        return;
    }
    return (_a = pen.calculative.worldAnchors) === null || _a === void 0 ? void 0 : _a.find(function (item) { return item.id === anchorId; });
}
export function getFromAnchor(pen) {
    if (!pen || !pen.calculative.worldAnchors) {
        return;
    }
    return pen.calculative.worldAnchors[0];
}
export function getToAnchor(pen) {
    if (!pen || !pen.calculative.worldAnchors) {
        return;
    }
    return pen.calculative.worldAnchors[pen.calculative.worldAnchors.length - 1];
}
export function setNodeAnimate(pen, now) {
    var e_4, _a, e_5, _b;
    var _c;
    if (pen.calculative.start === 0 || !pen.frames || !pen.frames.length) {
        pen.calculative.start = undefined;
        return 0;
    }
    if (!pen.calculative.duration) {
        pen.calculative.duration = 0;
        try {
            for (var _d = __values(pen.frames), _e = _d.next(); !_e.done; _e = _d.next()) {
                var f = _e.value;
                pen.calculative.duration += f.duration;
                for (var k in f) {
                    if (k !== 'duration' && !pen[k]) {
                        if (k === 'scale') {
                            pen[k] = 1;
                        }
                    }
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            }
            finally { if (e_4) throw e_4.error; }
        }
    }
    if (!pen.animateCycle) {
        pen.animateCycle = Infinity;
    }
    if (!pen.calculative.start) {
        pen.calculative.start = now;
        pen.calculative.frameIndex = 0;
        pen.calculative.frameStart = pen.calculative.start;
        pen.calculative.frameDuration = pen.frames[0].duration;
        pen.calculative.frameEnd =
            pen.calculative.frameStart + pen.calculative.frameDuration;
        pen.calculative.cycleIndex = 1;
        pen.calculative.x = pen.calculative.worldRect.x;
        pen.calculative.y = pen.calculative.worldRect.y;
        pen.calculative.initRect = deepClone(pen.calculative.worldRect);
        pen.calculative.initRect.rotate = pen.calculative.rotate || 0;
        initPrevFrame(pen);
    }
    else {
        var frameIndex = 0;
        var cycleIndex = Math.ceil((now - pen.calculative.start) / pen.calculative.duration);
        // 播放结束
        if (cycleIndex > pen.animateCycle) {
            pen.currentAnimation = undefined;
            pen.calculative.start = undefined;
            setNodeAnimateProcess(pen, 1);
            return 0;
        }
        var pos = (now - pen.calculative.start) % pen.calculative.duration;
        var d = 0;
        try {
            for (var _f = __values(pen.frames), _g = _f.next(); !_g.done; _g = _f.next()) {
                var frame = _g.value;
                d += frame.duration;
                if (pos > d) {
                    ++frameIndex;
                }
                else {
                    break;
                }
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
            }
            finally { if (e_5) throw e_5.error; }
        }
        // 帧超出
        if (!pen.frames[frameIndex]) {
            return true;
        }
        pen.calculative.frameDuration = pen.frames[frameIndex].duration;
        pen.calculative.frameStart =
            pen.calculative.start + pen.calculative.duration * (cycleIndex - 1);
        pen.calculative.frameEnd =
            pen.calculative.frameStart + pen.calculative.frameDuration;
        // 换帧
        var frameChanged = frameIndex !== pen.calculative.frameIndex;
        // 新循环播放
        var cycleChanged = cycleIndex > pen.calculative.cycleIndex;
        frameChanged && (pen.calculative.frameIndex = frameIndex);
        cycleChanged && (pen.calculative.cycleIndex = cycleIndex);
        if (frameChanged || cycleChanged) {
            // 以初始位置为参考点。因为网页在后台时，不执行动画帧，网页恢复显示时，位置不确定
            pen.calculative.x = pen.calculative.initRect.x;
            pen.calculative.y = pen.calculative.initRect.y;
            if ((_c = pen.children) === null || _c === void 0 ? void 0 : _c.length) {
                pen.calculative.canvas.rotatePen(pen, (pen.calculative.initRect.rotate || 0) - pen.calculative.rotate, pen.calculative.initRect);
            }
            else {
                pen.calculative.rotate = pen.calculative.initRect.rotate || 0;
            }
            if (frameIndex > 0) {
                pen.prevFrame = {};
                var prevFrame = pen.frames[frameIndex - 1];
                for (var k in prevFrame) {
                    pen.prevFrame[k] = prevFrame[k];
                }
                Object.assign(pen.prevFrame, {
                    rotate: prevFrame.rotate || 0,
                    x: prevFrame.x || 0,
                    y: prevFrame.y || 0,
                    scale: prevFrame.scale || 1,
                });
            }
            else {
                initPrevFrame(pen);
            }
        }
    }
    var process = ((now - pen.calculative.frameStart) / pen.calculative.frameDuration) % 1;
    setNodeAnimateProcess(pen, process);
    return true;
}
// 把前一个动画帧初始化为播放前状态
export function initPrevFrame(pen) {
    pen.prevFrame = {};
    for (var k in pen) {
        if (typeof pen[k] !== 'object' || k === 'lineDash') {
            pen.prevFrame[k] = pen[k];
        }
    }
    pen.prevFrame.rotate = 0;
    pen.prevFrame.x = 0;
    pen.prevFrame.y = 0;
    pen.prevFrame.scale = 1;
}
// 根据process进度值（纯小数），计算节点动画属性
export function setNodeAnimateProcess(pen, process) {
    var _a;
    if (process < 0) {
        return;
    }
    if (process > 1) {
        process = 1;
    }
    var frame = pen.frames[pen.calculative.frameIndex];
    for (var k in frame) {
        if (k === 'duration') {
            continue;
        }
        else if (k === 'scale') {
            pen.calculative.worldRect = deepClone(pen.calculative.initRect);
            scaleRect(pen.calculative.worldRect, pen.prevFrame.scale, pen.calculative.worldRect.center);
            var newScale = pen.prevFrame.scale + (frame[k] - pen.prevFrame.scale) * process;
            scaleRect(pen.calculative.worldRect, newScale / pen.prevFrame.scale, pen.calculative.worldRect.center);
            pen.calculative.patchFlags = true;
        }
        else if (k === 'x') {
            var lastVal = getFrameValue(pen, k, pen.calculative.frameIndex);
            pen.calculative.worldRect.x = pen.calculative.initRect.x + lastVal;
            pen.calculative.worldRect.ex = pen.calculative.initRect.ex + lastVal;
            translateRect(pen.calculative.worldRect, frame[k] * process * pen.calculative.canvas.store.data.scale, 0);
            pen.calculative.patchFlags = true;
        }
        else if (k === 'y') {
            var lastVal = getFrameValue(pen, k, pen.calculative.frameIndex);
            pen.calculative.worldRect.y = pen.calculative.initRect.y + lastVal;
            pen.calculative.worldRect.ey = pen.calculative.initRect.ey + lastVal;
            translateRect(pen.calculative.worldRect, 0, frame[k] * process * pen.calculative.canvas.store.data.scale);
            pen.calculative.patchFlags = true;
        }
        else if (k === 'rotate') {
            if (pen.prevFrame[k] >= 360) {
                pen.prevFrame[k] %= 360;
            }
            var lastVal = getFrameValue(pen, k, pen.calculative.frameIndex);
            var offsetRotate = ((pen.calculative.initRect.rotate + lastVal + frame[k] * process) %
                360) -
                (pen.calculative.rotate || 0);
            if ((_a = pen.children) === null || _a === void 0 ? void 0 : _a.length) {
                pen.calculative.canvas.rotatePen(pen, offsetRotate, pen.calculative.initRect);
            }
            else {
                pen.calculative.rotate =
                    (pen.calculative.initRect.rotate + lastVal + frame[k] * process) %
                        360;
            }
            pen.calculative.patchFlags = true;
        }
        else if (k === 'image') {
            pen.image = frame['image'];
            pen.calculative.image = undefined;
            pen.calculative.canvas.loadImage(pen);
            if (pen.isBottom) {
                pen.calculative.canvas.canvasImageBottom.init();
            }
            else {
                pen.calculative.canvas.canvasImage.init();
            }
        }
        else if (isLinear(frame[k], k, pen)) {
            if (pen.prevFrame[k] == null) {
                if (k === 'globalAlpha') {
                    pen.prevFrame[k] = 1;
                }
                else {
                    pen.prevFrame[k] = 0;
                }
            }
            var current = pen.prevFrame[k] + (frame[k] - pen.prevFrame[k]) * process;
            pen.calculative[k] = Math.round(current * 100) / 100;
        }
        else {
            if (k === 'visible') {
                if (pen.calculative.image) {
                    if (pen.isBottom) {
                        pen.calculative.canvas.canvasImageBottom.init();
                    }
                    else {
                        pen.calculative.canvas.canvasImage.init();
                    }
                }
            }
            pen.calculative[k] = frame[k];
            var v = {};
            v[k] = frame[k];
            setChildValue(pen, v);
        }
        if (k === 'text') {
            calcTextLines(pen);
        }
    }
}
/**
 * 值类型为 number , pen.linear 为 false 时，且 key 不属于 noLinear 时，返回 true
 * @param value 值
 * @param key 键值
 * @param pen 画笔
 * @returns
 */
function isLinear(value, key, pen) {
    // 不线性变化的属性
    var noLinear = ['strokeType', 'bkType', 'showChild'];
    return (typeof value === 'number' &&
        pen.linear !== false &&
        !noLinear.includes(key));
}
export function setLineAnimate(pen, now) {
    if (pen.calculative.start === 0) {
        pen.calculative.start = undefined;
        return 0;
    }
    if (!pen.animateCycle) {
        pen.animateCycle = Infinity;
    }
    if (!pen.animateSpan) {
        pen.animateSpan = 1;
    }
    pen.calculative.animatePos +=
        pen.animateSpan * (pen.calculative.canvas.store.data.scale || 1);
    if (!pen.calculative.start) {
        pen.calculative.start = Date.now();
        pen.calculative.animatePos =
            pen.animateSpan * (pen.calculative.canvas.store.data.scale || 1);
        pen.calculative.cycleIndex = 1;
    }
    else if (pen.calculative.animatePos > pen.length) {
        // 播放到尾了
        ++pen.calculative.cycleIndex;
        // 播放结束
        if (pen.calculative.cycleIndex > pen.animateCycle) {
            pen.currentAnimation = undefined;
            pen.calculative.start = undefined;
            return 0;
        }
        pen.calculative.animatePos = pen.animateSpan;
    }
    return true;
}
export function setChildrenActive(pen, active) {
    if (active === void 0) { active = true; }
    if (!pen.children) {
        return;
    }
    var store = pen.calculative.canvas.store;
    pen.children.forEach(function (id) {
        var child = store.pens[id];
        if (child) {
            child.calculative.active = active;
            setChildrenActive(child, active);
        }
    });
}
export function setHover(pen, hover) {
    if (hover === void 0) { hover = true; }
    if (!pen) {
        return;
    }
    var store = pen.calculative.canvas.store;
    pen.calculative.hover = hover;
    if (pen.children) {
        pen.children.forEach(function (id) {
            var _a, _b;
            // 子节点没有自己的独立hover，继承父节点hover
            if (((_a = store.pens[id]) === null || _a === void 0 ? void 0 : _a.hoverColor) == undefined &&
                ((_b = store.pens[id]) === null || _b === void 0 ? void 0 : _b.hoverBackground) == undefined) {
                setHover(store.pens[id], hover);
            }
        });
    }
}
export function setElemPosition(pen, elem) {
    if (!elem) {
        return;
    }
    var store = pen.calculative.canvas.store;
    var worldRect = pen.calculative.worldRect;
    elem.style.opacity = pen.globalAlpha + '';
    elem.style.position = 'absolute';
    elem.style.outline = 'none';
    elem.style.left = worldRect.x + store.data.x + 'px';
    elem.style.top = worldRect.y + store.data.y + 'px';
    elem.style.width = worldRect.width + 'px';
    elem.style.height = worldRect.height + 'px';
    elem.style.display =
        pen.calculative.inView != false
            ? pen.calculative.cssDisplay || 'inline'
            : 'none'; // 是否隐藏元素
    !pen.calculative.rotate && (pen.calculative.rotate = 0);
    elem.style.transform = "rotate(" + pen.calculative.rotate + "deg)";
    if (!pen.calculative.rotate) {
        if (pen.calculative.flipX) {
            elem.style.transform = "rotateY(180deg)";
        }
        if (pen.calculative.flipY) {
            elem.style.transform = "rotateX(180deg)";
        }
        if (pen.calculative.flipX && pen.calculative.flipY) {
            elem.style.transform = "rotateZ(180deg)";
        }
    }
    elem.style.zIndex =
        pen.calculative.zIndex !== undefined ? pen.calculative.zIndex + '' : '5';
    if (pen.calculative.zIndex > pen.calculative.canvas.maxZindex) {
        pen.calculative.canvas.maxZindex = pen.calculative.zIndex;
    }
    if (pen.locked === LockState.DisableEdit ||
        pen.locked === LockState.DisableMove ||
        store.data.locked) {
        // gif 组合后，作为子节点可通过 lockedOnCombine 来决定自身的 locked 状态
        elem.style.userSelect = 'initial';
        elem.style.pointerEvents = 'initial';
        if (pen.name === 'gif') {
            elem.style.userSelect = 'none';
            elem.style.pointerEvents = 'none';
        }
    }
    else {
        // pen.locked LockState.Disable 不响应鼠标
        elem.style.userSelect = 'none';
        elem.style.pointerEvents = 'none';
    }
}
export function setElemImg(pen, elem) {
    if (!elem) {
        return;
    }
    //https://github.com/niklasvh/html2canvas
    globalThis.html2canvas &&
        globalThis.html2canvas(elem).then(function (canvas) {
            // document.body.appendChild(canvas);
            var img = new Image();
            img.src = canvas.toDataURL('image/png', 0.1);
            if (img.src.length > 10) {
                pen.calculative.img = img;
            }
        });
}
/**
 * 每个画笔 locked
 * @param pens 画笔
 * @returns
 */
export function getPensLock(pens) {
    return pens.every(function (pen) { return pen.locked; });
}
/**
 * 画笔们的 disabledRotate = true
 * 即 全部禁止旋转 返回 true
 * @param pens 画笔
 * @returns
 */
export function getPensDisableRotate(pens) {
    return pens.every(function (pen) { return pen.disableRotate; });
}
export function rotatePen(pen, angle, rect) {
    var _a;
    if (pen.type) {
        pen.calculative.worldAnchors.forEach(function (anchor) {
            rotatePoint(anchor, angle, rect.center);
        });
        initLineRect(pen);
        calcPenRect(pen);
    }
    else {
        if (pen.calculative.rotate) {
            pen.calculative.rotate += angle;
        }
        else {
            pen.calculative.rotate = angle;
        }
        rotatePoint(pen.calculative.worldRect.center, angle, rect.center);
        if (pen.parentId) {
            pen.calculative.worldRect.x =
                pen.calculative.worldRect.center.x -
                    pen.calculative.worldRect.width / 2;
            pen.calculative.worldRect.y =
                pen.calculative.worldRect.center.y -
                    pen.calculative.worldRect.height / 2;
            pen.x = (pen.calculative.worldRect.x - rect.x) / rect.width;
            pen.y = (pen.calculative.worldRect.y - rect.y) / rect.height;
        }
    }
    (_a = pen.children) === null || _a === void 0 ? void 0 : _a.forEach(function (id) {
        var child = pen.calculative.canvas.store.pens[id];
        rotatePen(child, angle, rect);
    });
}
function initLineRect(pen) {
    var _a;
    if (!((_a = pen.calculative.worldAnchors) === null || _a === void 0 ? void 0 : _a.length)) {
        return;
    }
    if (!isFinite(pen.x) || !isFinite(pen.x)) {
        return;
    }
    if (pen.x == null || pen.y == null) {
        return;
    }
    var rect = getLineRect(pen);
    if (!pen.parentId) {
        Object.assign(pen, rect);
    }
    var _b = pen.calculative.canvas.store.options, fontSize = _b.fontSize, lineHeight = _b.lineHeight;
    if (!pen.fontSize) {
        pen.fontSize = fontSize;
        pen.calculative.fontSize =
            pen.fontSize * pen.calculative.canvas.store.data.scale;
    }
    if (!pen.lineHeight) {
        pen.lineHeight = lineHeight;
        pen.calculative.lineHeight = pen.lineHeight;
    }
    calcCenter(rect);
    pen.calculative.worldRect = rect;
    calcPadding(pen, rect);
    calcTextRect(pen);
    if (pen.calculative.worldAnchors) {
        pen.anchors = pen.calculative.worldAnchors.map(function (pt) {
            return calcRelativePoint(pt, pen.calculative.worldRect);
        });
    }
}
/**
 * 画笔们的 disableSize = true
 * 即 全部不允许改变大小 返回 true
 * @param pens 画笔
 * @returns
 */
export function getPensDisableResize(pens) {
    return pens.every(function (pen) { return pen.disableSize; });
}
export function getFrameValue(pen, prop, frameIndex) {
    if (!pen.frames || !prop) {
        return 0;
    }
    var v = 0;
    for (var i = 0; i < frameIndex; i++) {
        if (pen.frames[i]) {
            v += pen.frames[i][prop] || 0;
        }
    }
    return v;
}
/**
 * 判断该画笔 是否是组合为状态中 展示的画笔
 */
export function isShowChild(pen, store) {
    var _a;
    var selfPen = pen;
    while (selfPen && selfPen.parentId) {
        var oldPen = selfPen;
        selfPen = store.pens[selfPen.parentId];
        var showChildIndex = (_a = selfPen === null || selfPen === void 0 ? void 0 : selfPen.calculative) === null || _a === void 0 ? void 0 : _a.showChild;
        if (showChildIndex != undefined) {
            var showChildId = selfPen.children[showChildIndex];
            if (showChildId !== oldPen.id) {
                // toPng 不展示它
                return false;
            }
        }
    }
    return true;
}
/**
 * 计算画笔的 inView
 * @param pen 画笔
 * @param calcChild 是否计算子画笔
 */
export function calcInView(pen, calcChild) {
    var _a, _b;
    if (calcChild === void 0) { calcChild = false; }
    var _c = pen.calculative.canvas, store = _c.store, canvasRect = _c.canvasRect;
    if (calcChild) {
        (_a = pen.children) === null || _a === void 0 ? void 0 : _a.forEach(function (id) {
            var child = store.pens[id];
            child && calcInView(child, true);
        });
    }
    pen.calculative.inView = true;
    if (!isShowChild(pen, store) ||
        pen.visible == false ||
        pen.calculative.visible == false) {
        pen.calculative.inView = false;
    }
    else {
        var _d = pen.calculative.worldRect, x = _d.x, y = _d.y, width = _d.width, height = _d.height, rotate = _d.rotate;
        var penRect = {
            x: x + store.data.x,
            y: y + store.data.y,
            width: width,
            height: height,
            rotate: rotate,
        };
        calcRightBottom(penRect);
        if (!rectInRect(penRect, canvasRect)) {
            pen.calculative.inView = false;
        }
    }
    // TODO: 语义化上，用 onValue 更合适，但 onValue 会触发 echarts 图形的重绘，没有必要
    // 更改 view 后，修改 dom 节点的显示隐藏
    (_b = pen.onMove) === null || _b === void 0 ? void 0 : _b.call(pen, pen);
}
/**
 * 绘制 rect ，上线后可查看 rect 位置
 */
function inspectRect(ctx, store, pen) {
    if (store.fillWorldTextRect) {
        ctx.save();
        ctx.fillStyle = '#c3deb7';
        var _a = pen.calculative.worldTextRect, x = _a.x, y = _a.y, width = _a.width, height = _a.height;
        ctx.fillRect(x, y, width, height);
        ctx.restore();
    }
}
export function setGlobalAlpha(ctx, pen) {
    var globalAlpha = pen.calculative.globalAlpha;
    if (typeof globalAlpha === 'number' &&
        globalAlpha < 1 &&
        !isNaN(globalAlpha)) {
        ctx.globalAlpha = globalAlpha;
    }
}
/**
 * ctx 绘制图纸，并非 Path2D
 * @param ctx 画布上下文
 * @param pen 画笔
 */
function ctxDrawCanvas(ctx, pen) {
    var canvasDraw = globalStore.canvasDraws[pen.name];
    if (canvasDraw) {
        // TODO: 后续考虑优化 save / restore
        ctx.save();
        // TODO: 原有 return 终止后续操作，必要性不大
        canvasDraw(ctx, pen);
        ctx.restore();
    }
}
export function setChildValue(pen, data) {
    for (var k in data) {
        if (inheritanceProps.includes(k)) {
            pen[k] = data[k];
            if (k === 'fontSize') {
                pen.calculative[k] = data[k] * pen.calculative.canvas.store.data.scale;
                calcTextRect(pen);
            }
            else {
                pen.calculative[k] = data[k];
            }
        }
    }
    if (pen.calculative.canvas.parent.isCombine(pen) &&
        pen.showChild === undefined) {
        var children = pen.children;
        children === null || children === void 0 ? void 0 : children.forEach(function (childId) {
            var child = pen.calculative.canvas.store.pens[childId];
            child && setChildValue(child, data);
        });
    }
}
//# sourceMappingURL=render.js.map