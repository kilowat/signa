declare module 'uhtml' {
    function html(strings: TemplateStringsArray, ...values: any[]): HTMLElement;
    function svg(strings: TemplateStringsArray, ...values: any[]): SVGElement;
}
declare module 'uhtml/reactive' {
    export { html, svg } from 'uhtml';
    export function htmlFor<T extends object>(obj: T): (strings: TemplateStringsArray, ...values: any[]) => HTMLElement;
    export function reactive(hook: Function): any;
}
