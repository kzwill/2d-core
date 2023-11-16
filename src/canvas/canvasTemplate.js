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
import { ctxFlip, ctxRotate, drawImage, setGlobalAlpha, renderPen, } from '../pen';
import { createOffscreen } from './offscreen';
var CanvasTemplate = /** @class */ (function () {
    function CanvasTemplate(parentElement, store) {
        this.parentElement = parentElement;
        this.store = store;
        this.canvas = document.createElement('canvas');
        this.offscreen = createOffscreen();
        this.bgOffscreen = createOffscreen();
        parentElement.appendChild(this.canvas);
        this.canvas.style.backgroundRepeat = 'no-repeat';
        this.canvas.style.backgroundSize = '100% 100%';
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
    }
    CanvasTemplate.prototype.resize = function (w, h) {
        this.canvas.style.width = w + 'px';
        this.canvas.style.height = h + 'px';
        w = (w * this.store.dpiRatio) | 0;
        h = (h * this.store.dpiRatio) | 0;
        this.canvas.width = w;
        this.canvas.height = h;
        this.bgOffscreen.width = w;
        this.bgOffscreen.height = h;
        this.offscreen.width = w;
        this.offscreen.height = h;
        this.bgOffscreen
            .getContext('2d')
            .scale(this.store.dpiRatio, this.store.dpiRatio);
        this.bgOffscreen.getContext('2d').textBaseline = 'middle';
        this.offscreen
            .getContext('2d')
            .scale(this.store.dpiRatio, this.store.dpiRatio);
        this.offscreen.getContext('2d').textBaseline = 'middle';
        this.init();
    };
    CanvasTemplate.prototype.init = function () {
        this.bgOffscreen
            .getContext('2d')
            .clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.offscreen
            .getContext('2d')
            .clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.patchFlags = true;
        this.bgPatchFlags = true;
        // for (const pen of this.store.data.pens) {
        //   if (this.hasImage(pen)) {
        //     // 只影响本层的
        //     pen.calculative.imageDrawed = false;
        //   }
        // }
        // this.store.patchFlagsBackground = true;
        // this.store.patchFlagsTop = true;
    };
    CanvasTemplate.prototype.hidden = function () {
        this.canvas.style.display = 'none';
    };
    CanvasTemplate.prototype.show = function () {
        this.canvas.style.display = 'block';
    };
    CanvasTemplate.prototype.clear = function () {
        this.bgOffscreen
            .getContext('2d')
            .clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.offscreen
            .getContext('2d')
            .clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas
            .getContext('2d')
            .clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.bgPatchFlags = true;
        this.patchFlags = true;
    };
    CanvasTemplate.prototype.render = function () {
        var e_1, _a;
        var _b;
        if (this.bgPatchFlags) {
            var ctx = this.bgOffscreen.getContext('2d');
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            var width = this.store.data.width || this.store.options.width;
            var height = this.store.data.height || this.store.options.height;
            var x = this.store.data.x || this.store.options.x;
            var y = this.store.data.y || this.store.options.y;
            var background = this.store.data.background || this.store.options.background;
            if (background) {
                ctx.save();
                ctx.fillStyle = background;
                if (width && height && x && y) {
                    ctx.globalAlpha = (_b = this.store.data.globalAlpha) !== null && _b !== void 0 ? _b : this.store.options.globalAlpha;
                    ctx.shadowOffsetX = this.store.options.shadowOffsetX;
                    ctx.shadowOffsetY = this.store.options.shadowOffsetY;
                    ctx.shadowBlur = this.store.options.shadowBlur;
                    ctx.shadowColor = this.store.options.shadowColor;
                    ctx.fillRect(this.store.data.origin.x + x, this.store.data.origin.y + y, width * this.store.data.scale, height * this.store.data.scale);
                }
                else {
                    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                }
                ctx.restore();
            }
            if (width && height && this.store.bkImg) {
                ctx.save();
                ctx.drawImage(this.store.bkImg, this.store.data.origin.x + x, this.store.data.origin.y + y, width * this.store.data.scale, height * this.store.data.scale);
                ctx.restore();
            }
            this.renderGrid(ctx);
        }
        if (this.patchFlags) {
            var ctx = this.offscreen.getContext('2d');
            ctx.save();
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            ctx.translate(this.store.data.x, this.store.data.y);
            try {
                for (var _c = __values(this.store.data.pens), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var pen = _d.value;
                    if (!isFinite(pen.x)) {
                        continue;
                    }
                    if (pen.template && pen.calculative.inView) {
                        //非图片
                        renderPen(ctx, pen);
                        //图片
                        if (pen.image && pen.name !== 'gif' && pen.calculative.img) {
                            ctx.save();
                            ctxFlip(ctx, pen);
                            if (pen.calculative.rotate) {
                                ctxRotate(ctx, pen);
                            }
                            setGlobalAlpha(ctx, pen);
                            drawImage(ctx, pen);
                            ctx.restore();
                        }
                    }
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
        if (this.patchFlags || this.bgPatchFlags) {
            var ctxCanvas = this.canvas.getContext('2d');
            ctxCanvas.clearRect(0, 0, this.canvas.width, this.canvas.height);
            ctxCanvas.drawImage(this.bgOffscreen, 0, 0, this.canvas.width, this.canvas.height);
            ctxCanvas.drawImage(this.offscreen, 0, 0, this.canvas.width, this.canvas.height);
            this.patchFlags = false;
            this.bgPatchFlags = false;
        }
    };
    CanvasTemplate.prototype.renderGrid = function (ctx) {
        var _a = this.store, data = _a.data, options = _a.options;
        var grid = data.grid, gridRotate = data.gridRotate, gridColor = data.gridColor, gridSize = data.gridSize, scale = data.scale, origin = data.origin;
        if (!(grid !== null && grid !== void 0 ? grid : options.grid)) {
            // grid false 时不绘制, undefined 时看 options.grid
            return;
        }
        ctx.save();
        var width = (data.width || options.width) * scale;
        var height = (data.height || options.height) * scale;
        var startX = (data.x || options.x || 0) + origin.x;
        var startY = (data.y || options.y || 0) + origin.y;
        if (gridRotate) {
            ctx.translate(width / 2, height / 2);
            ctx.rotate((gridRotate * Math.PI) / 180);
            ctx.translate(-width / 2, -height / 2);
        }
        ctx.lineWidth = 1;
        ctx.strokeStyle = gridColor || options.gridColor;
        ctx.beginPath();
        var size = (gridSize || options.gridSize) * scale;
        if (!width || !height) {
            var ratio = this.store.dpiRatio;
            var cW = this.canvas.width / ratio;
            var cH = this.canvas.height / ratio;
            var m = startX / size;
            var n = startY / size;
            var offset = size * 10; //补偿值
            var newX = (startX - Math.ceil(m) * size);
            var newY = (startY - Math.ceil(n) * size);
            var endX = cW + newX + offset;
            var endY = cH + newY + offset;
            for (var i = newX; i <= endX; i += size) {
                ctx.moveTo(i, newY);
                ctx.lineTo(i, cH + newY + offset);
            }
            for (var i = newY; i <= endY; i += size) {
                ctx.moveTo(newX, i);
                ctx.lineTo(cW + newX + offset, i);
            }
        }
        else {
            var endX = width + startX;
            var endY = height + startY;
            for (var i = startX; i <= endX; i += size) {
                ctx.moveTo(i, startY);
                ctx.lineTo(i, height + startY);
            }
            for (var i = startY; i <= endY; i += size) {
                ctx.moveTo(startX, i);
                ctx.lineTo(width + startX, i);
            }
        }
        ctx.stroke();
        ctx.restore();
    };
    return CanvasTemplate;
}());
export { CanvasTemplate };
//# sourceMappingURL=canvasTemplate.js.map