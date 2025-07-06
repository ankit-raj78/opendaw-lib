import React from "react"
import {createElement} from "../create-element"
import {RouteLocation, RouteMatcher} from "../routes"
import {TerminatorUtils} from "dom"

export const LocalLink = ({href}: { href: string }) => TerminatorUtils
    .watchWeak<HTMLAnchorElement>(
        <a href={href}
           onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
               event.preventDefault()
               RouteLocation.get().navigateTo(href)
           }}/> as unknown as HTMLAnchorElement,
        weakRef => RouteLocation.get().catchupAndSubscribe(location =>
            weakRef.deref()?.classList.toggle("active", RouteMatcher.match(location.path, href))))