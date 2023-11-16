export declare class Dialog {
    parentElement: HTMLElement;
    box: HTMLElement;
    iframe: HTMLElement;
    dialog: HTMLElement;
    close: HTMLElement;
    title: HTMLElement;
    x: number;
    y: number;
    constructor(parentElement: HTMLElement);
    show(title?: string, url?: string): void;
    hide(): void;
    destroy(): void;
}
