declare module 'jsx' {
  export type DomElement = HTMLElement | SVGElement;
  export type JsxValue = null | undefined | boolean | string | number | DomElement | Array<JsxValue>;
  
  export function createElement(
    type: string | ((props: any) => any),
    props?: any,
    ...children: any[]
  ): DomElement;
  
  export function replaceChildren(element: Element, ...children: JsxValue[]): void;
  export function appendChildren(element: Element, ...children: JsxValue[]): void;
  
  export namespace Inject {
    export type ClassList = string | string[] | Record<string, boolean>;
    export type Attribute = string | number | boolean;
    export type Ref<T> = (element: T) => void;
  }
  
  // Standard JSX components
  export const Await: (props: any, children: JsxValue) => DomElement;
  export const Frag: (props: any, children: JsxValue) => DomElement;
  export const Group: (props: any, children?: JsxValue) => DomElement;
  export const Hotspot: (props: any, children: JsxValue) => DomElement;
  export const LocalLink: (props: any, children: JsxValue) => DomElement;
  export const Router: (props: any, children: JsxValue) => DomElement;
  export const Preloader: (props: any, children: JsxValue) => DomElement;
}
