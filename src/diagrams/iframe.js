var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { setElemPosition } from '../pen';
import { deepClone, getRootDomain } from '../utils';
export function iframe(pen) {
    var _a;
    if (!pen.onDestroy) {
        pen.onDestroy = destory;
        pen.onMove = move;
        pen.onResize = move;
        pen.onRotate = move;
        pen.onValue = move;
        pen.onMouseMove = mouseMove;
        pen.onBeforeValue = beforeValue;
        pen.onRenderPenRaw = renderPenRaw;
    }
    if (!pen.calculative.singleton) {
        pen.calculative.singleton = {};
    }
    var worldRect = pen.calculative.worldRect;
    if (!pen.calculative.singleton.div) {
        var div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.outline = 'none';
        div.style.left = '-9999px';
        div.style.top = '-9999px';
        div.style.width = worldRect.width + 'px';
        div.style.height = worldRect.height + 'px';
        document.body.appendChild(div);
        (_a = pen.calculative.canvas.externalElements) === null || _a === void 0 ? void 0 : _a.parentElement.appendChild(div);
        setElemPosition(pen, div);
        pen.calculative.singleton.div = div;
        var iframe_1 = document.createElement('iframe');
        iframe_1.style.width = '100%';
        iframe_1.style.height = '100%';
        iframe_1.scrolling = pen.scrolling || 'no';
        iframe_1.frameBorder = '0';
        iframe_1.src = pen.iframe;
        pen.calculative.iframe = pen.iframe;
        div.appendChild(iframe_1);
        generateAroundDiv(pen);
        iframe_1.onload = function () {
            iframe_1.setAttribute('document.domain', '');
        };
    }
    if (pen.calculative.patchFlags) {
        setElemPosition(pen, pen.calculative.singleton.div);
    }
    pen.onRenderPenRaw(pen);
    return new Path2D();
}
function destory(pen) {
    if (pen.calculative.singleton && pen.calculative.singleton.div) {
        pen.calculative.singleton.div.remove();
        delete pen.calculative.singleton.div;
    }
}
function move(pen) {
    pen.calculative.singleton.div &&
        setElemPosition(pen, pen.calculative.singleton.div);
}
function beforeValue(pen, value) {
    if (value.iframe) {
        if (pen.calculative.singleton.div) {
            pen.calculative.singleton.div.children[0].src = value.iframe;
            pen.calculative.iframe = value.iframe;
        }
    }
    if (value.operationalRect ||
        value['operationalRect.x'] !== undefined ||
        value['operationalRect.y'] !== undefined ||
        value['operationalRect.width'] !== undefined ||
        value['operationalRect.height'] !== undefined) {
        if (!pen.operationalRect) {
            pen.operationalRect = {};
        }
        var _value = deepClone(value);
        if (!_value.operationalRect) {
            _value.operationalRect = {};
        }
        if (_value['operationalRect.x'] !== undefined) {
            _value.operationalRect.x = _value['operationalRect.x'];
        }
        if (_value['operationalRect.y'] !== undefined) {
            _value.operationalRect.y = _value['operationalRect.y'];
        }
        if (_value['operationalRect.width'] !== undefined) {
            _value.operationalRect.width = _value['operationalRect.width'];
        }
        if (_value['operationalRect.height'] !== undefined) {
            _value.operationalRect.height = _value['operationalRect.height'];
        }
        Object.assign(pen.operationalRect, _value.operationalRect);
        if (pen.calculative.singleton.div) {
            var length_1 = pen.calculative.singleton.div.children.length;
            if (length_1 === 1) {
                //没有创建
                generateAroundDiv(pen);
            }
            else {
                //有更新值
                pen.calculative.singleton.div.children[1].style.height =
                    pen.operationalRect.y * 100 + '%';
                pen.calculative.singleton.div.children[1].style.left =
                    pen.operationalRect.x * 100 + '%';
                pen.calculative.singleton.div.children[1].style.width =
                    pen.operationalRect.width * 100 + '%';
                pen.calculative.singleton.div.children[2].style.width =
                    (1 - pen.operationalRect.x - pen.operationalRect.width) * 100 + '%';
                pen.calculative.singleton.div.children[3].style.height =
                    (1 - pen.operationalRect.y - pen.operationalRect.height) * 100 + '%';
                pen.calculative.singleton.div.children[3].style.left =
                    pen.operationalRect.x * 100 + '%';
                pen.calculative.singleton.div.children[3].style.width =
                    pen.operationalRect.width * 100 + '%';
                pen.calculative.singleton.div.children[4].style.width =
                    pen.operationalRect.x * 100 + '%';
            }
        }
    }
    if (value.blur !== undefined) {
        for (var i = 1; i < 5; i++) {
            pen.calculative.singleton.div.children[i].style['backdrop-filter'] = "blur(" + (value.blur || 2) + "px)";
        }
    }
    if (value.blurBackground !== undefined) {
        for (var i = 1; i < 5; i++) {
            pen.calculative.singleton.div.children[i].style.backgroundColor =
                value.blurBackground;
        }
    }
    return value;
}
function mouseMove(pen, e) {
    if (!pen.calculative.canvas.store.data.locked && !pen.locked) {
        return;
    }
    if (initOperationalRect(pen.operationalRect)) {
        if (pen.calculative.zIndex < 5 &&
            e.x > pen.x + pen.width * pen.operationalRect.x &&
            e.x <
                pen.x +
                    pen.width * (pen.operationalRect.x + pen.operationalRect.width) &&
            e.y > pen.y + pen.height * pen.operationalRect.y &&
            e.y <
                pen.y +
                    pen.height * (pen.operationalRect.y + pen.operationalRect.height)) {
            if (pen.calculative.singleton.div) {
                var children = pen.calculative.singleton.div.parentNode.children;
                for (var i = 0; i < 6; i++) {
                    children[i].style.pointerEvents = 'none';
                }
            }
        }
    }
}
function initOperationalRect(operationalRect) {
    if (operationalRect) {
        if (!operationalRect.width || !operationalRect.height) {
            return false;
        }
        //默认居中
        if (operationalRect.x === undefined) {
            operationalRect.x = (1 - operationalRect.width) / 2;
        }
        if (operationalRect.y === undefined) {
            operationalRect.y = (1 - operationalRect.height) / 2;
        }
        return true;
    }
    else {
        return false;
    }
}
function generateAroundDiv(pen) {
    if (!initOperationalRect(pen.operationalRect)) {
        return;
    }
    var div = pen.calculative.singleton.div;
    if (!div) {
        return;
    }
    var top = document.createElement('div');
    top.style.position = 'absolute';
    top.style.left = pen.operationalRect.x * 100 + '%';
    top.style.top = '0px';
    top.style.width = pen.operationalRect.width * 100 + '%';
    top.style.height = pen.operationalRect.y * 100 + '%';
    top.style['backdrop-filter'] = "blur(" + (pen.blur || 2) + "px)";
    top.style.backgroundColor = pen.blurBackground;
    div.appendChild(top);
    var right = document.createElement('div');
    right.style.position = 'absolute';
    right.style.right = '0px';
    right.style.top = '0px';
    right.style.width =
        (1 - pen.operationalRect.x - pen.operationalRect.width) * 100 + '%';
    right.style.height = '100%';
    right.style['backdrop-filter'] = "blur(" + (pen.blur || 2) + "px)";
    right.style.backgroundColor = pen.blurBackground;
    div.appendChild(right);
    var bottom = document.createElement('div');
    bottom.style.position = 'absolute';
    bottom.style.left = pen.operationalRect.x * 100 + '%';
    bottom.style.bottom = '0px';
    bottom.style.width = pen.operationalRect.width * 100 + '%';
    bottom.style.height =
        (1 - pen.operationalRect.y - pen.operationalRect.height) * 100 + '%';
    bottom.style['backdrop-filter'] = "blur(" + (pen.blur || 2) + "px)";
    bottom.style.backgroundColor = pen.blurBackground;
    div.appendChild(bottom);
    var left = document.createElement('div');
    left.style.position = 'absolute';
    left.style.left = '0px';
    left.style.top = '0px';
    left.style.width = pen.operationalRect.x * 100 + '%';
    left.style.height = '100%';
    left.style['backdrop-filter'] = "blur(" + (pen.blur || 2) + "px)";
    left.style.backgroundColor = pen.blurBackground;
    div.appendChild(left);
    var mouseEnter = function () {
        updatePointerEvents(pen);
    };
    top.onmouseenter = mouseEnter;
    bottom.onmouseenter = mouseEnter;
    right.onmouseenter = mouseEnter;
    left.onmouseenter = mouseEnter;
    div.onmouseleave = mouseEnter;
    // }
}
function updatePointerEvents(pen) {
    if (!pen.calculative.canvas.store.data.locked && !pen.locked) {
        return;
    }
    if (pen.calculative.zIndex < 5) {
        var children = pen.calculative.singleton.div.parentNode.children;
        for (var i = 1; i < 6; i++) {
            children[i].style.pointerEvents = 'initial';
        }
    }
}
function renderPenRaw(pen) {
    if (pen.thumbImg) {
        if (!pen.calculative.img) {
            var img = new Image();
            img.crossOrigin =
                pen.crossOrigin === 'undefined'
                    ? undefined
                    : pen.crossOrigin || 'anonymous';
            img.src = pen.thumbImg;
            pen.calculative.img = img;
        }
    }
    else {
        if (pen.calculative.singleton && pen.calculative.singleton.div) {
            try {
                handleSaveImg(pen);
            }
            catch (e) {
                console.warn(e);
                pen.calculative.img = null;
            }
        }
    }
}
function handleSaveImg(pen) {
    return __awaiter(this, void 0, void 0, function () {
        var iframeHtml, iframeBody, iframeScrollY, iframeScrollX, fillContent, canvas, img;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    iframeHtml = pen.calculative.singleton.div.children[0].contentWindow;
                    iframeBody = iframeHtml.document.getElementsByTagName('body')[0];
                    iframeScrollY = iframeHtml.document.documentElement.scrollTop;
                    iframeScrollX = iframeHtml.document.documentElement.scrollLeft;
                    fillContent = document.createElement('div');
                    // 把需要转换成图片的元素内容赋给创建的元素
                    fillContent.innerHTML = iframeBody.outerHTML;
                    document.body.appendChild(fillContent);
                    iframeHtml.document.domain = getRootDomain();
                    if (!globalThis.html2canvas) return [3 /*break*/, 2];
                    return [4 /*yield*/, globalThis.html2canvas(fillContent, {
                            allowTaint: true,
                            useCORS: true,
                            width: pen.width,
                            height: pen.height,
                            x: iframeScrollX,
                            y: iframeScrollY,
                            // foreignObjectRendering: true,
                        })];
                case 1:
                    canvas = _a.sent();
                    img = new Image();
                    img.crossOrigin =
                        pen.crossOrigin === 'undefined'
                            ? undefined
                            : pen.crossOrigin || 'anonymous';
                    img.src = canvas.toDataURL('image/png', 0.1);
                    if (img.src.length > 10) {
                        pen.calculative.img = img;
                    }
                    document.body.removeChild(fillContent);
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=iframe.js.map