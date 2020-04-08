import { LocationState, LocationDescriptorObject } from 'history'
import { ReactNode } from 'react'
import { RouteComponentProps } from 'react-router'

export type Path = string | LocationDescriptorObject<LocationState>
/**
 * The meta info of the route
 * */
export type Meta = {
  [key in string | number]: any
}

export type RouteInfo = RouteComponentProps & { meta: Meta }

export interface Guard {
  /**
   * @param to            Current route info
   *
   * @param next          The guard will decides which route to take when the function is called
   *
   *                      --- const $path = typeof path === 'string' ? { path, replace: false } : path
   *                          const { location: { pathname, search, hash } } = this.props
   *
   *                      if (!$path || $path.path === pathname + search + hash), then use the current route
   *                      else if ($path.replace), then replace the path to the history
   *                      else if (!$path.replace), then push the path to the history
   * */
  (to: RouteInfo, next: (path?: Path, replace?: boolean) => void): void
}

export interface GuardConfig {
  guard: Guard | null
  pendingPlaceholder:
    | ((props: RouteComponentProps<any>, meta?: Meta | null) => ReactNode)
    | null
}

export enum Status {
  Pending,
  Resolved,
}
