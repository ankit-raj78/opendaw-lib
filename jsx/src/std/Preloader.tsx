import {Terminable} from "std"
import {createElement} from "../create-element"
import {Html} from "dom"

const className = Html.adoptStyleSheet(`
@keyframes fill {
  from {width: 5%;}
  to {width: 95%;}
}

component {
    position: fixed;
    top: 0;
    left: 0;
    width: 5%;
    height: 2px;
    animation: fill 3s ease-in-out forwards;
    z-index: 999999;
}
`, "__preloader__")

export const Preloader = ({color}: { color?: string }): Terminable => {
    const element: HTMLElement = <div className={className} style={{backgroundColor: color ?? "orange"}}/> as unknown as HTMLElement
    document.body.appendChild(element)
    return {terminate: () => element.remove()}
}