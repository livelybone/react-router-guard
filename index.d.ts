import React, { ReactNode } from 'react'
import { RouteComponentProps, RouteProps, StaticContext } from 'react-router'

export declare type Path =
  | string
  | {
      path: string
      replace?: boolean
    }

export declare type RouteInfo = {
  [key in Exclude<
    keyof RouteComponentProps,
    'history'
  >]: RouteComponentProps[key]
}

export interface Guard {
  /**
   * @param to            Current route info
   *
   * @param next          The guard will decides which route to take when the function is called
   *
   *                      --- const $path = typeof path === 'string' ? { path, replace: false } : path
   *
   *                      if (!$path || matchPath($path.path, this.props.match.path)), then use the current route
   *                      else if ($path.replace), then replace the path to the history
   *                      else if (!$path.replace), then push the path to the history
   * */
  (to: RouteInfo, next: (path?: Path) => void): void
}

export interface GlobalConfigT {
  guard: Guard | null
  pendingPlaceholder: (() => ReactNode) | null
}

declare const GlobalConfig: {
  guard: null
  pendingPlaceholder: null
}

declare enum Status {
  Pending = 0,
  Resolved = 1,
}

/**
 * @param PageComponent
 *        The component you truly want to render
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
 * */
declare function RouterGuard(
  PageComponent: RouteProps['component'],
  guard?: GlobalConfigT['guard'],
  pendingPlaceholder?: GlobalConfigT['pendingPlaceholder'],
):
  | React.ComponentClass<RouteComponentProps<any, StaticContext, any>, any>
  | React.FunctionComponent<RouteComponentProps<any, StaticContext, any>>
  | React.ComponentClass<any, any>
  | React.FunctionComponent<any>
  | React.ComponentClass<
      RouteComponentProps<any, StaticContext, any>,
      {
        status: Status
      }
    >
  | undefined

export { GlobalConfig, RouterGuard }
