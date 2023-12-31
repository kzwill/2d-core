import { Pen } from '../pen';
import { Point } from '../point';
export declare class Title {
    parentElement: HTMLElement;
    box: HTMLElement;
    private currentAnchor;
    constructor(parentElement: HTMLElement);
    /**
     * @returns 此次应该展示的 title
     */
    private static getTitle;
    /**
     * @returns 返回设置前的 rect
     */
    private setText;
    /**
     * 更新文字
     */
    updateText(anchor: Point): void;
    /**
     * 改变文字会 影响 box 的大小，需要重新设置位置
     * @param oldRect 原
     * @param newRect 新
     */
    private changePositionByAnchor;
    private static titleEmpty;
    show(anchor: Point, pen: Pen): void;
    hide(): void;
    destroy(): void;
}
