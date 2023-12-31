/// <reference types="offscreencanvas" />
import { Meta2dStore } from '../store';
export declare class CanvasTemplate {
    parentElement: HTMLElement;
    store: Meta2dStore;
    canvas: HTMLCanvasElement;
    offscreen: HTMLCanvasElement | OffscreenCanvas;
    bgOffscreen: HTMLCanvasElement | OffscreenCanvas;
    patchFlags: boolean;
    bgPatchFlags: boolean;
    constructor(parentElement: HTMLElement, store: Meta2dStore);
    resize(w?: number, h?: number): void;
    init(): void;
    hidden(): void;
    show(): void;
    clear(): void;
    render(): void;
    renderGrid(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D): void;
}
