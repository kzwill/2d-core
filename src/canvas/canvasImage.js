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
import { ctxFlip, ctxRotate, drawImage, setGlobalAlpha, getParent, } from '../pen';
import { rgba } from '../utils';
import { createOffscreen } from './offscreen';
var CanvasImage = /** @class */ (function () {
    function CanvasImage(parentElement, store, isBottom) {
        this.parentElement = parentElement;
        this.store = store;
        this.isBottom = isBottom;
        this.canvas = document.createElement('canvas');
        /**
         * 非图片的绘制
         * isBottom true 指背景颜色，背景网格
         * isBottom false 指 标尺
         */
        this.otherOffsreen = createOffscreen(); // 非图片的
        this.offscreen = createOffscreen();
        this.animateOffsScreen = createOffscreen();
        parentElement.appendChild(this.canvas);
        this.canvas.style.backgroundRepeat = 'no-repeat';
        this.canvas.style.backgroundSize = '100% 100%';
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
    }
    CanvasImage.prototype.resize = function (w, h) {
        this.canvas.style.width = w + 'px';
        this.canvas.style.height = h + 'px';
        w = (w * this.store.dpiRatio) | 0;
        h = (h * this.store.dpiRatio) | 0;
        this.canvas.width = w;
        this.canvas.height = h;
        this.otherOffsreen.width = w;
        this.otherOffsreen.height = h;
        this.offscreen.width = w;
        this.offscreen.height = h;
        this.animateOffsScreen.width = w;
        this.animateOffsScreen.height = h;
        this.otherOffsreen
            .getContext('2d')
            .scale(this.store.dpiRatio, this.store.dpiRatio);
        this.otherOffsreen.getContext('2d').textBaseline = 'middle';
        this.offscreen
            .getContext('2d')
            .scale(this.store.dpiRatio, this.store.dpiRatio);
        this.offscreen.getContext('2d').textBaseline = 'middle';
        this.animateOffsScreen
            .getContext('2d')
            .scale(this.store.dpiRatio, this.store.dpiRatio);
        this.animateOffsScreen.getContext('2d').textBaseline = 'middle';
        this.init();
    };
    CanvasImage.prototype.init = function () {
        var e_1, _a;
        this.offscreen
            .getContext('2d')
            .clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.animateOffsScreen
            .getContext('2d')
            .clearRect(0, 0, this.canvas.width, this.canvas.height);
        try {
            for (var _b = __values(this.store.data.pens), _c = _b.next(); !_c.done; _c = _b.next()) {
                var pen = _c.value;
                if (this.hasImage(pen)) {
                    // 只影响本层的
                    pen.calculative.imageDrawed = false;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        // this.store.patchFlagsBackground = true;
        this.store.patchFlagsTop = true;
    };
    CanvasImage.prototype.clear = function () {
        this.otherOffsreen
            .getContext('2d')
            .clearRect(0, 0, this.otherOffsreen.width, this.otherOffsreen.height);
        this.offscreen
            .getContext('2d')
            .clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.animateOffsScreen
            .getContext('2d')
            .clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas
            .getContext('2d')
            .clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    CanvasImage.prototype.hasImage = function (pen) {
        pen.calculative.hasImage =
            pen.calculative &&
                pen.calculative.inView &&
                !pen.isBottom == !this.isBottom && // undefined == false 结果 false
                pen.image &&
                pen.calculative.img &&
                pen.name !== 'gif';
        return pen.calculative.hasImage;
    };
    CanvasImage.prototype.render = function () {
        var e_2, _a, e_3, _b, e_4, _c, e_5, _d;
        var patchFlags = false;
        var patchFlagsAnimate = false;
        try {
            for (var _e = __values(this.store.data.pens), _f = _e.next(); !_f.done; _f = _e.next()) {
                var pen = _f.value;
                if (this.hasImage(pen)) {
                    if (this.store.animates.has(pen)) {
                        patchFlagsAnimate = true;
                    }
                    else if (!pen.calculative.imageDrawed) {
                        patchFlags = true;
                    }
                    if (pen.parentId && this.store.animates.has(getParent(pen, true))) {
                        patchFlagsAnimate = true;
                    }
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_a = _e.return)) _a.call(_e);
            }
            finally { if (e_2) throw e_2.error; }
        }
        // const patchFlagsBackground = this.store.patchFlagsBackground;
        // if (patchFlagsBackground && this.isBottom) {
        //   const ctx = this.otherOffsreen.getContext('2d');
        //   ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        //   const width = this.store.data.width || this.store.options.width;
        //   const height = this.store.data.height || this.store.options.height;
        //   const x = this.store.data.x || this.store.options.x;
        //   const y = this.store.data.y || this.store.options.y;
        //   if (width && height && this.store.bkImg) {
        //     ctx.save();
        //     ctx.drawImage(
        //       this.store.bkImg,
        //       this.store.data.origin.x + x,
        //       this.store.data.origin.y + y,
        //       width * this.store.data.scale,
        //       height * this.store.data.scale
        //     );
        //     ctx.restore();
        //   }
        //   const background =
        //     this.store.data.background ||
        //     (this.store.bkImg ? undefined : this.store.options.background);
        //   if (background) {
        //     ctx.save();
        //     ctx.fillStyle = background;
        //     if (width && height) {
        //       ctx.fillRect(
        //         this.store.data.origin.x + x,
        //         this.store.data.origin.y + y,
        //         width * this.store.data.scale,
        //         height * this.store.data.scale
        //       );
        //     } else {
        //       ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        //     }
        //     ctx.restore();
        //   }
        //   this.renderGrid(ctx);
        // }
        var patchFlagsTop = this.store.patchFlagsTop;
        if (patchFlagsTop && !this.isBottom) {
            var ctx = this.otherOffsreen.getContext('2d');
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.renderRule(ctx);
        }
        // 从有图片画布层切换到无图片画布
        var patchFlagsLast = this.store.patchFlagsLast;
        if (patchFlagsLast) {
            var ctx = this.offscreen.getContext('2d');
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        if (patchFlags) {
            var ctx = this.offscreen.getContext('2d');
            ctx.save();
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            ctx.translate(this.store.data.x, this.store.data.y);
            try {
                for (var _g = __values(this.store.data.pens), _h = _g.next(); !_h.done; _h = _g.next()) {
                    var pen = _h.value;
                    //pen.calculative.imageDrawed  只用于判断是否需要重绘整块画布，不用于判断改图片节点是否绘制过
                    if (!pen.calculative.hasImage ||
                        this.store.animates.has(pen) ||
                        this.store.animates.has(getParent(pen, true))) {
                        continue;
                    }
                    if (pen.template) {
                        continue;
                    }
                    pen.calculative.imageDrawed = true;
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
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_h && !_h.done && (_b = _g.return)) _b.call(_g);
                }
                finally { if (e_3) throw e_3.error; }
            }
            ctx.restore();
        }
        if (patchFlagsAnimate) {
            var ctx = this.animateOffsScreen.getContext('2d');
            ctx.save();
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            ctx.translate(this.store.data.x, this.store.data.y);
            try {
                for (var _j = __values(this.store.animates), _k = _j.next(); !_k.done; _k = _j.next()) {
                    var pen = _k.value;
                    if (!pen.calculative.hasImage) {
                        continue;
                    }
                    if (pen.template) {
                        continue;
                    }
                    pen.calculative.imageDrawed = true;
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
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_k && !_k.done && (_c = _j.return)) _c.call(_j);
                }
                finally { if (e_4) throw e_4.error; }
            }
            try {
                //图片组合节点 动画
                for (var _l = __values(this.store.data.pens), _m = _l.next(); !_m.done; _m = _l.next()) {
                    var pen = _m.value;
                    if (!pen.calculative.hasImage || !pen.parentId) {
                        continue;
                    }
                    if (pen.template) {
                        continue;
                    }
                    if (this.store.animates.has(getParent(pen, true))) {
                        pen.calculative.imageDrawed = true;
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
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_m && !_m.done && (_d = _l.return)) _d.call(_l);
                }
                finally { if (e_5) throw e_5.error; }
            }
            ctx.restore();
        }
        if (patchFlags ||
            patchFlagsAnimate ||
            // (patchFlagsBackground && this.isBottom) ||
            this.isBottom ||
            (patchFlagsTop && !this.isBottom)) {
            var ctxCanvas = this.canvas.getContext('2d');
            ctxCanvas.clearRect(0, 0, this.canvas.width, this.canvas.height);
            // if (this.isBottom) {
            //   ctxCanvas.drawImage(
            //     this.otherOffsreen,
            //     0,
            //     0,
            //     this.canvas.width,
            //     this.canvas.height
            //   );
            //   this.store.patchFlagsBackground = false;
            // }
            ctxCanvas.drawImage(this.offscreen, 0, 0, this.canvas.width, this.canvas.height);
            ctxCanvas.drawImage(this.animateOffsScreen, 0, 0, this.canvas.width, this.canvas.height);
            if (!this.isBottom) {
                ctxCanvas.drawImage(this.otherOffsreen, 0, 0, this.canvas.width, this.canvas.height);
                this.store.patchFlagsTop = false;
            }
        }
    };
    // renderGrid(
    //   ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D
    // ) {
    //   const { data, options } = this.store;
    //   const { grid, gridRotate, gridColor, gridSize, scale } = data;
    //   if (!(grid ?? options.grid)) {
    //     // grid false 时不绘制, undefined 时看 options.grid
    //     return;
    //   }
    //   ctx.save();
    //   const { width, height } = this.canvas;
    //   if (gridRotate) {
    //     ctx.translate(width / 2, height / 2);
    //     ctx.rotate((gridRotate * Math.PI) / 180);
    //     ctx.translate(-width / 2, -height / 2);
    //   }
    //   ctx.lineWidth = 1;
    //   ctx.strokeStyle = gridColor || options.gridColor;
    //   ctx.beginPath();
    //   const size = (gridSize || options.gridSize) * scale;
    //   const longSide = Math.max(width, height);
    //   const count = Math.ceil(longSide / size);
    //   for (let i = -size * count; i < longSide * 2; i += size) {
    //     ctx.moveTo(i, -longSide);
    //     ctx.lineTo(i, longSide * 2);
    //   }
    //   for (let i = -size * count; i < longSide * 2; i += size) {
    //     ctx.moveTo(-longSide, i);
    //     ctx.lineTo(longSide * 2, i);
    //   }
    //   ctx.stroke();
    //   ctx.restore();
    // }
    CanvasImage.prototype.renderRule = function (ctx) {
        var _a = this.store, data = _a.data, options = _a.options;
        var rule = data.rule, ruleColor = data.ruleColor, scale = data.scale, origin = data.origin;
        if (!(rule !== null && rule !== void 0 ? rule : options.rule)) {
            // rule false 时不绘制, undefined 时看 options.rule
            return;
        }
        var span = scale * 10;
        ctx.save();
        var finalRuleColor = ruleColor || options.ruleColor;
        ctx.strokeStyle = rgba(finalRuleColor, 0.7);
        var x = origin.x + data.x;
        var y = origin.y + data.y;
        var _b = this.canvas, width = _b.width, height = _b.height;
        // horizontal rule
        ctx.beginPath();
        ctx.lineWidth = 12;
        ctx.lineDashOffset = -x % span;
        ctx.setLineDash([1, span - 1]);
        ctx.moveTo(0, 0);
        ctx.lineTo(width, 0);
        ctx.stroke();
        // vertical rule
        ctx.beginPath();
        ctx.lineDashOffset = -y % span;
        ctx.moveTo(0, 0);
        ctx.lineTo(0, height);
        ctx.stroke();
        // the big rule
        ctx.strokeStyle = finalRuleColor;
        ctx.beginPath();
        ctx.lineWidth = 24;
        ctx.lineDashOffset = -x % (span * 10);
        ctx.setLineDash([1, span * 10 - 1]);
        ctx.moveTo(0, 0);
        ctx.lineTo(width, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.lineDashOffset = -y % (span * 10);
        ctx.moveTo(0, 0);
        ctx.lineTo(0, height);
        ctx.stroke();
        ctx.beginPath();
        ctx.fillStyle = ctx.strokeStyle;
        var text = 0 - Math.floor(x / span / 10) * 100;
        if (x < 0) {
            text -= 100;
        }
        for (var i = x % (span * 10); i < width; i += 10 * span, text += 100) {
            if (span < 3 && text % 500) {
                continue;
            }
            ctx.fillText(text.toString(), i + 4, 16);
        }
        text = 0 - Math.floor(y / span / 10) * 100;
        if (y < 0) {
            text -= 100;
        }
        for (var i = y % (span * 10); i < height; i += 10 * span, text += 100) {
            if (span < 3 && text % 500) {
                continue;
            }
            ctx.save();
            ctx.beginPath();
            ctx.translate(16, i - 4);
            ctx.rotate((270 * Math.PI) / 180);
            ctx.fillText(text.toString(), 0, 0);
            ctx.restore();
        }
        ctx.restore();
    };
    return CanvasImage;
}());
export { CanvasImage };
//# sourceMappingURL=canvasImage.js.map