import { Emitter } from 'mitt';
import { FormItem, LockState, Pen } from '../pen';
import { Options } from '../options';
import { Point } from '../point';
import { Rect } from '../rect';
import { Event } from '../event';
export interface Meta2dData {
    pens: Pen[];
    x: number;
    y: number;
    scale: number;
    origin: Point;
    center: Point;
    locked?: LockState;
    websocket?: string;
    mqtt?: string;
    mqttOptions?: {
        clientId?: string;
        username?: string;
        password?: string;
        customClientId?: boolean;
    };
    mqttTopics?: string;
    websocketProtocols?: string | string[];
    background?: string;
    globalAlpha?: number;
    socketCbJs?: string;
    initJs?: string;
    grid?: boolean;
    gridColor?: string;
    gridSize?: number;
    gridRotate?: number;
    rule?: boolean;
    ruleColor?: string;
    fromArrow?: string;
    toArrow?: string;
    lineWidth?: number;
    color?: string;
    textColor?: string;
    penBackground?: string;
    paths?: {
        [key: string]: string;
    };
    bkImage?: string;
    http?: string;
    httpTimeInterval?: number;
    httpHeaders?: HeadersInit;
    version?: string;
    id?: string;
    _id?: string;
    https?: HttpOptions[];
    width?: number;
    height?: number;
    networkInterval?: number;
    networks?: Network[];
    iconUrls?: string[];
    mockData?: Function;
    name?: string;
    enableMock?: boolean;
    minScale?: number;
    maxScale?: number;
    template?: string;
    cancelFirstConnect?: boolean;
    component?: boolean;
}
export interface Network {
    name?: string;
    protocol?: 'mqtt' | 'websocket' | 'http';
    type?: string;
    url?: string;
    protocols?: string;
    topics?: string;
    options?: {
        clientId?: string;
        username?: string;
        password?: string;
        customClientId?: boolean;
    };
    headers?: any;
    method?: string;
    body?: any;
}
export interface HttpOptions {
    http?: string;
    httpTimeInterval?: number;
    httpHeaders?: HeadersInit;
    method?: string;
    body?: BodyInit | null;
}
export declare enum EditType {
    Add = 0,
    Update = 1,
    Delete = 2
}
export interface EditAction {
    type?: EditType;
    initPens?: Pen[];
    pens?: Pen[];
    step?: number;
    origin?: Point;
    scale?: number;
}
export interface Meta2dStore {
    id: string;
    data: Meta2dData;
    pens: {
        [key: string]: Pen;
    };
    histories?: EditAction[];
    historyIndex?: number;
    path2dMap: WeakMap<Pen, Path2D>;
    animateMap: WeakMap<Pen, Pen>;
    bindDatas: {
        [key: string]: {
            id: string;
            formItem: FormItem;
        }[];
    };
    bind?: {
        [key: string]: {
            id: string;
            key: string;
        }[];
    };
    active?: Pen[];
    hover?: Pen;
    lastHover?: Pen;
    activeAnchor?: Point;
    hoverAnchor?: Point;
    pointAt?: Point;
    pointAtIndex?: number;
    animates: Set<Pen>;
    options: Options;
    emitter: Emitter;
    dpiRatio?: number;
    clipboard?: Meta2dClipboard;
    patchFlagsTop?: boolean;
    bkImg?: HTMLImageElement;
    fillWorldTextRect?: boolean;
    cacheDatas?: {
        data: Meta2dData;
    }[];
    patchFlagsLast?: boolean;
    messageEvents?: {
        [key: string]: {
            pen: Pen;
            event: Event;
        }[];
    };
    templatePens?: {
        [key: string]: Pen;
    };
    sameTemplate?: boolean;
    lastScale?: number;
    pensNetwork?: {
        [key: string]: {
            url?: string;
            method?: string;
            headers?: any;
            body?: any;
        };
    };
}
export interface Meta2dClipboard {
    meta2d?: boolean;
    pens: Pen[];
    origin: Point;
    scale: number;
    offset?: number;
    page: string;
    initRect?: Rect;
    pos?: Point;
}
export declare const createStore: () => Meta2dStore;
export declare const useStore: (id?: string) => Meta2dStore;
export declare const clearStore: (store: Meta2dStore, template?: string) => void;
