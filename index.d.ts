import { LocationDescriptorObject, LocationState } from 'history'
import React, { ReactNode } from 'react'
import { RouteComponentProps, RouteProps, StaticContext } from 'react-router'

declare type Path = string | LocationDescriptorObject<LocationState>
/**
 * The meta info of the route
 * */
declare type Meta = {
  [key in string | number]: any
}
declare type RouteInfo = RouteComponentProps & {
  meta: Meta
}

interface Guard {
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

interface GuardConfig {
  guard: Guard | null
  pendingPlaceholder:
    | ((props: RouteComponentProps<any>, meta?: Meta | null) => ReactNode)
    | null
}

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
  meta?: Meta | null,
  guard?: GuardConfig['guard'],
  pendingPlaceholder?: GuardConfig['pendingPlaceholder'],
):
  | typeof PageComponent
  | React.ComponentClass<
      RouteComponentProps<any>,
      {
        status: Status
      }
    >

declare namespace RouterGuard {
  var guard: Guard | null
  var pendingPlaceholder:
    | ((
        props: RouteComponentProps<any, StaticContext, any>,
        meta?: Meta | null | undefined,
      ) => React.ReactNode)
    | null
}

export { Guard, GuardConfig, Meta, Path, RouteInfo, RouterGuard, Status }
