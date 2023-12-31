import { Direction } from '../data';
import { pointInRect } from '../rect';
export var PrevNextType;
(function (PrevNextType) {
    PrevNextType[PrevNextType["Mirror"] = 0] = "Mirror";
    PrevNextType[PrevNextType["Bilateral"] = 1] = "Bilateral";
    PrevNextType[PrevNextType["Free"] = 2] = "Free";
})(PrevNextType || (PrevNextType = {}));
export var TwoWay;
(function (TwoWay) {
    TwoWay[TwoWay["Default"] = 0] = "Default";
    TwoWay[TwoWay["In"] = 1] = "In";
    TwoWay[TwoWay["Out"] = 2] = "Out";
    TwoWay[TwoWay["DisableConnected"] = 3] = "DisableConnected";
    TwoWay[TwoWay["DisableConnectTo"] = 4] = "DisableConnectTo";
    TwoWay[TwoWay["Disable"] = 10] = "Disable";
})(TwoWay || (TwoWay = {}));
export var PointType;
(function (PointType) {
    PointType[PointType["Default"] = 0] = "Default";
    PointType[PointType["Line"] = 1] = "Line";
})(PointType || (PointType = {}));
export function rotatePoint(pt, angle, center) {
    if (!angle || angle % 360 === 0) {
        return;
    }
    var a = (angle * Math.PI) / 180;
    var x = (pt.x - center.x) * Math.cos(a) -
        (pt.y - center.y) * Math.sin(a) +
        center.x;
    var y = (pt.x - center.x) * Math.sin(a) +
        (pt.y - center.y) * Math.cos(a) +
        center.y;
    pt.x = x;
    pt.y = y;
    pt.prev && rotatePoint(pt.prev, angle, center);
    pt.next && rotatePoint(pt.next, angle, center);
}
export function hitPoint(pt, target, radius, pen) {
    if (radius === void 0) { radius = 5; }
    if (target.type === PointType.Line) {
        var _rotate = pen.rotate;
        if (pen.flipX) {
            _rotate *= -1;
        }
        if (pen.flipY) {
            _rotate *= -1;
        }
        var rotate = target.rotate + _rotate;
        if (pen.flipX) {
            rotate *= -1;
        }
        if (pen.flipY) {
            rotate *= -1;
        }
        return pointInRect(pt, {
            x: target.x -
                (target.length * pen.calculative.canvas.store.data.scale) / 2,
            y: target.y - radius,
            width: target.length * pen.calculative.canvas.store.data.scale,
            height: radius * 2,
            rotate: rotate,
        });
    }
    else {
        return (pt.x > target.x - radius &&
            pt.x < target.x + radius &&
            pt.y > target.y - radius &&
            pt.y < target.y + radius);
    }
}
export function scalePoint(pt, scale, center) {
    pt.x = center.x - (center.x - pt.x) * scale;
    pt.y = center.y - (center.y - pt.y) * scale;
}
export function calcRotate(pt, center) {
    if (pt.x === center.x) {
        return pt.y <= center.y ? 0 : 180;
    }
    if (pt.y === center.y) {
        return pt.x < center.x ? 270 : 90;
    }
    var x = pt.x - center.x;
    var y = pt.y - center.y;
    var angle = (Math.atan(Math.abs(x / y)) / (2 * Math.PI)) * 360;
    if (x > 0 && y > 0) {
        angle = 180 - angle;
    }
    else if (x < 0 && y > 0) {
        angle += 180;
    }
    else if (x < 0 && y < 0) {
        angle = 360 - angle;
    }
    return angle;
}
export function distance(pt1, pt2) {
    var x = pt1.x - pt2.x;
    var y = pt1.y - pt2.y;
    return Math.sqrt(x * x + y * y);
}
export function facePoint(pt, targetPt) {
    var d = Direction.None;
    if (!targetPt) {
        return d;
    }
    var disX = pt.x - targetPt.x;
    var disY = pt.y - targetPt.y;
    if (Math.abs(disX) > Math.abs(disY)) {
        if (disX > 0) {
            d = Direction.Right;
        }
        else {
            d = Direction.Left;
        }
    }
    else {
        if (disY > 0) {
            d = Direction.Bottom;
        }
        else {
            d = Direction.Up;
        }
    }
    return d;
}
export function translatePoint(pt, x, y) {
    if (!pt) {
        return;
    }
    pt.x += x;
    pt.y += y;
    if (pt.next) {
        pt.next.x += x;
        pt.next.y += y;
    }
    if (pt.prev) {
        pt.prev.x += x;
        pt.prev.y += y;
    }
}
/**
 * 是否是同一个点
 * @param pt1 点1
 * @param pt2 点2
 * @returns true 相同
 */
export function samePoint(pt1, pt2) {
    return pt1.anchorId === pt2.anchorId && pt1.connectTo === pt2.connectTo;
}
export function getDistance(form, to, store) {
    var dis = Math.sqrt((form.x - to.x) * (form.x - to.x) + (form.y - to.y) * (form.y - to.y)) / store.data.scale;
    if (to.rotate === 0) {
        if (form.x < to.x) {
            if (!store.pens[to.penId].flipX) {
                dis *= -1;
            }
        }
        else {
            if (store.pens[to.penId].flipX) {
                dis *= -1;
            }
        }
    }
    else {
        if (form.y < to.y) {
            if (!store.pens[to.penId].flipY) {
                dis *= -1;
            }
        }
        else {
            if (store.pens[to.penId].flipY) {
                dis *= -1;
            }
        }
    }
    form.distance = dis;
}
//# sourceMappingURL=point.js.map