import { Meta2d } from '../core';
import { IValue, Pen } from '../pen';
import { Network } from '../store';
export declare type EventValue = string | IValue | undefined | null;
export declare type EventName = 'enter' | 'leave' | 'active' | 'inactive' | 'click' | 'mousedown' | 'mouseup' | 'dblclick' | 'valueUpdate' | 'message' | 'contextmenu';
export interface Event {
    name: EventName;
    action: EventAction;
    where?: Where;
    value?: EventValue;
    params?: string;
    extend?: string;
    fn?: (pen: Pen, params: string, context?: {
        meta2d: Meta2d;
        eventName: string;
    }) => void;
    targetType?: string;
    network?: Network;
    actions?: Event[];
    conditions?: TriggerCondition[];
    conditionType?: string;
    message?: string;
}
export declare enum EventAction {
    Link = 0,
    SetProps = 1,
    StartAnimate = 2,
    PauseAnimate = 3,
    StopAnimate = 4,
    JS = 5,
    GlobalFn = 6,
    Emit = 7,
    StartVideo = 8,
    PauseVideo = 9,
    StopVideo = 10,
    SendPropData = 11,
    SendVarData = 12,
    Navigator = 13,
    Dialog = 14,
    SendData = 15,
    PostMessage = 16,
    PostMessageToParent = 17
}
export interface Where {
    type?: string | 'comparison';
    key?: string;
    comparison?: Comparison;
    value?: unknown;
    fn?: (pen: Pen, context?: {
        meta2d: Meta2d;
    }) => boolean;
    fnJs?: string;
}
/**
 * 触发器中的符号
 */
export declare type Comparison = '=' | '==' | '!=' | '>' | '<' | '>=' | '<=' | '[)' | '![)'
/**
 * 属于，类似于 数组的 includes
 * .. 属于范围语法，30..50 等价于 介于的 [30, 50]
 * [1, 2, 3]  2 // true  1.5 // false
 * [1,20,30..50,65] 1 // true 20 // true 30 // true 30.1 // true
 */
 | '[]' | '![]';
export interface TriggerCondition {
    type?: string;
    operator?: Comparison;
    valueType?: string;
    value?: string;
    target?: string;
    label?: string;
    fnJs?: string;
    fn?: (pen: Pen, context?: {
        meta2d: Meta2d;
    }) => boolean;
    key?: string;
}
export interface Trigger {
    name?: string;
    conditionType?: string;
    conditions?: TriggerCondition[];
    actions?: Event[];
}
export interface Bind {
    case?: string;
    id?: string;
    label?: string;
}
export interface RealTime {
    label?: string;
    key?: string;
    type?: string;
    keywords?: true;
    triggers?: Trigger[];
    bind?: Bind;
    value?: string;
    enableMock?: boolean;
    mock?: any;
}
