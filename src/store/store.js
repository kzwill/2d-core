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
import { default as mitt } from 'mitt';
import { defaultOptions } from '../options';
import { globalStore } from './global';
export var EditType;
(function (EditType) {
    EditType[EditType["Add"] = 0] = "Add";
    EditType[EditType["Update"] = 1] = "Update";
    EditType[EditType["Delete"] = 2] = "Delete";
})(EditType || (EditType = {}));
export var createStore = function () {
    return {
        data: {
            x: 0,
            y: 0,
            scale: 1,
            pens: [],
            origin: { x: 0, y: 0 },
            center: { x: 0, y: 0 },
            paths: {},
        },
        histories: [],
        pens: {},
        path2dMap: new WeakMap(),
        animateMap: new WeakMap(),
        active: [],
        animates: new Set(),
        options: __assign({}, defaultOptions),
        emitter: mitt(),
        bindDatas: {},
        bind: {},
        pensNetwork: {},
        cacheDatas: [],
        messageEvents: {},
        templatePens: {},
    };
};
// Return a data store, if not exists will create a store.
export var useStore = function (id) {
    if (id === void 0) { id = 'default'; }
    if (!globalStore[id]) {
        globalStore[id] = createStore();
        globalStore[id].id = id;
    }
    return globalStore[id];
};
export var clearStore = function (store, template) {
    var e_1, _a;
    var isSame = store.data.template === template;
    if (isSame) {
        try {
            //模版一样
            for (var _b = __values(store.data.pens), _c = _b.next(); !_c.done; _c = _b.next()) {
                var pen = _c.value;
                if (pen.template) {
                    store.templatePens[pen.id] = pen;
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
    }
    store.lastScale = store.data.scale;
    store.data = {
        x: 0,
        y: 0,
        scale: 1,
        pens: [],
        origin: { x: 0, y: 0 },
        center: { x: 0, y: 0 },
        paths: {},
        template: isSame ? template : null,
    };
    store.sameTemplate = isSame;
    store.pens = {};
    store.histories = [];
    store.historyIndex = null;
    store.path2dMap = new WeakMap();
    store.animateMap = new WeakMap();
    store.bindDatas = {};
    store.bind = {};
    store.pensNetwork = {};
    store.active = [];
    store.hover = undefined;
    store.lastHover = undefined;
    store.animates.clear();
};
//# sourceMappingURL=store.js.map