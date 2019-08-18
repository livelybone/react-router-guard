import React, { ReactNode } from 'react'
import { RouteComponentProps, RouteProps } from 'react-router'

export declare type Path =
  | string
  | {
      path: string
      replace?: boolean
    }

/**
 * The meta info of the route
 * */
export declare type Meta =
  | {
      [key in string | number]: any
    }
  | null

export declare type RouteInfo = {
  [key in Exclude<
    keyof RouteComponentProps,
    'history'
  >]: RouteComponentProps[key]
} & {
  meta: Meta
}

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
  (to: RouteInfo, next: (path?: Path) => void): void
}

export interface GlobalConfigT {
  guard: Guard | null
  pendingPlaceholder: (() => ReactNode) | null
}

declare const GlobalConfig: GlobalConfigT

declare enum Status {
  Pending = 0,
  Resolved = 1,
}

/**
 * @param PageComponent
 *        The component you truly want to render
 *
 * @param meta
 *
 * @param guard
 *        The guard that decides which route to take
 *
 *        default: GlobalConfig.guard
 *
 * @param pendingPlaceholder
 *        The placeholder shows until the guard call the function `next`
 *
 *        default: GlobalConfig.pendingPlaceholder
 *
 * @return If guard is null, return PageComponent directly
 *         else return a wrapped guard component
 * */
declare function RouterGuard(
  PageComponent: RouteProps['component'],
  meta?: Meta,
  guard?: GlobalConfigT['guard'],
  pendingPlaceholder?: GlobalConfigT['pendingPlaceholder'],
):
  | typeof PageComponent
  | React.ComponentClass<
      RouteComponentProps<any>,
      {
        status: Status
      }
    >

export { GlobalConfig, RouterGuard }
