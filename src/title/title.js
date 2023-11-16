var Title = /** @class */ (function () {
    function Title(parentElement) {
        this.parentElement = parentElement;
        this.box = document.createElement('div');
        this.box.className = 'meta2d-title';
        parentElement.appendChild(this.box);
        // this.box.onmouseleave = () => {
        //   this.hide();
        // };
        var sheet;
        for (var i = 0; i < document.styleSheets.length; i++) {
            if (document.styleSheets[i].title === 'le5le.com/title') {
                sheet = document.styleSheets[i];
            }
        }
        if (!sheet) {
            var style = document.createElement('style');
            style.type = 'text/css';
            style.title = 'le5le.com/title';
            document.head.appendChild(style);
            style = document.createElement('style');
            style.type = 'text/css';
            document.head.appendChild(style);
            sheet = style.sheet;
            sheet.insertRule('.meta2d-title{position:absolute;padding:0;z-index:10;left: -9999px;top: -9999px;background:#fff;color:#000; cursor: crosshair;border: 1px solid black;}');
        }
    }
    /**
     * @returns 此次应该展示的 title
     */
    Title.getTitle = function (anchor) {
        // if (anchor.titleFnJs && !anchor.titleFn) {
        //   try {
        //     anchor.titleFn = new Function('anchor', anchor.titleFnJs) as (
        //       anchor: Point
        //     ) => string;
        //   } catch (error) {
        //     console.log('titleFnJs', error);
        //   }
        // }
        // return anchor.titleFn ? anchor.titleFn(anchor) : String(anchor.title);
    };
    /**
     * @returns 返回设置前的 rect
     */
    Title.prototype.setText = function (anchor) {
        // this.box.title = anchor.title;
        this.box.innerText = anchor.title;
    };
    /**
     * 更新文字
     */
    Title.prototype.updateText = function (anchor) {
        var _a;
        if (((_a = this.currentAnchor) === null || _a === void 0 ? void 0 : _a.id) !== anchor.id) {
            return;
        }
        if (Title.titleEmpty(anchor)) {
            return;
        }
        this.setText(anchor);
        this.changePositionByAnchor(anchor);
    };
    /**
     * 改变文字会 影响 box 的大小，需要重新设置位置
     * @param oldRect 原
     * @param newRect 新
     */
    Title.prototype.changePositionByAnchor = function (anchor) {
        this.box.style.left = anchor.x + 10 + 'px';
        this.box.style.top = anchor.y + 10 + 'px';
    };
    Title.titleEmpty = function (anchor) {
        return !anchor.title; // && !anchor.titleFn && !anchor.titleFnJs;
    };
    Title.prototype.show = function (anchor, pen) {
        if (Title.titleEmpty(anchor)) {
            return;
        }
        this.currentAnchor = anchor;
        this.setText(anchor);
        var pos = {
            x: pen.calculative.canvas.store.data.x + anchor.x,
            y: pen.calculative.canvas.store.data.y + anchor.y,
        };
        this.changePositionByAnchor(pos);
    };
    Title.prototype.hide = function () {
        this.box.style.left = '-9999px';
        this.box.innerText = '';
        this.currentAnchor = null;
    };
    Title.prototype.destroy = function () {
        this.box.onmouseleave = null;
    };
    return Title;
}());
export { Title };
//# sourceMappingURL=title.js.map