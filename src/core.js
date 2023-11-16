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
import { commonAnchors, commonPens, cube } from './diagrams';
import { Canvas } from './canvas';
import { calcInView, calcTextDrawRect, calcTextLines, calcTextRect, facePen, formatAttrs, getAllChildren, getFromAnchor, getParent, getToAnchor, getWords, LockState, PenType, renderPenRaw, setElemPosition, connectLine, nearestAnchor, setChildValue, isAncestor, isShowChild, } from './pen';
import { rotatePoint } from './point';
import { clearStore, EditType, globalStore, register, registerAnchors, registerCanvasDraw, useStore, } from './store';
import { formatPadding, loadCss, s8, valueInArray, valueInRange, } from './utils';
import { calcCenter, calcRelativeRect, getRect, rectInRect, } from './rect';
import { deepClone } from './utils/clone';
import { EventAction } from './event';
import { ViewMap } from './map';
import * as mqtt from 'mqtt/dist/mqtt.min.js';
import pkg from '../package.json';
import { lockedError } from './utils/error';
import { Scroll } from './scroll';
import { getter } from './utils/object';
import { queryURLParams } from './utils/url';
import { HotkeyType } from './data';
var Meta2d = /** @class */ (function () {
    function Meta2d(parent, opts) {
        var _this = this;
        if (opts === void 0) { opts = {}; }
        this.events = {};
        this.facePen = facePen;
        this.getWords = getWords;
        this.calcTextLines = calcTextLines;
        this.calcTextRect = calcTextRect;
        this.calcTextDrawRect = calcTextDrawRect;
        this.register = register;
        this.registerCanvasDraw = registerCanvasDraw;
        this.registerAnchors = registerAnchors;
        this.httpTimerList = [];
        this.onEvent = function (eventName, e) {
            switch (eventName) {
                case 'add':
                    {
                        e.forEach(function (pen) {
                            var _a;
                            (_a = pen.onAdd) === null || _a === void 0 ? void 0 : _a.call(pen, pen);
                        });
                    }
                    _this.onSizeUpdate();
                    break;
                case 'enter':
                    e && e.onMouseEnter && e.onMouseEnter(e, _this.canvas.mousePos);
                    _this.store.data.locked && _this.doEvent(e, eventName);
                    break;
                case 'leave':
                    e && e.onMouseLeave && e.onMouseLeave(e, _this.canvas.mousePos);
                    _this.store.data.locked && _this.doEvent(e, eventName);
                    break;
                case 'active':
                case 'inactive':
                    {
                        _this.store.data.locked &&
                            e.forEach(function (pen) {
                                _this.doEvent(pen, eventName);
                            });
                    }
                    break;
                case 'click':
                    e.pen && e.pen.onClick && e.pen.onClick(e.pen, _this.canvas.mousePos);
                    _this.store.data.locked && e.pen && _this.doEvent(e.pen, eventName);
                    break;
                case 'contextmenu':
                    e.pen &&
                        e.pen.onContextmenu &&
                        e.pen.onContextmenu(e.pen, _this.canvas.mousePos);
                    _this.store.data.locked && e.pen && _this.doEvent(e.pen, eventName);
                    break;
                case 'mousedown':
                    e.pen &&
                        e.pen.onMouseDown &&
                        e.pen.onMouseDown(e.pen, _this.canvas.mousePos);
                    _this.store.data.locked && e.pen && _this.doEvent(e.pen, eventName);
                    break;
                case 'mouseup':
                    e.pen &&
                        e.pen.onMouseUp &&
                        e.pen.onMouseUp(e.pen, _this.canvas.mousePos);
                    _this.store.data.locked && e.pen && _this.doEvent(e.pen, eventName);
                    break;
                case 'dblclick':
                    _this.store.data.locked && e.pen && _this.doEvent(e.pen, eventName);
                    break;
                case 'valueUpdate':
                    _this.store.data.locked && _this.doEvent(e, eventName);
                    _this.canvas.tooltip.updateText(e);
                    break;
                case 'update':
                case 'delete':
                case 'translatePens':
                case 'rotatePens':
                case 'resizePens':
                    _this.onSizeUpdate();
                    break;
            }
            if (_this.store.messageEvents[eventName]) {
                _this.store.messageEvents[eventName].forEach(function (item) {
                    item.event.actions.forEach(function (action) {
                        _this.events[action.action](item.pen, action);
                    });
                });
            }
        };
        this.doEvent = function (pen, eventName) {
            var _a, _b;
            if (!pen) {
                return;
            }
            (_a = pen.events) === null || _a === void 0 ? void 0 : _a.forEach(function (event) {
                var _a;
                if (event.actions && event.actions.length) {
                    if (event.name === eventName) {
                        //条件成立
                        var flag = false;
                        if (event.conditions && event.conditions.length) {
                            if (event.conditionType === 'and') {
                                flag = event.conditions.every(function (condition) {
                                    return _this.judgeCondition(pen, condition.key, condition);
                                });
                            }
                            else if (event.conditionType === 'or') {
                                flag = event.conditions.some(function (condition) {
                                    return _this.judgeCondition(pen, condition.key, condition);
                                });
                            }
                        }
                        else {
                            flag = true;
                        }
                        if (flag) {
                            event.actions.forEach(function (action) {
                                if (_this.events[action.action]) {
                                    _this.events[action.action](pen, action);
                                }
                            });
                        }
                    }
                }
                else {
                    if (_this.events[event.action] && event.name === eventName) {
                        var can = !((_a = event.where) === null || _a === void 0 ? void 0 : _a.type);
                        if (event.where) {
                            var _b = event.where, fn = _b.fn, fnJs = _b.fnJs, comparison = _b.comparison, key = _b.key, value = _b.value;
                            if (fn) {
                                can = fn(pen, { meta2d: _this });
                            }
                            else if (fnJs) {
                                try {
                                    event.where.fn = new Function('pen', 'context', fnJs);
                                }
                                catch (err) {
                                    console.error('Error: make function:', err);
                                }
                                if (event.where.fn) {
                                    can = event.where.fn(pen, { meta2d: _this });
                                }
                            }
                            else {
                                switch (comparison) {
                                    case '>':
                                        can = pen[key] > +value;
                                        break;
                                    case '>=':
                                        can = pen[key] >= +value;
                                        break;
                                    case '<':
                                        can = pen[key] < +value;
                                        break;
                                    case '<=':
                                        can = pen[key] <= +value;
                                        break;
                                    case '=':
                                    case '==':
                                        can = pen[key] == value;
                                        break;
                                    case '!=':
                                        can = pen[key] != value;
                                        break;
                                    case '[)':
                                        can = valueInRange(+pen[key], value);
                                        break;
                                    case '![)':
                                        can = !valueInRange(+pen[key], value);
                                        break;
                                    case '[]':
                                        can = valueInArray(+pen[key], value);
                                        break;
                                    case '![]':
                                        can = !valueInArray(+pen[key], value);
                                        break;
                                }
                            }
                        }
                        can && _this.events[event.action](pen, event);
                    }
                }
            });
            (_b = pen.realTimes) === null || _b === void 0 ? void 0 : _b.forEach(function (realTime) {
                var _a;
                (_a = realTime.triggers) === null || _a === void 0 ? void 0 : _a.forEach(function (trigger) {
                    var _a;
                    var flag = false;
                    if (trigger.conditionType === 'and') {
                        flag = trigger.conditions.every(function (condition) {
                            return _this.judgeCondition(pen, realTime.key, condition);
                        });
                    }
                    else if (trigger.conditionType === 'or') {
                        flag = trigger.conditions.some(function (condition) {
                            return _this.judgeCondition(pen, realTime.key, condition);
                        });
                    }
                    if (flag) {
                        (_a = trigger.actions) === null || _a === void 0 ? void 0 : _a.forEach(function (event) {
                            _this.events[event.action](pen, event);
                        });
                    }
                });
            });
            // 事件冒泡，子执行完，父执行
            _this.doEvent(_this.store.pens[pen.parentId], eventName);
        };
        this.renderPenRaw = renderPenRaw;
        this.setElemPosition = setElemPosition;
        this.store = useStore(s8());
        this.setOptions(opts);
        this.setDatabyOptions(opts);
        this.init(parent);
        this.register(commonPens());
        this.registerCanvasDraw({ cube: cube });
        this.registerAnchors(commonAnchors());
        globalThis.meta2d = this;
        this.initEventFns();
        this.store.emitter.on('*', this.onEvent);
    }
    Object.defineProperty(Meta2d.prototype, "beforeAddPen", {
        /**
         * @deprecated 改用 beforeAddPens
         */
        get: function () {
            return this.canvas.beforeAddPen;
        },
        /**
         * @deprecated 改用 beforeAddPens
         */
        set: function (fn) {
            this.canvas.beforeAddPen = fn;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Meta2d.prototype, "beforeAddPens", {
        get: function () {
            return this.canvas.beforeAddPens;
        },
        set: function (fn) {
            this.canvas.beforeAddPens = fn;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Meta2d.prototype, "beforeAddAnchor", {
        get: function () {
            return this.canvas.beforeAddAnchor;
        },
        set: function (fn) {
            this.canvas.beforeAddAnchor = fn;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Meta2d.prototype, "beforeRemovePens", {
        get: function () {
            return this.canvas.beforeRemovePens;
        },
        set: function (fn) {
            this.canvas.beforeRemovePens = fn;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Meta2d.prototype, "beforeRemoveAnchor", {
        get: function () {
            return this.canvas.beforeRemoveAnchor;
        },
        set: function (fn) {
            this.canvas.beforeRemoveAnchor = fn;
        },
        enumerable: false,
        configurable: true
    });
    Meta2d.prototype.setOptions = function (opts) {
        if (opts === void 0) { opts = {}; }
        if (opts.grid !== undefined ||
            opts.gridColor !== undefined ||
            opts.gridSize !== undefined) {
            this.setGrid({
                grid: opts.grid,
                gridColor: opts.gridColor,
                gridSize: opts.gridSize,
            });
        }
        if (opts.rule !== undefined || opts.ruleColor !== undefined) {
            this.setRule({
                rule: opts.rule,
                ruleColor: opts.ruleColor,
            });
        }
        if (opts.resizeMode !== undefined) {
            if (!opts.resizeMode) {
                this.canvas.hotkeyType = HotkeyType.None;
            }
        }
        this.store.options = Object.assign(this.store.options, opts);
        if (this.canvas && opts.scroll !== undefined) {
            if (opts.scroll) {
                !this.canvas.scroll && (this.canvas.scroll = new Scroll(this.canvas));
                this.canvas.scroll.show();
            }
            else {
                this.canvas.scroll && this.canvas.scroll.hide();
            }
        }
    };
    Meta2d.prototype.getOptions = function () {
        return this.store.options;
    };
    Meta2d.prototype.setDatabyOptions = function (options) {
        if (options === void 0) { options = {}; }
        var color = options.color, activeColor = options.activeColor, activeBackground = options.activeBackground, grid = options.grid, gridColor = options.gridColor, gridSize = options.gridSize, fromArrow = options.fromArrow, toArrow = options.toArrow, rule = options.rule, ruleColor = options.ruleColor, textColor = options.textColor;
        this.setRule({ rule: rule, ruleColor: ruleColor });
        this.setGrid({
            grid: grid,
            gridColor: gridColor,
            gridSize: gridSize,
        });
        this.store.data = Object.assign(this.store.data, {
            textColor: textColor,
            color: color,
            activeColor: activeColor,
            activeBackground: activeBackground,
            fromArrow: fromArrow,
            toArrow: toArrow,
        });
    };
    Meta2d.prototype.init = function (parent) {
        if (typeof parent === 'string') {
            this.canvas = new Canvas(this, document.getElementById(parent), this.store);
        }
        else {
            this.canvas = new Canvas(this, parent, this.store);
        }
        this.resize();
        this.canvas.listen();
    };
    Meta2d.prototype.initEventFns = function () {
        var _this = this;
        this.events[EventAction.Link] = function (pen, e) {
            var _a;
            if (window && e.value && typeof e.value === 'string') {
                window.open(e.value, (_a = e.params) !== null && _a !== void 0 ? _a : '_blank');
                return;
            }
            console.warn('[meta2d] Link param is not a string');
        };
        this.events[EventAction.SetProps] = function (pen, e) {
            // TODO: 若频繁地触发，重复 render 可能带来性能问题，待考虑
            var value = e.value;
            if (value && typeof value === 'object') {
                var pens = e.params ? _this.find(e.params) : _this.find(pen.id);
                pens.forEach(function (pen) {
                    if (value.hasOwnProperty('visible')) {
                        _this.setVisible(pen, value.visible);
                    }
                    _this.setValue(__assign({ id: pen.id }, value), { render: false, doEvent: false });
                });
                _this.render();
                return;
            }
            console.warn('[meta2d] SetProps value is not an object');
        };
        this.events[EventAction.StartAnimate] = function (pen, e) {
            if (e.targetType && e.params) {
                _this.startAnimate(e.value || [pen], e.params);
                return;
            }
            if (!e.value || typeof e.value === 'string') {
                _this.startAnimate(e.value || [pen]);
                return;
            }
            console.warn('[meta2d] StartAnimate value is not a string');
        };
        this.events[EventAction.PauseAnimate] = function (pen, e) {
            if (!e.value || typeof e.value === 'string') {
                _this.pauseAnimate(e.value || [pen]);
                return;
            }
            console.warn('[meta2d] PauseAnimate value is not a string');
        };
        this.events[EventAction.StopAnimate] = function (pen, e) {
            if (!e.value || typeof e.value === 'string') {
                _this.stopAnimate(e.value || [pen]);
                return;
            }
            console.warn('[meta2d] StopAnimate event value is not a string');
        };
        this.events[EventAction.StartVideo] = function (pen, e) {
            if (!e.value || typeof e.value === 'string') {
                _this.startVideo(e.value || [pen]);
                return;
            }
            console.warn('[meta2d] StartVideo value is not a string');
        };
        this.events[EventAction.PauseVideo] = function (pen, e) {
            if (!e.value || typeof e.value === 'string') {
                _this.pauseVideo(e.value || [pen]);
                return;
            }
            console.warn('[meta2d] PauseVideo value is not a string');
        };
        this.events[EventAction.StopVideo] = function (pen, e) {
            if (!e.value || typeof e.value === 'string') {
                _this.stopVideo(e.value || [pen]);
                return;
            }
            console.warn('[meta2d] StopVideo event value is not a string');
        };
        this.events[EventAction.JS] = function (pen, e) {
            var _a;
            if (e.value && !e.fn) {
                try {
                    if (typeof e.value !== 'string') {
                        throw new Error('[meta2d] Function value must be string');
                    }
                    var fnJs = e.value;
                    e.fn = new Function('pen', 'params', 'context', fnJs);
                }
                catch (err) {
                    console.error('[meta2d]: Error on make a function:', err);
                }
            }
            (_a = e.fn) === null || _a === void 0 ? void 0 : _a.call(e, pen, e.params, { meta2d: _this, eventName: e.name });
        };
        this.events[EventAction.GlobalFn] = function (pen, e) {
            if (typeof e.value !== 'string') {
                console.warn('[meta2d] GlobalFn value must be a string');
                return;
            }
            if (globalThis[e.value]) {
                globalThis[e.value](pen, e.params);
            }
        };
        this.events[EventAction.Emit] = function (pen, e) {
            if (typeof e.value !== 'string') {
                console.warn('[meta2d] Emit value must be a string');
                return;
            }
            _this.store.emitter.emit(e.value, {
                pen: pen,
                params: e.params,
                eventName: e.name,
            });
        };
        this.events[EventAction.SendPropData] = function (pen, e) {
            var value = deepClone(e.value);
            if (value && typeof value === 'object') {
                var _pen = e.params ? _this.findOne(e.params) : pen;
                for (var key in value) {
                    if (!value[key]) {
                        value[key] = _pen[key];
                    }
                }
                value.id = _pen.id;
                _this.doSendDataEvent(value, e.extend);
                return;
            }
            console.warn('[meta2d] SendPropData value is not an object');
        };
        this.events[EventAction.SendVarData] = function (pen, e) {
            var value = deepClone(e.value);
            if (value && typeof value === 'object') {
                var _pen = e.params ? _this.findOne(e.params) : pen;
                var array = [];
                var _loop_1 = function (key) {
                    var obj = {
                        dataId: key,
                        value: value[key],
                    };
                    if (!obj.value) {
                        var oneForm = _pen.form.find(function (_item) {
                            return _item.dataIds &&
                                _item.dataIds.dataId === obj.dataId;
                        });
                        if (oneForm) {
                            obj.value = _pen[oneForm.key];
                        }
                    }
                    array.push(obj);
                };
                for (var key in value) {
                    _loop_1(key);
                }
                _this.doSendDataEvent(array, e.extend);
                return;
            }
            console.warn('[meta2d] SendVarData value is not an object');
        };
        this.events[EventAction.Navigator] = function (pen, e) {
            if (e.value && typeof e.value === 'string') {
                _this.navigatorTo(e.value);
            }
        };
        this.events[EventAction.Dialog] = function (pen, e) {
            if (e.params &&
                typeof e.params === 'string' &&
                e.value &&
                typeof e.value === 'string') {
                _this.canvas.dialog.show(e.value, e.params);
            }
        };
        this.events[EventAction.SendData] = function (pen, e) {
            var value = deepClone(e.value);
            if (value && typeof value === 'object') {
                if (e.targetType === 'id') {
                    var _pen = e.params ? _this.findOne(e.params) : pen;
                    for (var key in value) {
                        if (!value[key]) {
                            value[key] = _pen[key];
                        }
                    }
                    value.id = _pen.id;
                    _this.sendDataToNetWork(value, e.network);
                    return;
                }
            }
        };
        this.events[EventAction.PostMessage] = function (pen, e) {
            if (typeof e.value !== 'string') {
                console.warn('[meta2d] Emit value must be a string');
                return;
            }
            var _pen = e.params ? _this.findOne(e.params) : pen;
            if (_pen.name !== 'iframe' || !_pen.iframe) {
                console.warn('不是嵌入页面');
                return;
            }
            var params = queryURLParams(_pen.iframe.split('?')[1]);
            _pen.calculative.singleton.div.children[0].contentWindow.postMessage(JSON.stringify({
                name: e.value,
                id: params.id,
            }), '*');
            return;
        };
        this.events[EventAction.PostMessageToParent] = function (pen, e) {
            if (typeof e.value !== 'string') {
                console.warn('[meta2d] Emit value must be a string');
                return;
            }
            window.parent.postMessage(JSON.stringify(e.value), '*');
            return;
        };
    };
    Meta2d.prototype.navigatorTo = function (id) {
        if (!id) {
            return;
        }
        var href = window.location.href;
        var arr = href.split('id=');
        if (arr.length > 1) {
            var idx = arr[1].indexOf('&');
            if (idx === -1) {
                window.location.href = arr[0] + 'id=' + id;
            }
            else {
                window.location.href = arr[0] + 'id=' + id + arr[1].slice(idx);
            }
        }
    };
    Meta2d.prototype.doSendDataEvent = function (value, topics) {
        var _this = this;
        var data = JSON.stringify(value);
        if (this.mqttClient && this.mqttClient.connected) {
            if (topics) {
                topics.split(',').forEach(function (topic) {
                    _this.mqttClient.publish(topic, data);
                });
            }
            else {
                this.store.data.mqttTopics &&
                    this.store.data.mqttTopics.split(',').forEach(function (topic) {
                        _this.mqttClient.publish(topic, data);
                    });
            }
        }
        if (this.websocket && this.websocket.readyState === 1) {
            this.websocket.send(data);
        }
        if (this.store.data.https || this.store.data.http) {
            this.sendDatabyHttp(data);
        }
        this.store.emitter.emit('sendData', data);
    };
    Meta2d.prototype.sendDataToNetWork = function (value, _network) {
        return __awaiter(this, void 0, void 0, function () {
            var network, i, keys, params, res, clients_1, mqttClient_1, websockets, websocket_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        network = deepClone(_network);
                        if (!network.url) {
                            return [2 /*return*/];
                        }
                        if (!(network.protocol === 'http')) return [3 /*break*/, 2];
                        if (typeof network.headers === 'object') {
                            for (i in network.headers) {
                                keys = network.headers[i].match(/(?<=\$\{).*?(?=\})/g);
                                if (keys) {
                                    network.headers[i] = network.headers[i].replace("${" + keys[0] + "}", this.getDynamicParam(keys[0]));
                                }
                            }
                        }
                        params = undefined;
                        if (network.method === 'GET') {
                            params =
                                '?' +
                                    Object.keys(value)
                                        .map(function (key) { return key + '=' + value[key]; })
                                        .join('&');
                        }
                        return [4 /*yield*/, fetch(network.url + (params ? params : ''), {
                                headers: network.headers || {},
                                method: network.method,
                                body: network.method === 'POST' ? JSON.stringify(value) : undefined,
                            })];
                    case 1:
                        res = _a.sent();
                        if (res.ok) {
                            console.info('http消息发送成功');
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        if (network.protocol === 'mqtt') {
                            clients_1 = this.mqttClients.filter(function (client) { return client.options.href === network.url; });
                            if (clients_1 && clients_1.length) {
                                if (clients_1[0].connected) {
                                    network.topics.split(',').forEach(function (topic) {
                                        clients_1[0].publish(topic, value);
                                    });
                                }
                            }
                            else {
                                mqttClient_1 = mqtt.connect(network.url, network.options);
                                mqttClient_1.on('connect', function () {
                                    console.info('mqtt连接成功');
                                    network.topics.split(',').forEach(function (topic) {
                                        mqttClient_1.publish(topic, value);
                                        mqttClient_1 === null || mqttClient_1 === void 0 ? void 0 : mqttClient_1.end();
                                    });
                                });
                            }
                        }
                        else if (network.protocol === 'websocket') {
                            websockets = this.websockets.filter(function (socket) { return socket.url === network.url; });
                            if (websockets && websockets.length) {
                                if (websockets[0].readyState === 1) {
                                    websockets[0].send(value);
                                }
                            }
                            else {
                                websocket_1 = new WebSocket(network.url, network.protocols || undefined);
                                websocket_1.onopen = function () {
                                    console.info('websocket连接成功');
                                    websocket_1.send(value);
                                    setTimeout(function () {
                                        websocket_1.close();
                                    }, 100);
                                };
                            }
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Meta2d.prototype.resize = function (width, height) {
        this.canvas.resize(width, height);
        this.render();
        this.store.emitter.emit('resize', { width: width, height: height });
        if (this.canvas.scroll && this.canvas.scroll.isShow) {
            this.canvas.scroll.init();
        }
    };
    /**
     *
     * @param emit 是否发送消息
     */
    Meta2d.prototype.addPen = function (pen, history, emit) {
        if (emit === void 0) { emit = true; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.canvas.addPen(pen, history, emit)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Meta2d.prototype.addPens = function (pens, history) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.canvas.addPens(pens, history)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Meta2d.prototype.render = function (patchFlags) {
        var _a;
        (_a = this.canvas) === null || _a === void 0 ? void 0 : _a.render(patchFlags);
    };
    Meta2d.prototype.setBackgroundImage = function (url, data) {
        var _a, _b, _c, _e;
        return __awaiter(this, void 0, void 0, function () {
            function loadImage(url) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, new Promise(function (resolve) {
                                var img = new Image();
                                img.src = url;
                                if (that.store.options.cdn &&
                                    !(url.startsWith('http') ||
                                        url.startsWith('//') ||
                                        url.startsWith('data:image'))) {
                                    img.src = that.store.options.cdn + url;
                                }
                                img.crossOrigin = 'anonymous';
                                img.onload = function () {
                                    resolve(img);
                                };
                            })];
                    });
                });
            }
            var that, width, height, img;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        that = this;
                        this.store.data.bkImage = url;
                        width = (data === null || data === void 0 ? void 0 : data.width) || ((_a = this.store.data) === null || _a === void 0 ? void 0 : _a.width) || ((_b = this.store.options) === null || _b === void 0 ? void 0 : _b.width);
                        height = (data === null || data === void 0 ? void 0 : data.height) || ((_c = this.store.data) === null || _c === void 0 ? void 0 : _c.height) || ((_e = this.store.options) === null || _e === void 0 ? void 0 : _e.height);
                        if (width && height) {
                            this.canvas.canvasTemplate.canvas.style.backgroundImage = null;
                            this.canvas && (this.canvas.canvasTemplate.bgPatchFlags = true);
                        }
                        else {
                            this.canvas.canvasTemplate.canvas.style.backgroundImage = url
                                ? "url('" + url + "')"
                                : '';
                        }
                        if (!url) return [3 /*break*/, 2];
                        return [4 /*yield*/, loadImage(url)];
                    case 1:
                        img = _f.sent();
                        // 用作 toPng 的绘制
                        this.store.bkImg = img;
                        if (width && height) {
                            if (this.canvas) {
                                this.canvas.canvasTemplate.init();
                                this.render();
                            }
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        this.store.bkImg = null;
                        _f.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Meta2d.prototype.setBackgroundColor = function (color) {
        if (color === void 0) { color = this.store.data.background; }
        this.store.data.background = color;
        // this.store.patchFlagsBackground = true;
        this.canvas && (this.canvas.canvasTemplate.bgPatchFlags = true);
    };
    Meta2d.prototype.setGrid = function (_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.grid, grid = _c === void 0 ? this.store.data.grid : _c, _e = _b.gridColor, gridColor = _e === void 0 ? this.store.data.gridColor : _e, _f = _b.gridSize, gridSize = _f === void 0 ? this.store.data.gridSize : _f, _g = _b.gridRotate, gridRotate = _g === void 0 ? this.store.data.gridRotate : _g;
        this.store.data.grid = grid;
        this.store.data.gridColor = gridColor;
        this.store.data.gridSize = gridSize;
        this.store.data.gridRotate = gridRotate;
        // this.store.patchFlagsBackground = true;
        this.canvas && (this.canvas.canvasTemplate.bgPatchFlags = true);
    };
    Meta2d.prototype.setRule = function (_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.rule, rule = _c === void 0 ? this.store.data.rule : _c, _e = _b.ruleColor, ruleColor = _e === void 0 ? this.store.data.ruleColor : _e;
        this.store.data.rule = rule;
        this.store.data.ruleColor = ruleColor;
        this.store.patchFlagsTop = true;
    };
    Meta2d.prototype.open = function (data, render) {
        var e_1, _a, e_2, _b, e_3, _c, e_4, _e;
        var _this = this;
        if (render === void 0) { render = true; }
        this.clear(false, data.template);
        this.canvas.autoPolylineFlag = true;
        if (data) {
            this.setBackgroundImage(data.bkImage, data);
            Object.assign(this.store.data, data);
            this.store.data.pens = [];
            try {
                // 第一遍赋初值
                for (var _f = __values(data.pens), _g = _f.next(); !_g.done; _g = _f.next()) {
                    var pen = _g.value;
                    if (!pen.id) {
                        pen.id = s8();
                    }
                    !pen.calculative && (pen.calculative = { canvas: this.canvas });
                    this.store.pens[pen.id] = pen;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_g && !_g.done && (_a = _f.return)) _a.call(_f);
                }
                finally { if (e_1) throw e_1.error; }
            }
            try {
                for (var _h = __values(data.pens), _j = _h.next(); !_j.done; _j = _h.next()) {
                    var pen = _j.value;
                    this.canvas.makePen(pen);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_j && !_j.done && (_b = _h.return)) _b.call(_h);
                }
                finally { if (e_2) throw e_2.error; }
            }
            try {
                for (var _k = __values(data.pens), _l = _k.next(); !_l.done; _l = _k.next()) {
                    var pen = _l.value;
                    this.canvas.updateLines(pen);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_l && !_l.done && (_c = _k.return)) _c.call(_k);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
        this.canvas.patchFlagsLines.forEach(function (pen) {
            if (pen.type) {
                _this.canvas.initLineRect(pen);
            }
        });
        if (!this.store.data.template) {
            this.store.data.template = s8();
        }
        if (!render) {
            this.canvas.opening = true;
        }
        this.initBindDatas();
        this.initBinds();
        this.initMessageEvents();
        this.render();
        this.listenSocket();
        this.connectSocket();
        this.connectNetwork();
        this.startAnimate();
        this.startVideo();
        this.doInitJS();
        if (this.store.data.iconUrls) {
            try {
                for (var _m = __values(this.store.data.iconUrls), _o = _m.next(); !_o.done; _o = _m.next()) {
                    var item = _o.value;
                    loadCss(item, function () {
                        _this.render();
                    });
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_o && !_o.done && (_e = _m.return)) _e.call(_m);
                }
                finally { if (e_4) throw e_4.error; }
            }
        }
        this.canvas.autoPolylineFlag = false;
        this.store.emitter.emit('opened');
        if (this.canvas.scroll && this.canvas.scroll.isShow) {
            this.canvas.scroll.init();
        }
    };
    Meta2d.prototype.cacheData = function (id) {
        if (id && this.store.options.cacheLength) {
            var index = this.store.cacheDatas.findIndex(function (item) { return item.data && item.data._id === id; });
            if (index === -1) {
                this.store.cacheDatas.push({
                    data: deepClone(this.store.data, true),
                    // offscreen: new Array(2),
                    // flag: new Array(2)
                });
                if (this.store.cacheDatas.length > this.store.options.cacheLength) {
                    this.store.cacheDatas.shift();
                }
            }
            else {
                var cacheDatas = this.store.cacheDatas.splice(index, 1)[0];
                this.store.cacheDatas.push(cacheDatas);
            }
        }
    };
    Meta2d.prototype.loadCacheData = function (id) {
        var _this = this;
        var index = this.store.cacheDatas.findIndex(function (item) { return item.data && item.data._id === id; });
        if (index === -1) {
            return;
        }
        // const ctx = this.canvas.canvas.getContext('2d');
        // ctx.clearRect(0, 0, this.canvas.canvas.width, this.canvas.canvas.height);
        // for (let offs of this.store.cacheDatas[index].offscreen) {
        //   if (offs) {
        //     ctx.drawImage(offs, 0, 0, this.canvas.width, this.canvas.height);
        //   }
        // }
        // ctx.clearRect(0, 0, this.canvas.canvas.width, this.canvas.canvas.height);
        this.store.data = this.store.cacheDatas[index].data;
        this.setBackgroundImage(this.store.data.bkImage);
        this.store.pens = {};
        this.store.data.pens.forEach(function (pen) {
            pen.calculative.canvas = _this.canvas;
            _this.store.pens[pen.id] = pen;
            globalStore.path2dDraws[pen.name] &&
                _this.store.path2dMap.set(pen, globalStore.path2dDraws[pen.name](pen));
            pen.type &&
                _this.store.path2dMap.set(pen, globalStore.path2dDraws[pen.name](pen));
            if (pen.image) {
                pen.calculative.imageDrawed = false;
                _this.canvas.loadImage(pen);
            }
        });
        this.render();
    };
    Meta2d.prototype.initBindDatas = function () {
        var _this = this;
        this.store.bindDatas = {};
        this.store.data.pens.forEach(function (pen) {
            var _a;
            (_a = pen.form) === null || _a === void 0 ? void 0 : _a.forEach(function (formItem) {
                var dataIds;
                if (formItem.dataIds) {
                    if (Array.isArray(formItem.dataIds)) {
                        dataIds = formItem.dataIds;
                    }
                    else {
                        dataIds = [formItem.dataIds];
                    }
                }
                dataIds === null || dataIds === void 0 ? void 0 : dataIds.forEach(function (item) {
                    if (!_this.store.bindDatas[item.dataId]) {
                        _this.store.bindDatas[item.dataId] = [];
                    }
                    _this.store.bindDatas[item.dataId].push({
                        id: pen.id,
                        formItem: formItem,
                    });
                });
            });
        });
    };
    Meta2d.prototype.initBinds = function () {
        var _this = this;
        this.store.bind = {};
        this.store.data.pens.forEach(function (pen) {
            var _a;
            (_a = pen.realTimes) === null || _a === void 0 ? void 0 : _a.forEach(function (realTime) {
                if (realTime.bind && realTime.bind.id) {
                    if (!_this.store.bind[realTime.bind.id]) {
                        _this.store.bind[realTime.bind.id] = [];
                    }
                    _this.store.bind[realTime.bind.id].push({
                        id: pen.id,
                        key: realTime.key,
                    });
                }
            });
        });
    };
    Meta2d.prototype.connectSocket = function () {
        this.connectWebsocket();
        this.connectMqtt();
        this.connectHttp();
    };
    /**
     * open 后执行初始化 Js ，每个图纸可配置一个初始化 js
     */
    Meta2d.prototype.doInitJS = function () {
        var initJs = this.store.data.initJs;
        if (initJs && initJs.trim()) {
            try {
                var fn = new Function('context', initJs);
                fn({ meta2d: this });
            }
            catch (e) {
                console.warn('initJs error', e);
            }
        }
    };
    Meta2d.prototype.drawLine = function (lineName) {
        lineName && lockedError(this.store);
        this.canvas.drawingLineName = lineName;
    };
    Meta2d.prototype.alignPenToGrid = function (pen) {
        this.canvas.alignPenToGrid(pen);
    };
    Meta2d.prototype.drawingPencil = function () {
        this.canvas.drawingPencil();
    };
    Meta2d.prototype.stopPencil = function () {
        this.canvas.stopPencil();
    };
    Meta2d.prototype.lock = function (lock) {
        this.store.data.locked = lock;
        this.finishDrawLine(true);
        this.canvas.drawingLineName = '';
        this.stopPencil();
        //恢复可选状态
        this.store.data.pens.forEach(function (pen) {
            if (pen.externElement === true) {
                pen.onMove && pen.onMove(pen);
            }
        });
        if (lock > 0) {
            this.initMessageEvents();
        }
    };
    // end  - 当前鼠标位置，是否作为终点
    Meta2d.prototype.finishDrawLine = function (end) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.canvas.finishDrawline(end)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Meta2d.prototype.finishPencil = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.canvas.finishPencil()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Meta2d.prototype.updateLineType = function (pen, lineName) {
        if (!pen || pen.name != 'line' || !lineName || !this.canvas[lineName]) {
            return;
        }
        pen.lineName = lineName;
        var from = getFromAnchor(pen);
        var to = getToAnchor(pen);
        from.prev = undefined;
        from.next = undefined;
        to.prev = undefined;
        to.next = undefined;
        pen.calculative.worldAnchors = [from, to];
        pen.calculative.activeAnchor = from;
        this.canvas[lineName](this.store, pen, to);
        if (pen.lineName === 'curve') {
            from.prev = {
                penId: from.penId,
                x: from.x - 50,
                y: from.y,
            };
            from.next = {
                penId: from.penId,
                x: from.x + 50,
                y: from.y,
            };
            to.prev = {
                penId: to.penId,
                x: to.x - 50,
                y: to.y,
            };
            to.next = {
                penId: to.penId,
                x: to.x + 50,
                y: to.y,
            };
        }
        pen.calculative.activeAnchor = undefined;
        this.canvas.initLineRect(pen);
        this.render();
    };
    Meta2d.prototype.addDrawLineFn = function (fnName, fn) {
        this.canvas[fnName] = fn;
        this.canvas.drawLineFns.push(fnName);
    };
    Meta2d.prototype.removeDrawLineFn = function (fnName) {
        var index = this.canvas.drawLineFns.indexOf(fnName);
        if (index > -1) {
            this.canvas.drawLineFns.splice(index, 1);
        }
    };
    Meta2d.prototype.showMagnifier = function () {
        this.canvas.showMagnifier();
    };
    Meta2d.prototype.hideMagnifier = function () {
        this.canvas.hideMagnifier();
    };
    Meta2d.prototype.toggleMagnifier = function () {
        this.canvas.toggleMagnifier();
    };
    /**
     * 擦除画布，释放 store 上的 pens
     * @param render 是否重绘
     */
    Meta2d.prototype.clear = function (render, template) {
        var e_5, _a;
        var _b;
        if (render === void 0) { render = true; }
        try {
            for (var _c = __values(this.store.data.pens), _e = _c.next(); !_e.done; _e = _c.next()) {
                var pen = _e.value;
                (_b = pen.onDestroy) === null || _b === void 0 ? void 0 : _b.call(pen, pen);
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_5) throw e_5.error; }
        }
        clearStore(this.store, template);
        this.hideInput();
        this.canvas.tooltip.hide();
        if (this.map && this.map.isShow) {
            this.map.show();
            this.map.setView();
        }
        this.canvas.clearCanvas();
        sessionStorage.removeItem('page');
        this.store.clipboard = undefined;
        // 非必要，为的是 open 时重绘 背景与网格
        // this.store.patchFlagsBackground = true;
        if (!this.store.sameTemplate) {
            this.canvas.canvasTemplate.bgPatchFlags = true;
        }
        this.store.patchFlagsTop = true;
        this.setBackgroundImage(undefined);
        render && this.render();
    };
    Meta2d.prototype.emit = function (type, event) {
        this.store.emitter.emit(type, event);
    };
    Meta2d.prototype.on = function (type, handler) {
        this.store.emitter.on(type, handler);
        return this;
    };
    Meta2d.prototype.off = function (type, handler) {
        this.store.emitter.off(type, handler);
        return this;
    };
    // customeDock = (store, rect, pens, offset) => {xDock, yDock}
    // customDock return:
    // {
    //   xDock: {x, y, step, prev, penId},
    //   yDock: {x, y, step, prev, penId},
    // }
    // xDock，yDock - 水平或垂直方向的参考线
    // prev - 参考线的起点
    // x,y - 参考线的终点
    // step - 自动吸附需要的偏移量
    // penId - 参考线的笔
    Meta2d.prototype.registerMoveDock = function (dock) {
        this.canvas.customMoveDock = dock;
    };
    /**
     * 参数同方法 registerMoveDock ，最后一个参数由 offset 偏移修改成了当前 resize 的点
     */
    Meta2d.prototype.registerResizeDock = function (dock) {
        this.canvas.customResizeDock = dock;
    };
    Meta2d.prototype.find = function (idOrTag) {
        return this.canvas.find(idOrTag);
    };
    Meta2d.prototype.findOne = function (idOrTag) {
        return this.canvas.findOne(idOrTag);
    };
    Meta2d.prototype.getPenRect = function (pen) {
        return this.canvas.getPenRect(pen);
    };
    Meta2d.prototype.setPenRect = function (pen, rect, render) {
        if (render === void 0) { render = true; }
        this.canvas.setPenRect(pen, rect, render);
    };
    Meta2d.prototype.startAnimate = function (idOrTagOrPens, params) {
        var _this = this;
        this.stopAnimate(idOrTagOrPens);
        var pens;
        // 没有参数 则播放有自动播放属性的动画
        if (!idOrTagOrPens) {
            pens = this.store.data.pens.filter(function (pen) {
                return (((pen.type || pen.frames) && pen.autoPlay) ||
                    (pen.animations &&
                        pen.animations.length &&
                        pen.animations.findIndex(function (i) { return i.autoPlay; }) !== -1));
            });
        }
        else if (typeof idOrTagOrPens === 'string') {
            pens = this.find(idOrTagOrPens);
        }
        else {
            pens = idOrTagOrPens;
        }
        pens.forEach(function (pen) {
            var _a;
            if (pen.calculative.pause) {
                var d = Date.now() - pen.calculative.pause;
                pen.calculative.pause = undefined;
                pen.calculative.frameStart += d;
                pen.calculative.frameEnd += d;
            }
            else {
                var index = -1;
                if (params !== undefined && pen.animations) {
                    if (typeof params === 'string') {
                        index = pen.animations.findIndex(function (animation) { return animation.name === params; });
                        if (index === -1) {
                            return;
                        }
                    }
                    else if (typeof params === 'number') {
                        if (pen.animations.length > params) {
                            index = params;
                        }
                        else {
                            return;
                        }
                    }
                }
                else if (params === undefined) {
                    index = (_a = pen.animations) === null || _a === void 0 ? void 0 : _a.findIndex(function (i) { return i.autoPlay; });
                }
                if (index !== -1 && index !== undefined) {
                    var animate = deepClone(pen.animations[index]);
                    delete animate.name;
                    animate.currentAnimation = index;
                    if (!pen.type && animate.frames) {
                        animate.showDuration = _this.calcAnimateDuration(animate);
                    }
                    //animations成立
                    _this.setValue(__assign({ id: pen.id }, animate), {
                        doEvent: false,
                        history: false,
                    });
                }
                _this.store.animates.add(pen);
                if (!pen.type) {
                    _this.store.animateMap.set(pen, pen.calculative.canvas.getFrameProps(pen));
                }
            }
        });
        this.canvas.canvasImage.init();
        this.canvas.canvasImageBottom.init();
        this.canvas.animate();
    };
    Meta2d.prototype.pauseAnimate = function (idOrTagOrPens) {
        var pens = [];
        if (!idOrTagOrPens) {
            this.store.animates.forEach(function (pen) {
                pens.push(pen);
            });
        }
        else if (typeof idOrTagOrPens === 'string') {
            pens = this.find(idOrTagOrPens);
        }
        else {
            pens = idOrTagOrPens;
        }
        pens.forEach(function (pen) {
            if (!pen.calculative.pause) {
                pen.calculative.pause = Date.now();
            }
        });
    };
    Meta2d.prototype.stopAnimate = function (idOrTagOrPens) {
        var _this = this;
        var pens = [];
        if (!idOrTagOrPens) {
            this.store.animates.forEach(function (pen) {
                pens.push(pen);
            });
        }
        else if (typeof idOrTagOrPens === 'string') {
            pens = this.find(idOrTagOrPens);
        }
        else {
            pens = idOrTagOrPens;
        }
        pens.forEach(function (pen) {
            pen.currentAnimation = undefined;
            pen.calculative.pause = undefined;
            pen.calculative.start = undefined;
            pen.calculative.duration = undefined;
            pen.calculative.animatePos = 0;
            _this.store.animates.delete(pen);
            _this.canvas.restoreNodeAnimate(pen);
            _this.canvas.updateLines(pen);
            _this.store.animateMap.delete(pen);
        });
        this.initImageCanvas(pens);
        setTimeout(function () {
            var _a;
            (_a = _this.canvas) === null || _a === void 0 ? void 0 : _a.calcActiveRect();
            _this.render();
        }, 20);
    };
    Meta2d.prototype.startVideo = function (idOrTagOrPens) {
        var pens;
        if (!idOrTagOrPens) {
            pens = this.store.data.pens.filter(function (pen) {
                return (pen.video || pen.audio) && pen.autoPlay;
            });
        }
        else if (typeof idOrTagOrPens === 'string') {
            pens = this.find(idOrTagOrPens);
        }
        else {
            pens = idOrTagOrPens;
        }
        pens.forEach(function (pen) {
            var _a, _b;
            (_a = pen.calculative.media) === null || _a === void 0 ? void 0 : _a.play();
            (_b = pen.onStartVideo) === null || _b === void 0 ? void 0 : _b.call(pen, pen);
        });
    };
    Meta2d.prototype.pauseVideo = function (idOrTagOrPens) {
        var pens = [];
        if (!idOrTagOrPens) {
            //TODO 寻找所有 而不是正在播放的
            pens = this.store.data.pens.filter(function (pen) {
                return (pen.video || pen.audio) && pen.autoPlay;
            });
        }
        else if (typeof idOrTagOrPens === 'string') {
            pens = this.find(idOrTagOrPens);
        }
        else {
            pens = idOrTagOrPens;
        }
        pens.forEach(function (pen) {
            var _a, _b;
            (_a = pen.calculative.media) === null || _a === void 0 ? void 0 : _a.pause();
            (_b = pen.onPauseVideo) === null || _b === void 0 ? void 0 : _b.call(pen, pen);
        });
    };
    Meta2d.prototype.stopVideo = function (idOrTagOrPens) {
        var pens = [];
        if (!idOrTagOrPens) {
            pens = this.store.data.pens.filter(function (pen) {
                return (pen.video || pen.audio) && pen.autoPlay;
            });
        }
        else if (typeof idOrTagOrPens === 'string') {
            pens = this.find(idOrTagOrPens);
        }
        else {
            pens = idOrTagOrPens;
        }
        pens.forEach(function (pen) {
            var _a;
            if (pen.calculative.media) {
                pen.calculative.media.currentTime = 0;
                pen.calculative.media.pause();
            }
            (_a = pen.onStopVideo) === null || _a === void 0 ? void 0 : _a.call(pen, pen);
        });
    };
    Meta2d.prototype.calcAnimateDuration = function (pen) {
        return pen.frames.reduce(function (prev, frame) { return prev + frame.duration; }, 0);
    };
    /**
     * 组合
     * @param pens 组合的画笔们
     * @param showChild 组合后展示第几个孩子
     */
    Meta2d.prototype.combine = function (pens, showChild) {
        var _this = this;
        if (pens === void 0) { pens = this.store.active; }
        if (!pens || !pens.length) {
            return;
        }
        var initPens = deepClone(pens);
        if (pens.length === 1 && pens[0].type) {
            pens[0].type = PenType.Node;
            this.canvas.active(pens);
            this.pushHistory({
                type: EditType.Update,
                initPens: initPens,
                pens: deepClone(pens, true),
            });
            this.render();
            return;
        }
        var rect = getRect(pens);
        var parent = __assign(__assign({ id: s8(), name: 'combine' }, rect), { children: [], showChild: showChild });
        // const p = pens.find((pen) => {
        //   // TODO: js 计算误差，可能导致包含着其它的 pens 的最大 pen 无法计算出来
        //   return pen.width === rect.width && pen.height === rect.height;
        // });
        // // 其中一个认为是父节点
        // const oneIsParent = p && showChild == undefined;
        // if (oneIsParent) {
        //   if (!p.children) {
        //     p.children = [];
        //   }
        //   parent = p;
        // } else {
        // 若组合为状态，那么 parent 一定是 combine
        this.canvas.makePen(parent);
        // }
        var initParent = deepClone(parent);
        var minIndex = Infinity;
        pens.forEach(function (pen) {
            var _a;
            var index = _this.store.data.pens.findIndex(function (_pen) { return _pen.id === pen.id; });
            if (index < minIndex) {
                minIndex = index;
            }
            if (pen === parent || pen.parentId === parent.id) {
                return;
            }
            // pen 来自于 store.active ，不存在有 parentId 的情况
            parent.children.push(pen.id);
            pen.parentId = parent.id;
            var childRect = calcRelativeRect(pen.calculative.worldRect, rect);
            Object.assign(pen, childRect);
            pen.locked = (_a = pen.lockedOnCombine) !== null && _a !== void 0 ? _a : LockState.DisableMove;
        });
        //将组合后的父节点置底
        this.store.data.pens.splice(minIndex, 0, parent);
        this.store.data.pens.pop();
        this.canvas.active([parent]);
        var step = 1;
        // if (!oneIsParent) {
        //   step = 2;
        //   this.pushHistory({
        //     type: EditType.Add,
        //     pens: [parent],
        //     step,
        //   });
        //   this.store.emitter.emit('add', [parent]);
        // }
        this.pushHistory({
            type: EditType.Add,
            pens: [initParent],
            step: 3,
        });
        this.pushHistory({
            type: EditType.Update,
            initPens: [initParent],
            pens: [parent],
            step: 3,
        });
        this.pushHistory({
            type: EditType.Update,
            initPens: initPens,
            pens: pens,
            step: 3,
        });
        if (showChild != undefined) {
            pens.forEach(function (pen) {
                calcInView(pen, true);
            });
            this.initImageCanvas([parent]);
        }
        this.store.emitter.emit('combine', [parent]);
        this.render();
    };
    Meta2d.prototype.uncombine = function (pen) {
        var _this = this;
        if (!pen && this.store.active) {
            pen = this.store.active[0];
        }
        if (!pen || !pen.children) {
            return;
        }
        var children = pen.children.map(function (childId) { return _this.store.pens[childId]; });
        var initPens = deepClone(children);
        children.forEach(function (child) {
            child.parentId = undefined;
            child.x = child.calculative.worldRect.x;
            child.y = child.calculative.worldRect.y;
            child.width = child.calculative.worldRect.width;
            child.height = child.calculative.worldRect.height;
            child.locked = LockState.None;
            child.calculative.active = undefined;
            child.calculative.hover = false;
            _this.setVisible(child, true); // 子节点的 visible 属性已经改变，需要恢复
        });
        var step = this.isCombine(pen) ? 3 : 2;
        this.pushHistory({
            type: EditType.Update,
            initPens: initPens,
            pens: children,
            step: step,
        });
        initPens = [deepClone(pen)];
        pen.children = undefined;
        // 保存修改 children 的历史记录
        this.pushHistory({
            type: EditType.Update,
            initPens: initPens,
            pens: [pen],
            step: step,
        });
        if (this.isCombine(pen)) {
            this.delete([pen]);
            // delete 会记录 history , 更改 step 即可
            this.store.histories[this.store.histories.length - 1].step = step;
        }
        this.inactive();
    };
    Meta2d.prototype.isCombine = function (pen) {
        if (pen.name === 'combine') {
            return true;
        }
        if (pen.children && pen.children.length > 0) {
            return true;
        }
        return false;
    };
    Meta2d.prototype.active = function (pens, emit) {
        if (emit === void 0) { emit = true; }
        this.canvas.active(pens, emit);
    };
    Meta2d.prototype.inactive = function () {
        this.canvas.inactive();
    };
    Meta2d.prototype.activeAll = function () {
        this.canvas.active(this.store.data.pens.filter(function (pen) { return !pen.parentId && pen.locked !== LockState.Disable; }));
        this.render();
    };
    /**
     * 删除画笔
     * @param pens 需要删除的画笔们
     * @param canDelLocked 是否删除已经锁住的画笔
     */
    Meta2d.prototype.delete = function (pens, canDelLocked, history) {
        if (canDelLocked === void 0) { canDelLocked = false; }
        if (history === void 0) { history = true; }
        this.canvas.delete(pens, canDelLocked, history);
    };
    Meta2d.prototype.scale = function (scale, center) {
        if (center === void 0) { center = { x: 0, y: 0 }; }
        this.canvas.scale(scale, center);
    };
    Meta2d.prototype.translate = function (x, y) {
        this.canvas.translate(x, y);
    };
    Meta2d.prototype.translatePens = function (pens, x, y) {
        this.canvas.translatePens(pens, x, y);
    };
    Meta2d.prototype.getParent = function (pen, root) {
        return getParent(pen, root);
    };
    Meta2d.prototype.data = function () {
        var data = deepClone(this.store.data);
        var _a = this.store.data, pens = _a.pens, paths = _a.paths;
        data.version = pkg.version;
        // TODO: 未在 delete 时清除，避免撤销等操作。
        // 清除一些未使用到的 paths
        data.paths = {};
        var _loop_2 = function (pathId) {
            if (Object.prototype.hasOwnProperty.call(paths, pathId)) {
                if (pens.find(function (pen) { return pen.pathId === pathId; })) {
                    data.paths[pathId] = paths[pathId];
                }
            }
        };
        for (var pathId in paths) {
            _loop_2(pathId);
        }
        return data;
    };
    Meta2d.prototype.copy = function (pens) {
        this.canvas.copy(pens);
    };
    Meta2d.prototype.cut = function (pens) {
        this.canvas.cut(pens);
    };
    Meta2d.prototype.paste = function () {
        this.canvas.paste();
    };
    Meta2d.prototype.undo = function () {
        this.canvas.undo();
    };
    Meta2d.prototype.redo = function () {
        this.canvas.redo();
    };
    Meta2d.prototype.listenSocket = function () {
        try {
            var socketFn = void 0;
            var socketCbJs = this.store.data.socketCbJs;
            if (socketCbJs) {
                socketFn = new Function('e', 'context', socketCbJs);
            }
            if (!socketFn) {
                return false;
            }
            this.socketFn = socketFn;
        }
        catch (e) {
            console.error('Create the function for socket:', e);
            return false;
        }
        return true;
    };
    Meta2d.prototype.connectWebsocket = function (websocket) {
        var _this = this;
        this.closeWebsocket();
        if (websocket) {
            this.store.data.websocket = websocket;
        }
        if (this.store.data.websocket) {
            this.websocket = new WebSocket(this.store.data.websocket, this.store.data.websocketProtocols || undefined);
            this.websocket.onmessage = function (e) {
                _this.socketCallback(e.data, {
                    type: 'websocket',
                    url: _this.store.data.websocket,
                });
            };
            this.websocket.onclose = function () {
                console.info('Canvas websocket closed and reconneting...');
                _this.connectWebsocket();
            };
        }
    };
    Meta2d.prototype.closeWebsocket = function () {
        if (this.websocket) {
            this.websocket.onclose = undefined;
            this.websocket.close();
            this.websocket = undefined;
        }
    };
    Meta2d.prototype.connectMqtt = function (params) {
        var _this = this;
        this.closeMqtt();
        if (params) {
            this.store.data.mqtt = params.mqtt;
            this.store.data.mqttTopics = params.mqttTopics;
            this.store.data.mqttOptions = params.mqttOptions;
        }
        if (this.store.data.mqtt) {
            if (this.store.data.mqttOptions.clientId &&
                !this.store.data.mqttOptions.customClientId) {
                this.store.data.mqttOptions.clientId = s8();
            }
            this.mqttClient = mqtt.connect(this.store.data.mqtt, this.store.data.mqttOptions);
            this.mqttClient.on('message', function (topic, message) {
                _this.socketCallback(message.toString(), {
                    topic: topic,
                    type: 'mqtt',
                    url: _this.store.data.mqtt,
                });
            });
            if (this.store.data.mqttTopics) {
                this.mqttClient.subscribe(this.store.data.mqttTopics.split(','));
            }
        }
    };
    Meta2d.prototype.closeMqtt = function () {
        var _a;
        (_a = this.mqttClient) === null || _a === void 0 ? void 0 : _a.end();
    };
    Meta2d.prototype.connectHttp = function () {
        var _this = this;
        this.closeHttp();
        var https = this.store.data.https;
        if (https) {
            if (!this.store.data.cancelFirstConnect) {
                https.forEach(function (item) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        this.oldRequestHttp(item);
                        return [2 /*return*/];
                    });
                }); });
            }
            https.forEach(function (item, index) {
                if (item.http) {
                    _this.httpTimerList[index] = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            // 默认每一秒请求一次
                            this.oldRequestHttp(item);
                            return [2 /*return*/];
                        });
                    }); }, item.httpTimeInterval || 1000);
                }
            });
        }
        else {
            var _a = this.store.data, http_1 = _a.http, httpTimeInterval = _a.httpTimeInterval, httpHeaders_1 = _a.httpHeaders;
            if (http_1) {
                this.httpTimer = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                    var res, data;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, fetch(http_1, {
                                    headers: httpHeaders_1,
                                })];
                            case 1:
                                res = _a.sent();
                                if (!res.ok) return [3 /*break*/, 3];
                                return [4 /*yield*/, res.text()];
                            case 2:
                                data = _a.sent();
                                this.socketCallback(data, { type: 'http', url: http_1 });
                                _a.label = 3;
                            case 3: return [2 /*return*/];
                        }
                    });
                }); }, httpTimeInterval || 1000);
            }
        }
    };
    Meta2d.prototype.oldRequestHttp = function (_req) {
        return __awaiter(this, void 0, void 0, function () {
            var req, res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        req = deepClone(_req);
                        if (!req.http) return [3 /*break*/, 3];
                        return [4 /*yield*/, fetch(req.http, {
                                headers: req.httpHeaders,
                                method: req.method || 'GET',
                                body: req.method === 'POST' ? JSON.stringify(req.body) : undefined,
                            })];
                    case 1:
                        res = _a.sent();
                        if (!res.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, res.text()];
                    case 2:
                        data = _a.sent();
                        this.socketCallback(data, { type: 'http', url: req.http });
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Meta2d.prototype.sendDatabyHttp = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var https, _a, http, httpHeaders, res;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        https = this.store.data.https;
                        if (!https) return [3 /*break*/, 1];
                        https.forEach(function (item) { return __awaiter(_this, void 0, void 0, function () {
                            var res;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!item.http) return [3 /*break*/, 2];
                                        return [4 /*yield*/, fetch(item.http, {
                                                method: 'post',
                                                body: data,
                                                headers: item.httpHeaders,
                                            })];
                                    case 1:
                                        res = _a.sent();
                                        if (res.ok) {
                                            console.info('http消息发送成功');
                                        }
                                        _a.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        }); });
                        return [3 /*break*/, 3];
                    case 1:
                        _a = this.store.data, http = _a.http, httpHeaders = _a.httpHeaders;
                        if (!http) return [3 /*break*/, 3];
                        return [4 /*yield*/, fetch(http, {
                                method: 'post',
                                body: data,
                                headers: httpHeaders,
                            })];
                    case 2:
                        res = _b.sent();
                        if (res.ok) {
                            console.info('http消息发送成功');
                        }
                        _b.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Meta2d.prototype.closeHttp = function () {
        clearInterval(this.httpTimer);
        this.httpTimer = undefined;
        this.httpTimerList &&
            this.httpTimerList.forEach(function (_httpTimer) {
                clearInterval(_httpTimer);
                _httpTimer = undefined;
            });
    };
    Meta2d.prototype.connectNetwork = function () {
        var _this = this;
        this.closeNetwork();
        var networks = this.store.data.networks;
        var https = [];
        if (networks) {
            var mqttIndex_1 = 0;
            this.mqttClients = [];
            var websocketIndex_1 = 0;
            this.websockets = [];
            networks.forEach(function (net) {
                if (net.type === 'subscribe') {
                    if (net.protocol === 'mqtt') {
                        if (net.options.clientId && !net.options.customClientId) {
                            net.options.clientId = s8();
                        }
                        _this.mqttClients[mqttIndex_1] = mqtt.connect(net.url, net.options);
                        _this.mqttClients[mqttIndex_1].on('message', function (topic, message) {
                            _this.socketCallback(message.toString(), {
                                topic: topic,
                                type: 'mqtt',
                                url: net.url,
                            });
                        });
                        if (net.topics) {
                            _this.mqttClients[mqttIndex_1].subscribe(net.topics.split(','));
                        }
                        mqttIndex_1 += 1;
                    }
                    else if (net.protocol === 'websocket') {
                        _this.websockets[websocketIndex_1] = new WebSocket(net.url, net.protocols || undefined);
                        _this.websockets[websocketIndex_1].onmessage = function (e) {
                            _this.socketCallback(e.data, { type: 'websocket', url: net.url });
                        };
                        websocketIndex_1 += 1;
                    }
                    else if (net.protocol === 'http') {
                        https.push({
                            url: net.url,
                            headers: net.headers || undefined,
                            method: net.method,
                            body: net.body,
                        });
                    }
                }
            });
        }
        this.onNetworkConnect(https);
    };
    Meta2d.prototype.randomString = function (e) {
        e = e || 32;
        var t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678', a = t.length, n = '';
        for (var i = 0; i < e; i++) {
            n += t.charAt(Math.floor(Math.random() * a));
        }
        return n;
    };
    Meta2d.prototype.penMock = function (pen) {
        var _this = this;
        var _a;
        if (pen.realTimes) {
            var _d_1 = {};
            pen.realTimes.forEach(function (realTime) {
                if (realTime.enableMock && realTime.mock !== undefined) {
                    if (realTime.type === 'float') {
                        if (realTime.mock && realTime.mock.indexOf(',') !== -1) {
                            var arr = realTime.mock.split(',');
                            var rai = Math.floor(Math.random() * arr.length);
                            _d_1[realTime.key] = parseFloat(arr[rai]);
                        }
                        else if (realTime.mock && realTime.mock.indexOf('-') !== -1) {
                            var max = void 0;
                            var min = void 0;
                            var len = void 0;
                            var arr = realTime.mock.split('-');
                            if (realTime.mock.charAt(0) === '-') {
                                //负数
                                if (arr.length === 4) {
                                    max = -parseFloat(arr[3]);
                                    min = -parseFloat(arr[1]);
                                    len = arr[3];
                                }
                                else {
                                    max = parseFloat(arr[2]);
                                    min = -parseFloat(arr[1]);
                                    len = arr[2];
                                }
                            }
                            else {
                                max = parseFloat(arr[1]);
                                min = parseFloat(arr[0]);
                                len = arr[1];
                            }
                            if ((len + '').indexOf('.') !== -1) {
                                var length_1 = (len + '').split('.')[1].length;
                                _d_1[realTime.key] = (Math.random() * (max - min) + min).toFixed(length_1);
                            }
                            else {
                                _d_1[realTime.key] = Math.random() * (max - min) + min;
                            }
                        }
                        else {
                            _d_1[realTime.key] = parseFloat(realTime.mock);
                        }
                    }
                    else if (realTime.type === 'integer') {
                        if (realTime.mock && realTime.mock.indexOf(',') !== -1) {
                            var arr = realTime.mock.split(',');
                            var rai = Math.floor(Math.random() * arr.length);
                            _d_1[realTime.key] = parseInt(arr[rai]);
                        }
                        else if (realTime.mock && realTime.mock.indexOf('-') !== -1) {
                            var max = void 0;
                            var min = void 0;
                            var arr = realTime.mock.split('-');
                            if (realTime.mock.charAt(0) === '-') {
                                if (arr.length === 4) {
                                    max = -parseFloat(arr[3]);
                                    min = -parseFloat(arr[1]);
                                }
                                else {
                                    max = parseFloat(arr[2]);
                                    min = -parseFloat(arr[1]);
                                }
                            }
                            else {
                                max = parseInt(arr[1]);
                                min = parseInt(arr[0]);
                            }
                            _d_1[realTime.key] = parseInt(Math.random() * (max - min) + min + '');
                        }
                        else {
                            _d_1[realTime.key] = parseInt(realTime.mock);
                        }
                    }
                    else if (realTime.type === 'bool') {
                        if (typeof realTime.mock === 'boolean') {
                            _d_1[realTime.key] = realTime.mock;
                        }
                        else if ('true' === realTime.mock) {
                            _d_1[realTime.key] = true;
                        }
                        else if ('false' === realTime.mock) {
                            _d_1[realTime.key] = false;
                        }
                        else {
                            _d_1[realTime.key] = Math.random() < 0.5;
                        }
                    }
                    else if (realTime.type === 'object' || realTime.type === 'array') {
                        if (realTime.mock) {
                            //对象or数组 不mock
                            // _d[realTime.key] = realTime.value;
                        }
                    }
                    else {
                        //if (realTime.type === 'string')
                        if (realTime.mock &&
                            realTime.mock.startsWith('{') &&
                            realTime.mock.endsWith('}')) {
                            var str = realTime.mock.substring(1, realTime.mock.length - 1);
                            var arr = str.split(',');
                            var rai = Math.floor(Math.random() * arr.length);
                            _d_1[realTime.key] = arr[rai];
                        }
                        else if (realTime.mock &&
                            realTime.mock.startsWith('[') &&
                            realTime.mock.endsWith(']')) {
                            var len = parseInt(realTime.mock.substring(1, realTime.mock.length - 1));
                            _d_1[realTime.key] = _this.randomString(len);
                        }
                        else {
                            _d_1[realTime.key] = realTime.mock;
                        }
                    }
                }
            });
            if (Object.keys(_d_1).length) {
                var data = pen.onBeforeValue ? pen.onBeforeValue(pen, _d_1) : _d_1;
                this.canvas.updateValue(pen, data);
                this.store.emitter.emit('valueUpdate', pen);
                (_a = pen.onValue) === null || _a === void 0 ? void 0 : _a.call(pen, pen);
            }
        }
    };
    Meta2d.prototype.penNetwork = function (pen) {
        var penNetwork = {
            url: pen.apiUrl,
            method: pen.apiMethod,
            headers: pen.apiHeaders,
            body: pen.apiBody,
        };
        //临时请求一次
        this.requestHttp(penNetwork);
        if (pen.apiEnable) {
            if (!this.store.pensNetwork) {
                this.store.pensNetwork = {};
            }
            this.store.pensNetwork[pen.id] = penNetwork;
        }
    };
    //获取动态参数
    Meta2d.prototype.getDynamicParam = function (key) {
        function getCookie(name) {
            var arr;
            var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
            if ((arr = document.cookie.match(reg))) {
                return decodeURIComponent(arr[2]);
            }
            else {
                return '';
            }
        }
        var params = queryURLParams();
        var value = params[key] || localStorage[key] || getCookie(key) || '';
        return value;
    };
    Meta2d.prototype.onNetworkConnect = function (https) {
        var _this = this;
        var enable = this.store.data.enableMock;
        if (!(https && https.length) && !enable) {
            return;
        }
        if (this.store.pensNetwork) {
            for (var key in this.store.pensNetwork) {
                https.push(this.store.pensNetwork[key]);
            }
        }
        if (!this.store.data.cancelFirstConnect) {
            https.forEach(function (_item) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.requestHttp(_item);
                    return [2 /*return*/];
                });
            }); });
        }
        this.updateTimer = setInterval(function () {
            //模拟数据
            enable &&
                _this.store.data.pens.forEach(function (pen) {
                    _this.penMock(pen);
                });
            https.forEach(function (_item) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.requestHttp(_item);
                    return [2 /*return*/];
                });
            }); });
            _this.render();
        }, this.store.data.networkInterval || 1000);
    };
    Meta2d.prototype.requestHttp = function (_req) {
        return __awaiter(this, void 0, void 0, function () {
            var req, i, keys, i, keys, res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        req = deepClone(_req);
                        if (!req.url) return [3 /*break*/, 3];
                        if (typeof req.headers === 'object') {
                            for (i in req.headers) {
                                keys = req.headers[i].match(/(?<=\$\{).*?(?=\})/g);
                                if (keys) {
                                    req.headers[i] = req.headers[i].replace("${" + keys[0] + "}", this.getDynamicParam(keys[0]));
                                }
                            }
                        }
                        if (typeof req.body === 'object') {
                            for (i in req.body) {
                                keys = req.body[i].match(/(?<=\$\{).*?(?=\})/g);
                                if (keys) {
                                    req.body[i] = req.body[i].replace("${" + keys[0] + "}", this.getDynamicParam(keys[0]));
                                }
                            }
                        }
                        return [4 /*yield*/, fetch(req.url, {
                                headers: req.headers,
                                method: req.method,
                                body: req.method === 'GET' ? undefined : JSON.stringify(req.body),
                            })];
                    case 1:
                        res = _a.sent();
                        if (!res.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, res.text()];
                    case 2:
                        data = _a.sent();
                        this.socketCallback(data, { type: 'http', url: req.url });
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Meta2d.prototype.closeNetwork = function () {
        this.mqttClients &&
            this.mqttClients.forEach(function (mqttClient) {
                mqttClient.end();
            });
        this.websockets &&
            this.websockets.forEach(function (websocket) {
                websocket.close();
            });
        this.mqttClients = undefined;
        this.websockets = undefined;
        clearInterval(this.updateTimer);
        this.updateTimer = undefined;
    };
    Meta2d.prototype.socketCallback = function (message, context) {
        var _this = this;
        this.store.emitter.emit('socket', { message: message, context: context });
        if (this.socketFn &&
            !this.socketFn(message, {
                meta2d: this,
                type: context.type,
                topic: context.topic,
                url: context.url,
            })) {
            return;
        }
        var data;
        if (message.constructor === Object || message.constructor === Array) {
            data = message;
        }
        else if (typeof message === 'string') {
            try {
                data = JSON.parse(message);
            }
            catch (error) {
                console.warn('Invalid socket data:', data, error);
            }
        }
        else {
            return;
        }
        if (!data) {
            return;
        }
        if (!Array.isArray(data)) {
            data = [data];
        }
        if (!data.length) {
            return;
        }
        if (data[0].dataId) {
            this.setDatas(data);
        }
        else {
            data.forEach(function (_data) {
                _this.setValue(_data);
            });
        }
    };
    // 绑定变量方式更新组件数据
    Meta2d.prototype.setDatas = function (datas, _a) {
        var _this = this;
        var _b = _a === void 0 ? {} : _a, _c = _b.render, render = _c === void 0 ? true : _c, _e = _b.doEvent, doEvent = _e === void 0 ? true : _e, history = _b.history;
        // 把{dataId: string; value: any}转成setValue格式数据
        var penValues = new Map();
        datas.forEach(function (v) {
            var _a, _b;
            (_a = _this.store.bindDatas[v.dataId]) === null || _a === void 0 ? void 0 : _a.forEach(function (p) {
                var _a;
                var pen = _this.store.pens[p.id];
                if (!pen) {
                    return;
                }
                var penValue = penValues.get(pen);
                if (typeof pen.onBinds === 'function') {
                    // 已经计算了
                    if (penValue) {
                        return;
                    }
                    penValues.set(pen, pen.onBinds(pen, datas, p.formItem));
                    return;
                }
                if (penValue) {
                    penValue[p.formItem.key] = v.value;
                }
                else {
                    penValue = (_a = {
                            id: p.id
                        },
                        _a[p.formItem.key] = v.value,
                        _a);
                    penValues.set(pen, penValue);
                }
            });
            (_b = _this.store.bind[v.id]) === null || _b === void 0 ? void 0 : _b.forEach(function (p) {
                var _a;
                var pen = _this.store.pens[p.id];
                if (!pen) {
                    return;
                }
                var penValue = penValues.get(pen);
                // if (typeof pen.onBinds === 'function') {
                //   // 已经计算了
                //   if (penValue) {
                //     return;
                //   }
                //   //TODO onBinds的情况
                //   penValues.set(pen, pen.onBinds(pen, datas));
                //   return;
                // }
                if (penValue) {
                    penValue[p.key] = v.value;
                }
                else {
                    penValue = (_a = {
                            id: p.id
                        },
                        _a[p.key] = v.value,
                        _a);
                    penValues.set(pen, penValue);
                }
            });
        });
        var initPens;
        var pens;
        if (history) {
            initPens = [];
        }
        penValues.forEach(function (value, pen) {
            _this.setValue(value, { render: false, doEvent: doEvent, history: false });
            if (history) {
                initPens.push(deepClone(pen, true));
                pens.push(pen);
            }
        });
        render && this.render();
        if (history) {
            this.pushHistory({
                type: EditType.Update,
                initPens: initPens,
                pens: pens,
            });
        }
    };
    Meta2d.prototype.setValue = function (data, _a) {
        var _this = this;
        var _b = _a === void 0 ? {} : _a, _c = _b.render, render = _c === void 0 ? true : _c, _e = _b.doEvent, doEvent = _e === void 0 ? true : _e, history = _b.history;
        var pens = [];
        if (data.id) {
            if (data.id === this.store.data.id) {
                this.setDatabyOptions(data);
                if (data.bkImage) {
                    this.setBackgroundImage(data.bkImage);
                }
                if (data.background) {
                    this.setBackgroundColor(data.background);
                }
                this.render();
                return;
            }
            var pen = this.store.pens[data.id];
            if (pen) {
                pens = [pen];
            }
            else {
                //bind 绑定变量的情况
                var bindArr = this.store.bind[data.id];
                if (bindArr && bindArr.length) {
                    pens = [];
                    this.setDatas([data], {
                        render: render,
                        doEvent: doEvent,
                        history: history,
                    });
                    return;
                }
            }
        }
        else if (data.dataId) {
            pens = [];
            this.setDatas([data], {
                render: render,
                doEvent: doEvent,
                history: history,
            });
            return;
        }
        else if (data.tag) {
            pens = this.find(data.tag);
        }
        else {
            return;
        }
        history = history && !this.store.data.locked;
        var initPens;
        if (history) {
            initPens = deepClone(pens);
        }
        pens.forEach(function (pen) {
            var _a;
            var afterData = pen.onBeforeValue
                ? pen.onBeforeValue(pen, data)
                : data;
            if (data.frames) {
                _this.stopAnimate([pen]);
                if (!data.showDuration) {
                    data.showDuration = data.frames.reduce(function (total, item) {
                        return total + item.duration;
                    }, 0);
                }
            }
            setChildValue(pen, afterData);
            _this.canvas.updateValue(pen, afterData);
            (_a = pen.onValue) === null || _a === void 0 ? void 0 : _a.call(pen, pen);
        });
        if (!this.store.data.locked &&
            this.store.active.length &&
            !this.canvas.movingPens) {
            // 移动过程中，不重算 activeRect
            this.canvas.calcActiveRect();
        }
        if (history) {
            var _pens = deepClone(pens);
            this.pushHistory({
                type: EditType.Update,
                initPens: initPens,
                pens: _pens,
            });
        }
        doEvent &&
            pens.forEach(function (pen) {
                _this.store.emitter.emit('valueUpdate', pen);
            });
        render && this.render();
    };
    /**
     * @deprecated 改用 setValue
     */
    Meta2d.prototype._setValue = function (data, history) {
        if (history === void 0) { history = false; }
        this.setValue(data, { history: history, render: false, doEvent: false });
    };
    Meta2d.prototype.pushHistory = function (action) {
        this.canvas.pushHistory(action);
    };
    Meta2d.prototype.showInput = function (pen, rect) {
        this.canvas.showInput(pen, rect);
    };
    Meta2d.prototype.hideInput = function () {
        this.canvas.hideInput();
    };
    Meta2d.prototype.clearDropdownList = function () {
        this.canvas.clearDropdownList();
    };
    Meta2d.prototype.initMessageEvents = function () {
        var _this = this;
        this.store.data.pens.forEach(function (pen) {
            var _a;
            (_a = pen.events) === null || _a === void 0 ? void 0 : _a.forEach(function (event) {
                if (event.name === 'message' && event.message) {
                    if (!_this.store.messageEvents[event.message]) {
                        _this.store.messageEvents[event.message] = [];
                    }
                    _this.store.messageEvents[event.message].push({
                        pen: pen,
                        event: event,
                    });
                }
            });
        });
    };
    Meta2d.prototype.judgeCondition = function (pen, key, condition) {
        var type = condition.type, target = condition.target, fnJs = condition.fnJs, fn = condition.fn, operator = condition.operator, valueType = condition.valueType;
        var can = false;
        if (type === 'fn') {
            //方法
            if (fn) {
                can = fn(pen, { meta2d: this });
            }
            else if (fnJs) {
                try {
                    condition.fn = new Function('pen', 'context', fnJs);
                }
                catch (err) {
                    console.error('Error: make function:', err);
                }
                if (condition.fn) {
                    can = condition.fn(pen, { meta2d: this });
                }
            }
        }
        else {
            //TODO boolean类型 数字类型
            var value = condition.value;
            if (valueType === 'prop') {
                value = this.store.pens[target][condition.value];
            }
            var compareValue = getter(pen, key);
            switch (operator) {
                case '>':
                    can = compareValue > +value;
                    break;
                case '>=':
                    can = compareValue >= +value;
                    break;
                case '<':
                    can = compareValue < +value;
                    break;
                case '<=':
                    can = compareValue <= +value;
                    break;
                case '=':
                case '==':
                    can = compareValue == value;
                    break;
                case '!=':
                    can = compareValue != value;
                    break;
                case '[)':
                    can = valueInRange(+compareValue, value);
                    break;
                case '![)':
                    can = !valueInRange(+compareValue, value);
                    break;
                case '[]':
                    can = valueInArray(+compareValue, value);
                    break;
                case '![]':
                    can = !valueInArray(+compareValue, value);
                    break;
            }
        }
        return can;
    };
    Meta2d.prototype.pushChildren = function (parent, children) {
        var _this = this;
        var initUpdatePens = [deepClone(parent, true)];
        var addPens = [];
        if (!parent.children) {
            parent.children = [];
        }
        var updatePens = [];
        children.forEach(function (pen) {
            var _a;
            var oldPen = deepClone(pen, true);
            if (!pen.id || !_this.store.pens[pen.id]) {
                // 不存在于 store 中
                _this.canvas.makePen(pen);
                oldPen = null; // 添加操作
            }
            if (pen.parentId) {
                var oldParent = _this.store.pens[pen.parentId];
                var i = oldParent.children.findIndex(function (id) { return id === pen.id; });
                initUpdatePens.push(deepClone(oldParent, true));
                oldParent.children.splice(i, 1);
                updatePens.push(deepClone(oldParent, true));
            }
            parent.children.push(pen.id);
            pen.parentId = parent.id;
            var childRect = calcRelativeRect(pen.calculative.worldRect, parent.calculative.worldRect);
            Object.assign(pen, childRect);
            pen.locked = (_a = pen.lockedOnCombine) !== null && _a !== void 0 ? _a : LockState.DisableMove;
            if (!oldPen) {
                addPens.push(deepClone(pen, true));
            }
            else {
                initUpdatePens.push(oldPen);
                updatePens.push(deepClone(pen, true));
            }
        });
        updatePens.push(deepClone(parent, true));
        var step = 1;
        if (addPens.length) {
            step = 2;
            this.pushHistory({
                type: EditType.Add,
                pens: addPens,
                step: step,
            });
        }
        this.pushHistory({
            type: EditType.Update,
            initPens: initUpdatePens,
            pens: updatePens,
            step: step,
        });
    };
    Meta2d.prototype.toPng = function (padding, callback, containBkImg, maxWidth) {
        if (containBkImg === void 0) { containBkImg = false; }
        return this.canvas.toPng(padding, callback, containBkImg, maxWidth);
    };
    Meta2d.prototype.activeToPng = function (padding) {
        return this.canvas.activeToPng(padding);
    };
    /**
     * 下载 png
     * @param name 传入参数自带文件后缀名 例如：'test.png'
     * @param padding 上右下左的内边距
     */
    Meta2d.prototype.downloadPng = function (name, padding, maxWidth) {
        var e_6, _a;
        var _this = this;
        var _b;
        try {
            for (var _c = __values(this.store.data.pens), _e = _c.next(); !_e.done; _e = _c.next()) {
                var pen = _e.value;
                if (pen.calculative.img || ['iframe'].includes(pen.name)) {
                    //重新生成绘制图片
                    (_b = pen.onRenderPenRaw) === null || _b === void 0 ? void 0 : _b.call(pen, pen);
                }
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_6) throw e_6.error; }
        }
        setTimeout(function () {
            var a = document.createElement('a');
            a.setAttribute('download', (name || _this.store.data.name || 'le5le.meta2d') + '.png');
            a.setAttribute('href', _this.toPng(padding, undefined, true, maxWidth));
            var evt = document.createEvent('MouseEvents');
            evt.initEvent('click', true, true);
            a.dispatchEvent(evt);
        }, 1000);
    };
    Meta2d.prototype.downloadSvg = function () {
        var e_7, _a;
        if (!window.C2S) {
            console.error('请先加载乐吾乐官网下的canvas2svg.js', 'https://assets.le5lecdn.com/2d/canvas2svg.js');
            throw new Error('请先加载乐吾乐官网下的canvas2svg.js');
        }
        var rect = this.getRect();
        rect.x -= 10;
        rect.y -= 10;
        var ctx = new window.C2S(rect.width + 20, rect.height + 20);
        ctx.textBaseline = 'middle';
        try {
            for (var _b = __values(this.store.data.pens), _c = _b.next(); !_c.done; _c = _b.next()) {
                var pen = _c.value;
                if (pen.visible == false || !isShowChild(pen, this.store)) {
                    continue;
                }
                renderPenRaw(ctx, pen, rect, true);
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_7) throw e_7.error; }
        }
        var mySerializedSVG = ctx.getSerializedSvg();
        if (this.store.data.background) {
            mySerializedSVG = mySerializedSVG.replace('{{bk}}', '');
            mySerializedSVG = mySerializedSVG.replace('{{bkRect}}', "<rect x=\"0\" y=\"0\" width=\"100%\" height=\"100%\" fill=\"" + this.store.data.background + "\"></rect>");
        }
        else {
            mySerializedSVG = mySerializedSVG.replace('{{bk}}', '');
            mySerializedSVG = mySerializedSVG.replace('{{bkRect}}', '');
        }
        mySerializedSVG = mySerializedSVG.replace(/--le5le--/g, '&#x');
        var urlObject = window.URL;
        var export_blob = new Blob([mySerializedSVG]);
        var url = urlObject.createObjectURL(export_blob);
        var a = document.createElement('a');
        a.setAttribute('download', (this.store.data.name || 'le5le.meta2d') + ".svg");
        a.setAttribute('href', url);
        var evt = document.createEvent('MouseEvents');
        evt.initEvent('click', true, true);
        a.dispatchEvent(evt);
    };
    Meta2d.prototype.getRect = function (pens) {
        if (pens === void 0) { pens = this.store.data.pens; }
        return getRect(pens);
    };
    Meta2d.prototype.hiddenTemplate = function () {
        this.canvas.canvasTemplate.hidden();
    };
    Meta2d.prototype.showTemplate = function () {
        this.canvas.canvasTemplate.show();
    };
    Meta2d.prototype.lockTemplate = function (lock) {
        //锁定
        this.store.data.pens.forEach(function (pen) {
            if (pen.template) {
                pen.locked = lock;
            }
        });
    };
    /**
     * 放大到屏幕尺寸，并居中
     * @param fit true，填满但完整展示；false，填满，但长边可能截取（即显示不完整）
     */
    Meta2d.prototype.fitView = function (fit, viewPadding) {
        if (fit === void 0) { fit = true; }
        if (viewPadding === void 0) { viewPadding = 10; }
        // 默认垂直填充，两边留白
        if (!this.hasView())
            return;
        // 1. 重置画布尺寸为容器尺寸
        var canvas = this.canvas.canvas;
        var width = canvas.offsetWidth, height = canvas.offsetHeight;
        this.resize(width, height);
        // 2. 获取设置的留白值
        var padding = formatPadding(viewPadding);
        // 3. 获取图形尺寸
        var rect = this.getRect();
        // 4. 计算缩放比例
        var w = (width - padding[1] - padding[3]) / rect.width;
        var h = (height - padding[0] - padding[2]) / rect.height;
        var ratio = w;
        if (fit) {
            // 完整显示取小的
            ratio = w > h ? h : w;
        }
        else {
            ratio = w > h ? w : h;
        }
        // 该方法直接更改画布的 scale 属性，所以比率应该乘以当前 scale
        this.scale(ratio * this.store.data.scale);
        // 5. 居中
        this.centerView();
    };
    Meta2d.prototype.trimPens = function () {
        //去除空连线
        var pens = this.store.data.pens.filter(function (pen) { return pen.name === 'line' && pen.anchors.length < 2; });
        this.delete(pens);
    };
    /**
     * 放大到屏幕尺寸，并居中
     * @param fit true，填满但完整展示；false，填满，但长边可能截取（即显示不完整）
     */
    Meta2d.prototype.fitTemplateView = function (fit, viewPadding) {
        var _this = this;
        if (fit === void 0) { fit = true; }
        if (viewPadding === void 0) { viewPadding = 10; }
        //  默认垂直填充，两边留白
        if (!this.hasView())
            return;
        // 1. 重置画布尺寸为容器尺寸
        var canvas = this.canvas.canvas;
        var width = canvas.offsetWidth, height = canvas.offsetHeight;
        // 2. 获取设置的留白值
        var padding = formatPadding(viewPadding);
        // 3. 获取图形尺寸
        var rect = this.getRect();
        // 4. 计算缩放比例
        var w = (width - padding[1] - padding[3]) / rect.width;
        var h = (height - padding[0] - padding[2]) / rect.height;
        var ratio = w;
        if (fit) {
            // 完整显示取小的
            ratio = w > h ? h : w;
        }
        else {
            ratio = w > h ? w : h;
        }
        // 该方法直接更改画布的 scale 属性，所以比率应该乘以当前 scale
        this.canvas.templateScale(ratio * this.store.data.scale);
        var _rect = this.getRect();
        var pens = this.store.data.pens.filter(function (pen) { return !pen.parentId; });
        this.canvas.templateTranslatePens(pens, -_rect.x, -_rect.y);
        // 5. 居中
        this.store.data.pens.forEach(function (pen) {
            if (!pen.type) {
                _this.canvas.updateLines(pen);
            }
            else {
                _this.canvas.initLineRect(pen);
            }
        });
        this.centerView();
    };
    Meta2d.prototype.fitSizeView = function (fit, viewPadding) {
        if (fit === void 0) { fit = true; }
        if (viewPadding === void 0) { viewPadding = 10; }
        // 默认垂直填充，两边留白
        // if (!this.hasView()) return;
        // 1. 重置画布尺寸为容器尺寸
        var canvas = this.canvas.canvas;
        var width = canvas.offsetWidth, height = canvas.offsetHeight;
        this.resize(width, height);
        // 2. 获取设置的留白值
        var padding = formatPadding(viewPadding);
        var _width = (this.store.data.width || this.store.options.width) *
            this.store.data.scale;
        var _height = (this.store.data.height || this.store.options.height) *
            this.store.data.scale;
        // 4. 计算缩放比例
        var w = (width - padding[1] - padding[3]) / _width;
        var h = (height - padding[0] - padding[2]) / _height;
        var ratio = w;
        if (fit === 'width') {
            ratio = w;
        }
        else if (fit === 'height') {
            ratio = h;
        }
        else {
            if (fit) {
                // 完整显示取小的
                ratio = w > h ? h : w;
            }
            else {
                ratio = w > h ? w : h;
            }
        }
        // 该方法直接更改画布的 scale 属性，所以比率应该乘以当前 scale
        this.scale(ratio * this.store.data.scale);
        // 5. 居中
        this.centerSizeView();
    };
    Meta2d.prototype.centerSizeView = function () {
        // if (!this.hasView()) return;
        var viewCenter = this.getViewCenter();
        //根据画布尺寸居中对齐
        var _width = this.store.data.width || this.store.options.width;
        var _height = this.store.data.height || this.store.options.height;
        var pensRect = {
            x: 0,
            y: 0,
            width: _width,
            height: _height,
        };
        calcCenter(pensRect);
        var center = pensRect.center;
        var _a = this.store.data, scale = _a.scale, origin = _a.origin, dataX = _a.x, dataY = _a.y;
        this.translate((viewCenter.x - origin.x) / scale - center.x - dataX / scale, (viewCenter.y - origin.y) / scale - center.y - dataY / scale);
        var canvas = this.canvas.canvas;
        var x = (canvas.scrollWidth - canvas.offsetWidth) / 2;
        var y = (canvas.scrollHeight - canvas.offsetHeight) / 2;
        canvas.scrollTo(x, y);
    };
    /**
     * 宽度放大到屏幕尺寸，并滚动到最顶部
     *
     */
    Meta2d.prototype.scrollView = function (viewPadding, pageMode) {
        if (viewPadding === void 0) { viewPadding = 10; }
        if (pageMode === void 0) { pageMode = false; }
        if (!this.hasView())
            return;
        //滚动状态下
        if (!this.canvas.scroll) {
            return;
        }
        var canvas = this.canvas.canvas;
        var width = canvas.offsetWidth, height = canvas.offsetHeight;
        this.resize(width, height);
        var padding = formatPadding(viewPadding);
        var rect = this.getRect();
        var ratio = (width - padding[1] - padding[3]) / rect.width;
        this.scale(ratio * this.store.data.scale);
        this.topView(padding[0]);
        if (pageMode) {
            this.canvas.scroll.changeMode();
        }
    };
    Meta2d.prototype.screenView = function (viewPadding, WorH) {
        if (viewPadding === void 0) { viewPadding = 10; }
        if (WorH === void 0) { WorH = true; }
        if (!this.hasView())
            return;
        var canvas = this.canvas.canvas;
        var width = canvas.offsetWidth, height = canvas.offsetHeight;
        this.resize(width, height);
        var padding = formatPadding(viewPadding);
        var rect = this.getRect();
        //默认宽度充满
        var ratio = (width - padding[1] - padding[3]) / rect.width;
        if (!WorH) {
            ratio = (height - padding[0] - padding[2]) / rect.height;
        }
        this.scale(ratio * this.store.data.scale);
        //height充满时是居中
        this.topView(padding[0]);
    };
    Meta2d.prototype.topView = function (paddingTop) {
        if (paddingTop === void 0) { paddingTop = 10; }
        if (!this.hasView())
            return;
        var rect = this.getRect();
        var viewCenter = this.getViewCenter();
        var pensRect = this.getPenRect(rect);
        calcCenter(pensRect);
        var center = pensRect.center;
        var _a = this.store.data, scale = _a.scale, origin = _a.origin, dataX = _a.x, dataY = _a.y;
        this.translate((viewCenter.x - origin.x) / scale - center.x - dataX / scale, (paddingTop - origin.y) / scale - pensRect.y - dataY / scale);
        var canvas = this.canvas.canvas;
        var x = (canvas.scrollWidth - canvas.offsetWidth) / 2;
        var y = (canvas.scrollHeight - canvas.offsetHeight) / 2;
        canvas.scrollTo(x, y);
    };
    Meta2d.prototype.centerView = function () {
        if (!this.hasView())
            return;
        var rect = this.getRect();
        var viewCenter = this.getViewCenter();
        var pensRect = this.getPenRect(rect);
        calcCenter(pensRect);
        var center = pensRect.center;
        var _a = this.store.data, scale = _a.scale, origin = _a.origin, dataX = _a.x, dataY = _a.y;
        // center 的值，在缩放和拖拽画布过程中不发生变化，是相对值
        // viewCenter 是一个绝对值，需要根据 origin 的值，来计算出相对的值
        // store.data.x 是画布偏移值，在 translate 方法中与 scale 相关，这里也需要计算
        this.translate((viewCenter.x - origin.x) / scale - center.x - dataX / scale, (viewCenter.y - origin.y) / scale - center.y - dataY / scale);
        var canvas = this.canvas.canvas;
        var x = (canvas.scrollWidth - canvas.offsetWidth) / 2;
        var y = (canvas.scrollHeight - canvas.offsetHeight) / 2;
        canvas.scrollTo(x, y);
    };
    /**
     * 画布是否有 画笔
     * RuleLine 不算
     */
    Meta2d.prototype.hasView = function () {
        return !!this.store.data.pens.filter(function (pen) { return !pen.isRuleLine; }).length;
    };
    Meta2d.prototype.getViewCenter = function () {
        var _a = this.canvas, width = _a.width, height = _a.height;
        return {
            x: width / 2,
            y: height / 2,
        };
    };
    /**
     * 大小相同
     * @param pens 画笔们
     */
    Meta2d.prototype.beSameByFirst = function (pens, attribute) {
        if (pens === void 0) { pens = this.store.data.pens; }
        var initPens = deepClone(pens); // 原 pens ，深拷贝一下
        // 1. 得到第一个画笔的 宽高
        var firstPen = pens[0];
        var _a = this.getPenRect(firstPen), width = _a.width, height = _a.height;
        for (var i = 1; i < pens.length; i++) {
            var pen = pens[i];
            if (attribute === 'width') {
                this.setValue({ id: pen.id, width: width }, { render: false, doEvent: false });
            }
            else if (attribute === 'height') {
                this.setValue({ id: pen.id, height: height }, { render: false, doEvent: false });
            }
            else {
                this.setValue({ id: pen.id, width: width, height: height }, { render: false, doEvent: false });
            }
        }
        this.render();
        this.pushHistory({
            type: EditType.Update,
            initPens: initPens,
            pens: pens,
        });
    };
    /**
     * 大小相同
     * @param pens 画笔们
     */
    Meta2d.prototype.beSameByLast = function (pens, attribute) {
        if (pens === void 0) { pens = this.store.data.pens; }
        var initPens = deepClone(pens); // 原 pens ，深拷贝一下
        // 1. 得到最后一个画笔的 宽高
        var lastPen = pens[pens.length - 1];
        var _a = this.getPenRect(lastPen), width = _a.width, height = _a.height;
        for (var i = 0; i < pens.length - 1; i++) {
            var pen = pens[i];
            if (attribute === 'width') {
                this.setValue({ id: pen.id, width: width }, { render: false, doEvent: false });
            }
            else if (attribute === 'height') {
                this.setValue({ id: pen.id, height: height }, { render: false, doEvent: false });
            }
            else {
                this.setValue({ id: pen.id, width: width, height: height }, { render: false, doEvent: false });
            }
        }
        this.render();
        this.pushHistory({
            type: EditType.Update,
            initPens: initPens,
            pens: pens,
        });
    };
    /**
     * 格式刷（样式相同，大小无需一致。）
     * @param pens 画笔们
     */
    Meta2d.prototype.formatPainterByFirst = function (pens) {
        if (pens === void 0) { pens = this.store.data.pens; }
        var initPens = deepClone(pens); // 原 pens ，深拷贝一下
        var firstPen = pens[0];
        // 格式刷修改的属性，除开宽高
        var attrs = {};
        formatAttrs.forEach(function (attr) {
            attrs[attr] = firstPen[attr];
        });
        for (var i = 1; i < pens.length; i++) {
            var pen = pens[i];
            this.setValue(__assign({ id: pen.id }, attrs), { render: false, doEvent: false });
        }
        this.render();
        this.pushHistory({
            type: EditType.Update,
            initPens: initPens,
            pens: pens,
        });
    };
    Meta2d.prototype.setFormatPainter = function () {
        var _this = this;
        var pens = this.store.active;
        var attrs = {};
        if (pens.length > 0) {
            var firstPen_1 = pens[0];
            formatAttrs.forEach(function (attr) {
                attrs[attr] =
                    firstPen_1[attr] ||
                        _this.store.options.defaultFormat[attr] ||
                        _this.store.options[attr];
            });
        }
        else {
            //默认值
            var attrs_1 = {};
            formatAttrs.forEach(function (attr) {
                attrs_1[attr] =
                    _this.store.options.defaultFormat[attr] ||
                        _this.store.options[attr] ||
                        undefined;
            });
        }
        localStorage.setItem('meta2d-formatPainter', JSON.stringify(attrs));
    };
    Meta2d.prototype.formatPainter = function () {
        var pens = this.store.active;
        var initPens = deepClone(pens);
        var attrs = JSON.parse(localStorage.getItem('meta2d-formatPainter'));
        for (var i = 0; i < pens.length; i++) {
            var pen = pens[i];
            this.setValue(__assign({ id: pen.id }, attrs), { render: false, doEvent: false });
        }
        this.render();
        this.pushHistory({
            type: EditType.Update,
            initPens: initPens,
            pens: pens,
        });
    };
    Meta2d.prototype.clearFormatPainter = function () {
        var _this = this;
        var pens = this.store.active;
        var initPens = deepClone(pens);
        formatAttrs.forEach(function (attr) {
            for (var i = 0; i < pens.length; i++) {
                var pen = pens[i];
                var _a = _this.store.options, fontSize = _a.fontSize, lineHeight = _a.lineHeight;
                if (attr === 'lineWidth') {
                    pen.lineWidth = 1;
                    pen.calculative.lineWidth = 1;
                }
                else if (attr === 'fontSize') {
                    pen.fontSize = fontSize;
                    pen.calculative.fontSize = fontSize;
                }
                else if (attr === 'lineHeight') {
                    pen.lineHeight = lineHeight;
                    pen.calculative.lineHeight = lineHeight;
                }
                else {
                    delete pen[attr];
                    delete pen.calculative[attr];
                }
            }
        });
        this.render();
        this.pushHistory({
            type: EditType.Update,
            initPens: initPens,
            pens: pens,
        });
    };
    Meta2d.prototype.alignNodes = function (align, pens, rect) {
        var e_8, _a;
        if (pens === void 0) { pens = this.store.data.pens; }
        !rect && (rect = this.getPenRect(this.getRect(pens)));
        var initPens = deepClone(pens); // 原 pens ，深拷贝一下
        try {
            for (var pens_1 = __values(pens), pens_1_1 = pens_1.next(); !pens_1_1.done; pens_1_1 = pens_1.next()) {
                var item = pens_1_1.value;
                this.alignPen(align, item, rect);
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (pens_1_1 && !pens_1_1.done && (_a = pens_1.return)) _a.call(pens_1);
            }
            finally { if (e_8) throw e_8.error; }
        }
        this.render();
        this.pushHistory({
            type: EditType.Update,
            initPens: initPens,
            pens: pens,
        });
    };
    //对齐大屏
    Meta2d.prototype.alignNodesV = function (align, pens) {
        var e_9, _a;
        if (pens === void 0) { pens = this.store.data.pens; }
        var width = this.store.data.width || this.store.options.width;
        var height = this.store.data.height || this.store.options.height;
        var rect = {
            x: 0,
            y: 0,
            width: width,
            height: height,
        };
        var initPens = deepClone(pens); // 原 pens ，深拷贝一下
        try {
            for (var pens_2 = __values(pens), pens_2_1 = pens_2.next(); !pens_2_1.done; pens_2_1 = pens_2.next()) {
                var item = pens_2_1.value;
                this.alignPen(align, item, rect);
            }
        }
        catch (e_9_1) { e_9 = { error: e_9_1 }; }
        finally {
            try {
                if (pens_2_1 && !pens_2_1.done && (_a = pens_2.return)) _a.call(pens_2);
            }
            finally { if (e_9) throw e_9.error; }
        }
        this.pushHistory({
            type: EditType.Update,
            initPens: initPens,
            pens: pens,
        });
    };
    /**
     * 对齐画笔，基于第一个画笔
     * @param align 左对齐，右对齐，上对齐，下对齐，居中对齐
     * @param pens
     */
    Meta2d.prototype.alignNodesByFirst = function (align, pens) {
        if (pens === void 0) { pens = this.store.data.pens; }
        var initPens = deepClone(pens); // 原 pens ，深拷贝一下
        var firstPen = pens[0];
        var rect = this.getPenRect(firstPen);
        for (var i = 1; i < pens.length; i++) {
            var pen = pens[i];
            this.alignPen(align, pen, rect);
        }
        this.render();
        this.pushHistory({
            type: EditType.Update,
            initPens: initPens,
            pens: pens,
        });
    };
    /**
     * 对齐画笔，基于最后选中的画笔
     * @param align 左对齐，右对齐，上对齐，下对齐，居中对齐
     * @param pens
     */
    Meta2d.prototype.alignNodesByLast = function (align, pens) {
        if (pens === void 0) { pens = this.store.data.pens; }
        var initPens = deepClone(pens); // 原 pens ，深拷贝一下
        var lastPen = pens[pens.length - 1];
        var rect = this.getPenRect(lastPen);
        for (var i = 0; i < pens.length - 1; i++) {
            var pen = pens[i];
            this.alignPen(align, pen, rect);
        }
        this.render();
        this.pushHistory({
            type: EditType.Update,
            initPens: initPens,
            pens: pens,
        });
    };
    /**
     * 将画笔参照 rect 进行 align 对齐
     * @param align 左对齐，右对齐，上对齐，下对齐，居中对齐
     * @param pen 当前需要对齐的画笔
     * @param rect 参照矩形
     * @returns
     */
    Meta2d.prototype.alignPen = function (align, pen, rect) {
        var penRect = this.getPenRect(pen);
        switch (align) {
            case 'left':
                penRect.x = rect.x;
                break;
            case 'right':
                penRect.x = rect.x + rect.width - penRect.width;
                break;
            case 'top':
                penRect.y = rect.y;
                break;
            case 'bottom':
                penRect.y = rect.y + rect.height - penRect.height;
                break;
            case 'center':
                penRect.x = rect.x + rect.width / 2 - penRect.width / 2;
                break;
            case 'middle':
                penRect.y = rect.y + rect.height / 2 - penRect.height / 2;
                break;
        }
        this.setValue(__assign({ id: pen.id }, penRect), { render: false, doEvent: false });
    };
    /**
     * 水平或垂直方向的均分
     * @param direction 方向，width 说明水平方向间距相同
     * @param pens 节点们，默认全部的
     * @param distance 总的宽 or 高
     */
    Meta2d.prototype.spaceBetweenByDirection = function (direction, pens, distance) {
        var e_10, _a;
        var _this = this;
        if (pens === void 0) { pens = this.store.data.pens; }
        !distance && (distance = this.getPenRect(this.getRect(pens))[direction]);
        // 过滤出非父节点
        pens = pens.filter(function (item) { return !item.parentId; });
        if (pens.length <= 2) {
            return;
        }
        var initPens = deepClone(pens); // 原 pens ，深拷贝一下
        // 计算间距
        var allDistance = pens.reduce(function (distance, currentPen) {
            var currentPenRect = _this.getPenRect(currentPen);
            return distance + currentPenRect[direction];
        }, 0);
        var space = (distance - allDistance) / (pens.length - 1);
        // 按照大小顺序排列画笔
        pens = pens.sort(function (a, b) {
            if (direction === 'width') {
                return a.x - b.x;
            }
            return a.y - b.y;
        });
        var pen0Rect = this.getPenRect(pens[0]);
        var left = direction === 'width' ? pen0Rect.x : pen0Rect.y;
        try {
            for (var pens_3 = __values(pens), pens_3_1 = pens_3.next(); !pens_3_1.done; pens_3_1 = pens_3.next()) {
                var pen = pens_3_1.value;
                var penRect = this.getPenRect(pen);
                direction === 'width' ? (penRect.x = left) : (penRect.y = left);
                left += penRect[direction] + space;
                this.setValue(__assign({ id: pen.id }, penRect), { render: false, doEvent: false });
            }
        }
        catch (e_10_1) { e_10 = { error: e_10_1 }; }
        finally {
            try {
                if (pens_3_1 && !pens_3_1.done && (_a = pens_3.return)) _a.call(pens_3);
            }
            finally { if (e_10) throw e_10.error; }
        }
        this.render();
        this.pushHistory({
            type: EditType.Update,
            initPens: initPens,
            pens: pens,
        });
    };
    Meta2d.prototype.spaceBetween = function (pens, width) {
        this.spaceBetweenByDirection('width', pens, width);
    };
    Meta2d.prototype.spaceBetweenColumn = function (pens, height) {
        this.spaceBetweenByDirection('height', pens, height);
    };
    Meta2d.prototype.layout = function (pens, width, space) {
        var _this = this;
        if (pens === void 0) { pens = this.store.data.pens; }
        if (space === void 0) { space = 30; }
        var rect = this.getPenRect(getRect(pens));
        !width && (width = rect.width);
        // 1. 拿到全部节点中最大的高
        pens = pens.filter(function (item) { return !item.type && !item.parentId; });
        var initPens = deepClone(pens); // 原 pens ，深拷贝一下
        var maxHeight = 0;
        pens.forEach(function (pen) {
            var penRect = _this.getPenRect(pen);
            penRect.height > maxHeight && (maxHeight = penRect.height);
        });
        // 2. 遍历节点调整位置
        var currentX = rect.x;
        var currentY = rect.y;
        pens.forEach(function (pen, index) {
            var penRect = _this.getPenRect(pen);
            penRect.x = currentX;
            penRect.y = currentY + maxHeight / 2 - penRect.height / 2;
            _this.setValue(__assign({ id: pen.id }, penRect), { render: false, doEvent: false });
            if (index === pens.length - 1) {
                return;
            }
            var currentWidth = currentX + penRect.width - rect.x;
            var nextPenRect = _this.getPenRect(pens[index + 1]);
            if (Math.round(width - currentWidth) >=
                Math.round(nextPenRect.width + space))
                // 当前行
                currentX += penRect.width + space;
            else {
                // 换行
                currentX = rect.x;
                currentY += maxHeight + space;
            }
        });
        this.render();
        this.pushHistory({
            type: EditType.Update,
            initPens: initPens,
            pens: pens,
        });
    };
    Meta2d.prototype.gotoView = function (pen) {
        var center = this.getViewCenter();
        var x = center.x -
            pen.calculative.worldRect.x -
            pen.calculative.worldRect.width / 2;
        var y = center.y -
            pen.calculative.worldRect.y -
            pen.calculative.worldRect.height / 2;
        if (this.canvas.scroll && this.canvas.scroll.isShow) {
            this.canvas.scroll.translate(x - this.store.data.x, y - this.store.data.y);
        }
        this.store.data.x = x;
        this.store.data.y = y;
        this.canvas.canvasImage.init();
        this.canvas.canvasImageBottom.init();
        this.render();
    };
    Meta2d.prototype.showMap = function () {
        if (!this.map) {
            this.map = new ViewMap(this.canvas);
        }
        this.map.show();
    };
    Meta2d.prototype.hideMap = function () {
        this.map.hide();
    };
    Meta2d.prototype.onSizeUpdate = function () {
        var _this = this;
        if (this.mapTimer) {
            clearTimeout(this.mapTimer);
            this.mapTimer = undefined;
        }
        this.mapTimer = setTimeout(function () {
            if (_this.map && _this.map.isShow) {
                _this.map.show();
            }
            if (_this.canvas.scroll && _this.canvas.scroll.isShow) {
                _this.canvas.scroll.resize();
            }
        }, 500);
    };
    Meta2d.prototype.toggleAnchorMode = function () {
        this.canvas.toggleAnchorMode();
    };
    Meta2d.prototype.addAnchorHand = function () {
        this.canvas.addAnchorHand();
    };
    Meta2d.prototype.removeAnchorHand = function () {
        this.canvas.removeAnchorHand();
    };
    Meta2d.prototype.toggleAnchorHand = function () {
        this.canvas.toggleAnchorHand();
    };
    /**
     * 将该画笔置顶，即放到数组最后，最后绘制即在顶部
     * @param pens pen 置顶的画笔
     */
    Meta2d.prototype.top = function (pens) {
        var e_11, _a;
        var _this = this;
        if (!pens)
            pens = this.store.active;
        if (!Array.isArray(pens))
            pens = [pens]; // 兼容
        var _loop_3 = function (pen) {
            var _pens = this_1.store.data.pens;
            // 获取它包含它的子节点
            var allIds = __spreadArray(__spreadArray([], __read(getAllChildren(pen, this_1.store)), false), [pen], false).map(function (p) { return p.id; });
            var allPens = _pens.filter(function (p) { return allIds.includes(p.id); });
            allPens.forEach(function (pen) {
                var index = _pens.findIndex(function (p) { return p.id === pen.id; });
                if (index > -1) {
                    _pens.push(_pens[index]);
                    _pens.splice(index, 1);
                    _this.initTemplateCanvas([pen]);
                    _this.initImageCanvas([pen]);
                }
                _this.specificLayerMove(pen, 'top');
            });
        };
        var this_1 = this;
        try {
            for (var _b = __values(pens), _c = _b.next(); !_c.done; _c = _b.next()) {
                var pen = _c.value;
                _loop_3(pen);
            }
        }
        catch (e_11_1) { e_11 = { error: e_11_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_11) throw e_11.error; }
        }
    };
    /**
     * 若本次改变的画笔存在图片，并且在上层 or 下层，需要擦除上层 or 下层
     * 子节点中包含图片，也需要重绘
     * @param pens 本次改变的 pens
     */
    Meta2d.prototype.initImageCanvas = function (pens) {
        this.canvas.initImageCanvas(pens);
    };
    /**
     * 模版图元图层改变
     * @param pens 本次改变的 pens
     */
    Meta2d.prototype.initTemplateCanvas = function (pens) {
        this.canvas.initTemplateCanvas(pens);
    };
    /**
     * 该画笔置底，即放到数组最前，最后绘制即在底部
     * @param pens 画笔们，注意 pen 必须在该数组内才有效
     */
    Meta2d.prototype.bottom = function (pens) {
        var e_12, _a;
        if (!pens)
            pens = this.store.active;
        if (!Array.isArray(pens))
            pens = [pens]; // 兼容
        var _loop_4 = function (pen) {
            var _pens = this_2.store.data.pens;
            var allIds = __spreadArray(__spreadArray([], __read(getAllChildren(pen, this_2.store)), false), [pen], false).map(function (p) { return p.id; });
            var allPens = _pens.filter(function (p) { return allIds.includes(p.id); });
            var _loop_5 = function (i) {
                var pen_1 = allPens[i];
                var index = _pens.findIndex(function (p) { return p.id === pen_1.id; });
                if (index > -1) {
                    _pens.unshift(_pens[index]);
                    _pens.splice(index + 1, 1);
                    this_2.initTemplateCanvas([pen_1]);
                    this_2.initImageCanvas([pen_1]);
                }
                this_2.specificLayerMove(pen_1, 'bottom');
            };
            // 从后往前，保证 allPens 顺序不变
            for (var i = allPens.length - 1; i >= 0; i--) {
                _loop_5(i);
            }
        };
        var this_2 = this;
        try {
            for (var _b = __values(pens), _c = _b.next(); !_c.done; _c = _b.next()) {
                var pen = _c.value;
                _loop_4(pen);
            }
        }
        catch (e_12_1) { e_12 = { error: e_12_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_12) throw e_12.error; }
        }
    };
    /**
     * data.pens 决定了绘制顺序，即越后面的越在上层
     * 该方法通过区域重叠计算，找出该画笔之后第一个与其重叠的画笔，然后把该画笔放到找出的画笔之后
     * @param pen 画笔
     */
    Meta2d.prototype.upByArea = function (pen) {
        var _a, e_13, _b;
        var _this = this;
        var index = this.store.data.pens.findIndex(function (p) { return p.id === pen.id; });
        if (index === -1) {
            // 画笔不在画布上，不处理
            console.warn('upByArea: pen not in canvas');
            return;
        }
        var allPens = __spreadArray([pen], __read(getAllChildren(pen, this.store)), false);
        var allIndexs = allPens.map(function (p) {
            return _this.store.data.pens.findIndex(function (p2) { return p2.id === p.id; });
        });
        if (allIndexs.includes(-1)) {
            // 画笔不在画布上，脏数据
            console.warn('upByArea: pen children not in canvas');
            allIndexs = allIndexs.filter(function (i) { return i !== -1; });
        }
        var minIndex = Math.min.apply(Math, __spreadArray([], __read(allIndexs), false));
        var penRect = pen.calculative.worldRect;
        var nextHitIndex = this.store.data.pens.findIndex(function (p, i) {
            if (i <= minIndex) {
                // 不考虑前面的
                return false;
            }
            if (p.id === pen.id || isAncestor(p, pen)) {
                // 不考虑后代和自身
                return false;
            }
            var currentRect = p.calculative.worldRect;
            return rectInRect(penRect, currentRect);
        });
        if (nextHitIndex === -1) {
            this.up(pen);
            return;
        }
        (_a = this.store.data.pens).splice.apply(_a, __spreadArray([nextHitIndex + 1, 0], __read(allPens), false));
        var _loop_6 = function (pen_2) {
            var index_1 = this_3.store.data.pens.findIndex(function (p) { return p.id === pen_2.id; });
            if (index_1 > -1) {
                this_3.store.data.pens.splice(index_1, 1);
            }
        };
        var this_3 = this;
        try {
            // 删除靠前的 allPens
            for (var allPens_1 = __values(allPens), allPens_1_1 = allPens_1.next(); !allPens_1_1.done; allPens_1_1 = allPens_1.next()) {
                var pen_2 = allPens_1_1.value;
                _loop_6(pen_2);
            }
        }
        catch (e_13_1) { e_13 = { error: e_13_1 }; }
        finally {
            try {
                if (allPens_1_1 && !allPens_1_1.done && (_b = allPens_1.return)) _b.call(allPens_1);
            }
            finally { if (e_13) throw e_13.error; }
        }
        this.initImageCanvas([pen]);
    };
    //特殊图元层级处理
    Meta2d.prototype.specificLayerMove = function (pen, type) {
        //image
        if (pen.image && pen.name !== 'gif') {
            var isBottom = false;
            if (type === 'bottom' || type === 'down') {
                isBottom = true;
            }
            this.setValue({ id: pen.id, isBottom: isBottom }, { render: false, doEvent: false, history: false });
        }
        //dom
        if (pen.externElement || pen.name === 'gif') {
            var zIndex = 1;
            // let zIndex = pen.calculative.zIndex === undefined ? 5 : pen.calculative.zIndex + 1;
            if (type === 'top') {
                pen.calculative.canvas.maxZindex += 1;
                zIndex = pen.calculative.canvas.maxZindex;
            }
            else if (type === 'up') {
                zIndex =
                    pen.calculative.zIndex === undefined ? 6 : pen.calculative.zIndex + 1;
            }
            else if (type === 'down') {
                zIndex =
                    pen.calculative.zIndex === undefined ? 3 : pen.calculative.zIndex - 1;
                if (zIndex < 1) {
                    zIndex = 1;
                }
            }
            this.setValue({ id: pen.id, zIndex: zIndex }, { render: false, doEvent: false, history: false });
        }
    };
    /**
     * 该画笔上移，即把该画笔在数组中的位置向后移动一个
     * @param pens 画笔
     */
    Meta2d.prototype.up = function (pens) {
        var e_14, _a;
        var _this = this;
        if (!pens)
            pens = this.store.active;
        if (!Array.isArray(pens))
            pens = [pens]; // 兼容
        var _loop_7 = function (pen) {
            var _pens = this_4.store.data.pens;
            if (pen.children && pen.children.length) {
                //组合图元
                var preMovePens = __spreadArray(__spreadArray([], __read(getAllChildren(pen, this_4.store)), false), [pen], false);
                //先保证组合图元的顺序正确。
                var orderPens = [];
                var _loop_8 = function (index) {
                    var _pen = _pens[index];
                    if (preMovePens.findIndex(function (p) { return p.id === _pen.id; }) !== -1) {
                        _pen.temIndex = index;
                        orderPens.push(_pen);
                    }
                };
                for (var index = 0; index < _pens.length; index++) {
                    _loop_8(index);
                }
                var lastIndex_1 = -1;
                var offset_1 = 0;
                orderPens.forEach(function (_pen) {
                    _pen.temIndex -= offset_1;
                    _pens.splice(_pen.temIndex, 1);
                    offset_1 += 1;
                    lastIndex_1 = _pen.temIndex;
                    delete _pen.temIndex;
                    _this.specificLayerMove(_pen, 'up');
                });
                _pens.splice.apply(_pens, __spreadArray([lastIndex_1 + 1, 0], __read(orderPens), false));
                this_4.initTemplateCanvas(orderPens);
                this_4.initImageCanvas(orderPens);
            }
            else {
                var index = _pens.findIndex(function (p) { return p.id === pen.id; });
                if (index > -1 && index !== _pens.length - 1) {
                    _pens.splice(index + 2, 0, _pens[index]);
                    _pens.splice(index, 1);
                    this_4.initTemplateCanvas([pen]);
                    this_4.initImageCanvas([pen]);
                }
                this_4.specificLayerMove(pen, 'up');
            }
        };
        var this_4 = this;
        try {
            for (var _b = __values(pens), _c = _b.next(); !_c.done; _c = _b.next()) {
                var pen = _c.value;
                _loop_7(pen);
            }
        }
        catch (e_14_1) { e_14 = { error: e_14_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_14) throw e_14.error; }
        }
    };
    /**
     * 该画笔下移，即把该画笔在该数组中的位置前移一个
     * @param pen 画笔
     */
    Meta2d.prototype.down = function (pens) {
        var e_15, _a;
        var _this = this;
        if (!pens)
            pens = this.store.active;
        if (!Array.isArray(pens))
            pens = [pens]; // 兼容
        var _loop_9 = function (pen) {
            var _pens = this_5.store.data.pens;
            if (pen.children && pen.children.length) {
                //组合图元
                var preMovePens = __spreadArray(__spreadArray([], __read(getAllChildren(pen, this_5.store)), false), [pen], false);
                //先保证组合图元的顺序正确。
                var orderPens = [];
                var _loop_10 = function (index) {
                    var _pen = _pens[index];
                    if (preMovePens.findIndex(function (p) { return p.id === _pen.id; }) !== -1) {
                        _pen.temIndex = index;
                        orderPens.push(_pen);
                    }
                };
                for (var index = 0; index < _pens.length; index++) {
                    _loop_10(index);
                }
                var firstIndex_1 = -1;
                var offset_2 = 0;
                orderPens.forEach(function (_pen, index) {
                    _pen.temIndex -= offset_2;
                    _pens.splice(_pen.temIndex, 1);
                    offset_2 += 1;
                    if (index === 0) {
                        firstIndex_1 = _pen.temIndex;
                    }
                    delete _pen.temIndex;
                    _this.specificLayerMove(_pen, 'down');
                });
                _pens.splice.apply(_pens, __spreadArray([firstIndex_1 - 1, 0], __read(orderPens), false));
                this_5.initTemplateCanvas(orderPens);
                this_5.initImageCanvas(orderPens);
            }
            else {
                var index = _pens.findIndex(function (p) { return p.id === pen.id; });
                if (index > -1 && index !== 0) {
                    _pens.splice(index - 1, 0, _pens[index]);
                    _pens.splice(index + 1, 1);
                    this_5.initTemplateCanvas([pen]);
                    this_5.initImageCanvas([pen]);
                }
                this_5.specificLayerMove(pen, 'down');
            }
        };
        var this_5 = this;
        try {
            for (var _b = __values(pens), _c = _b.next(); !_c.done; _c = _b.next()) {
                var pen = _c.value;
                _loop_9(pen);
            }
        }
        catch (e_15_1) { e_15 = { error: e_15_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_15) throw e_15.error; }
        }
    };
    Meta2d.prototype.setLayer = function (pen, toIndex, pens) {
        if (pens === void 0) { pens = this.store.data.pens; }
        var index = pens.findIndex(function (p) { return p.id === pen.id; });
        if (index > -1) {
            if (index > toIndex) {
                // 原位置在后，新位置在前
                pens.splice(toIndex, 0, pens[index]);
                pens.splice(index + 1, 1);
            }
            else if (index < toIndex) {
                // 新位置在后
                pens.splice(toIndex, 0, pens[index]);
                pens.splice(index, 1);
            }
        }
    };
    Meta2d.prototype.changePenId = function (oldId, newId) {
        this.canvas.changePenId(oldId, newId);
    };
    /**
     * 得到与当前节点连接的线
     * @param node 节点，非连线
     * @param type 类型，全部的连接线/入线/出线
     */
    Meta2d.prototype.getLines = function (node, type) {
        var _this = this;
        var _a;
        if (type === void 0) { type = 'all'; }
        if (node.type === PenType.Line) {
            return [];
        }
        var lines = [];
        (_a = node.connectedLines) === null || _a === void 0 ? void 0 : _a.forEach(function (_a) {
            var lineId = _a.lineId;
            var line = _this.store.pens[lineId];
            if (!line) {
                console.warn(node, 'node contain a error connectedLine');
                return;
            }
            if (lines.find(function (_line) { return _line.id === line.id; })) {
                //去重
                return;
            }
            switch (type) {
                case 'all':
                    lines.push(line);
                    break;
                case 'in':
                    // 进入该节点的线，即 线锚点的最后一个 connectTo 对应该节点
                    getToAnchor(line).connectTo === node.id && lines.push(line);
                    break;
                case 'out':
                    // 从该节点出去的线，即 线锚点的第一个 connectTo 对应该节点
                    getFromAnchor(line).connectTo === node.id && lines.push(line);
                    break;
            }
        });
        return lines;
    };
    /**
     * 得到当前节点的下一个节点，即出口节点数组
     * 得到当前连线的出口节点
     * @param pen 节点或连线
     */
    Meta2d.prototype.nextNode = function (pen) {
        var _this = this;
        if (pen.type === PenType.Line) {
            var nextNode = this.store.pens[getToAnchor(pen).connectTo];
            return nextNode ? [nextNode] : [];
        }
        else {
            // 1. 得到所有的出线
            var lines = this.getLines(pen, 'out');
            var nextNodes_1 = [];
            // 2. 遍历出线的 nextNode
            lines.forEach(function (line) {
                var e_16, _a;
                var lineNextNode = _this.nextNode(line);
                var _loop_11 = function (node) {
                    var have = nextNodes_1.find(function (next) { return next.id === node.id; });
                    // 3. 不重复的才加进去
                    !have && nextNodes_1.push(node);
                };
                try {
                    for (var lineNextNode_1 = __values(lineNextNode), lineNextNode_1_1 = lineNextNode_1.next(); !lineNextNode_1_1.done; lineNextNode_1_1 = lineNextNode_1.next()) {
                        var node = lineNextNode_1_1.value;
                        _loop_11(node);
                    }
                }
                catch (e_16_1) { e_16 = { error: e_16_1 }; }
                finally {
                    try {
                        if (lineNextNode_1_1 && !lineNextNode_1_1.done && (_a = lineNextNode_1.return)) _a.call(lineNextNode_1);
                    }
                    finally { if (e_16) throw e_16.error; }
                }
            });
            return nextNodes_1;
        }
    };
    /**
     * 得到当前节点的上一个节点，即入口节点数组
     * 得到当前连线的入口节点
     * @param pen 节点或连线
     */
    Meta2d.prototype.previousNode = function (pen) {
        var _this = this;
        if (pen.type === PenType.Line) {
            var preNode = this.store.pens[getFromAnchor(pen).connectTo];
            return preNode ? [preNode] : [];
        }
        else {
            // 1. 得到所有的入线
            var lines = this.getLines(pen, 'in');
            var preNodes_1 = [];
            // 2. 遍历入线的 preNode
            lines.forEach(function (line) {
                var e_17, _a;
                var linePreNode = _this.previousNode(line);
                var _loop_12 = function (node) {
                    var have = preNodes_1.find(function (pre) { return pre.id === node.id; });
                    // 3. 不重复的才加进去
                    !have && preNodes_1.push(node);
                };
                try {
                    for (var linePreNode_1 = __values(linePreNode), linePreNode_1_1 = linePreNode_1.next(); !linePreNode_1_1.done; linePreNode_1_1 = linePreNode_1.next()) {
                        var node = linePreNode_1_1.value;
                        _loop_12(node);
                    }
                }
                catch (e_17_1) { e_17 = { error: e_17_1 }; }
                finally {
                    try {
                        if (linePreNode_1_1 && !linePreNode_1_1.done && (_a = linePreNode_1.return)) _a.call(linePreNode_1);
                    }
                    finally { if (e_17) throw e_17.error; }
                }
            });
            return preNodes_1;
        }
    };
    /**
     * 获取节点所有的下一个连接关系
     * @param pen
     *
     */
    Meta2d.prototype.getNext = function (pen) {
        var _this = this;
        var _a;
        if (pen.type === PenType.Line) {
            console.warn('非连线节点');
            return;
        }
        var next = [];
        (_a = pen.connectedLines) === null || _a === void 0 ? void 0 : _a.forEach(function (_a) {
            var _b, _c;
            var lineId = _a.lineId, anchor = _a.anchor;
            var fromAnchor = (_b = pen.anchors) === null || _b === void 0 ? void 0 : _b.filter(function (_anchor) { return _anchor.id === anchor; })[0];
            var line = _this.findOne(lineId);
            if (line.anchors[0].connectTo == pen.id) {
                //from
                var connectTo = line.anchors[line.anchors.length - 1].connectTo;
                if (connectTo) {
                    var _next = _this.findOne(connectTo);
                    var connectedLine_1 = (_c = _next.connectedLines) === null || _c === void 0 ? void 0 : _c.filter(function (item) { return item.lineId === line.id; })[0];
                    var penAnchor = _next.anchors.filter(function (_anchor) { return _anchor.id === connectedLine_1.anchor; })[0];
                    next.push({
                        from: pen,
                        fromAnchor: fromAnchor,
                        line: line,
                        to: _next,
                        toAnchor: penAnchor,
                    });
                }
            }
        });
        return next;
    };
    /**
     * 为画布添加锚点
     * @param pen 画笔
     * @param anchor 待添加锚点
     * @param index 连线类型 添加锚点到哪个位置
     */
    Meta2d.prototype.addAnchor = function (pen, anchor, index) {
        if (!pen) {
            return;
        }
        if (!pen.anchors) {
            pen.anchors = [];
        }
        if (!pen.calculative.worldAnchors) {
            pen.calculative.worldAnchors = [];
        }
        if (pen.type === PenType.Line) {
            if (index < 0) {
                index = pen.anchors.length + 1 + index;
            }
            if (index > pen.anchors.length) {
                index = pen.anchors.length;
            }
            if (index < 0) {
                index = 0;
            }
            if ((index == 0 && pen.anchors[0].connectTo) ||
                (index == pen.anchors.length && pen.anchors[index - 1].connectTo)) {
                console.warn('端点存在连接关系');
                return;
            }
        }
        var _anchor = null;
        var _worldAnchor = null;
        if (anchor.x <= 1 && anchor.x >= 0 && anchor.y <= 1 && anchor.y >= 0) {
            //relative
            _worldAnchor = {
                id: anchor.id || s8(),
                penId: pen.id,
                x: pen.calculative.worldRect.x +
                    pen.calculative.worldRect.width * anchor.x,
                y: pen.calculative.worldRect.y +
                    pen.calculative.worldRect.height * anchor.y,
            };
            if (pen.calculative.worldRect) {
                if (pen.rotate % 360) {
                    rotatePoint(_worldAnchor, pen.rotate, pen.calculative.worldRect.center);
                }
            }
            _anchor = {
                id: _worldAnchor.id,
                penId: pen.id,
                x: anchor.x,
                y: anchor.y,
            };
        }
        else {
            //absolute
            _worldAnchor = {
                id: anchor.id || s8(),
                penId: pen.id,
                x: anchor.x,
                y: anchor.y,
            };
            if (pen.calculative.worldRect) {
                if (pen.rotate % 360) {
                    rotatePoint(anchor, -pen.rotate, pen.calculative.worldRect.center);
                }
                _anchor = {
                    id: _worldAnchor.id,
                    penId: pen.id,
                    x: (anchor.x - pen.calculative.worldRect.x) /
                        pen.calculative.worldRect.width,
                    y: (anchor.y - pen.calculative.worldRect.y) /
                        pen.calculative.worldRect.height,
                };
            }
        }
        if (pen.type === PenType.Line) {
            //Line
            pen.calculative.worldAnchors.splice(index, 0, _worldAnchor);
            pen.anchors.splice(index, 0, _anchor);
            this.canvas.updateLines(pen);
            this.canvas.initLineRect(pen);
            this.render();
        }
        else {
            //Node
            pen.calculative.worldAnchors.push(_worldAnchor);
            pen.anchors.push(_anchor);
        }
    };
    /**
     *
     * @param from 连接节点
     * @param fromAnchor 连接节点锚点
     * @param to 被连接节点
     * @param toAnchor 被连接节点锚点
     */
    Meta2d.prototype.connectLine = function (from, to, fromAnchor, toAnchor, render) {
        if (render === void 0) { render = true; }
        if (!fromAnchor) {
            var _worldRect = to.calculative.worldRect;
            fromAnchor = nearestAnchor(from, {
                x: _worldRect.x + _worldRect.width / 2,
                y: _worldRect.y + _worldRect.height / 2,
            });
        }
        if (!toAnchor) {
            var _worldRect = from.calculative.worldRect;
            toAnchor = nearestAnchor(to, {
                x: _worldRect.x + _worldRect.width / 2,
                y: _worldRect.y + _worldRect.height / 2,
            });
        }
        var absWidth = Math.abs(fromAnchor.x - toAnchor.x);
        var absHeight = Math.abs(fromAnchor.y - toAnchor.y);
        var line = {
            height: absHeight,
            lineName: 'line',
            lineWidth: 1,
            name: 'line',
            type: 1,
            width: absWidth,
            x: Math.min(fromAnchor.x, toAnchor.x),
            y: Math.min(fromAnchor.y, toAnchor.y),
            anchors: [
                {
                    x: fromAnchor.x > toAnchor.x ? 1 : 0,
                    y: fromAnchor.y > toAnchor.y ? 1 : 0,
                    id: s8(),
                },
                {
                    x: fromAnchor.x > toAnchor.x ? 0 : 1,
                    y: fromAnchor.x > toAnchor.x ? 0 : 1,
                    id: s8(),
                },
            ],
        };
        this.addPens([line]);
        connectLine(from, fromAnchor, line, line.calculative.worldAnchors[0]);
        connectLine(to, toAnchor, line, line.calculative.worldAnchors[1]);
        line.calculative.active = false;
        this.canvas.updateLines(line);
        this.canvas.updateLines(from);
        this.canvas.updateLines(to);
        this.canvas.initLineRect(line);
        if (render) {
            this.render();
        }
        return line;
    };
    /**
     * 生成一个拷贝组合后的 画笔数组（组合图形），不影响原画布画笔，常用作 二次复用的组件
     * @param pens 画笔数组
     * @param showChild 是否作为状态复用（参考 combine showChild）
     * @param anchor 是否产生默认的锚点
     * @returns 组合图形
     */
    Meta2d.prototype.toComponent = function (pens, showChild, anchor) {
        if (pens === void 0) { pens = this.store.data.pens; }
        if (pens.length === 1) {
            var pen = deepClone(pens[0]);
            pen.type = PenType.Node;
            pen.id = undefined;
            return [pen];
        }
        var components = deepClone(pens, true);
        var rect = getRect(components);
        var parent = __assign(__assign({ id: s8(), name: 'combine' }, rect), { children: [], showChild: showChild });
        if (anchor) {
            parent.anchors = [
                {
                    id: '0',
                    penId: parent.id,
                    x: 0.5,
                    y: 0,
                },
                {
                    id: '1',
                    penId: parent.id,
                    x: 1,
                    y: 0.5,
                },
                {
                    id: '2',
                    penId: parent.id,
                    x: 0.5,
                    y: 1,
                },
                {
                    id: '3',
                    penId: parent.id,
                    x: 0,
                    y: 0.5,
                },
            ];
        }
        var p = components.find(function (pen) {
            return pen.width === rect.width && pen.height === rect.height;
        });
        var oneIsParent = p && showChild === undefined;
        if (oneIsParent) {
            if (!p.children) {
                p.children = [];
            }
            parent = p;
        }
        else {
            // 不影响画布数据，生成一个组合图形便于二次复用
            // this.canvas.makePen(parent);
        }
        components.forEach(function (pen) {
            var _a;
            if (pen === parent || pen.parentId === parent.id) {
                return;
            }
            if (pen.parentId) {
                // 已经是其它节点的子节点，x,y,w,h 已经是百分比了
                return;
            }
            parent.children.push(pen.id);
            pen.parentId = parent.id;
            var childRect = calcRelativeRect(pen.calculative.worldRect, rect);
            Object.assign(pen, childRect);
            pen.locked = (_a = pen.lockedOnCombine) !== null && _a !== void 0 ? _a : LockState.DisableMove;
            // pen.type = PenType.Node;
        });
        return oneIsParent
            ? deepClone(components)
            : deepClone(__spreadArray([parent], __read(components), false));
    };
    Meta2d.prototype.setVisible = function (pen, visible, render) {
        var e_18, _a;
        if (render === void 0) { render = true; }
        this.onSizeUpdate();
        this.setValue({ id: pen.id, visible: visible }, { render: false, doEvent: false });
        if (pen.children) {
            try {
                for (var _b = __values(pen.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var childId = _c.value;
                    var child = this.store.pens[childId];
                    child && this.setVisible(child, visible, false);
                }
            }
            catch (e_18_1) { e_18 = { error: e_18_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_18) throw e_18.error; }
            }
        }
        render && this.render();
    };
    Meta2d.prototype.clearHover = function () {
        this.canvas.clearHover();
    };
    Meta2d.prototype.closeSocket = function () {
        this.closeWebsocket();
        this.closeMqtt();
        this.closeHttp();
    };
    Meta2d.prototype.destroy = function (onlyData) {
        this.clear(false);
        this.closeSocket();
        this.closeNetwork();
        this.store.emitter.all.clear(); // 内存释放
        this.canvas.destroy();
        this.canvas = undefined;
        globalStore[this.store.id] = undefined;
        if (!onlyData) {
            for (var k in globalStore) {
                delete globalStore[k];
            }
            globalStore.path2dDraws = {};
            globalStore.canvasDraws = {};
            globalStore.anchors = {};
            globalStore.htmlElements = {};
        }
    };
    return Meta2d;
}());
export { Meta2d };
//# sourceMappingURL=core.js.map