export declare function fileToBase64(file: File): Promise<string>;
export declare function uploadFile(file: File, url: string, params: Record<string, any>, headers: Record<string, string>): Promise<string>;
export declare function loadCss(url: string, success?: any, error?: any): void;
