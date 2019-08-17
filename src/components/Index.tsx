import React, { ReactNode } from 'react'
import { matchPath, RouteComponentProps, RouteProps } from 'react-router'

type Path = string | { path: string; replace?: boolean }

type RouteInfo = {
  [key in Exclude<
    keyof RouteComponentProps,
    'history'
  >]: RouteComponentProps[key]
}

interface Guard {
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

interface GlobalConfigT {
  guard: Guard | null
  pendingPlaceholder: (() => ReactNode) | null
}

const GlobalConfig = {
  guard: null,
  pendingPlaceholder: null,
}

enum Status {
  Pending,
  Resolved,
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
function RouterGuard(
  PageComponent: RouteProps['component'],
  guard: GlobalConfigT['guard'] = GlobalConfig.guard,
  pendingPlaceholder: GlobalConfigT['pendingPlaceholder'] = GlobalConfig.pendingPlaceholder,
) {
  if (!guard) return PageComponent

  return class extends React.Component<
    RouteComponentProps<any>,
    { status: Status }
  > {
    constructor(props: RouteComponentProps<any>) {
      super(props)

      this.state = { status: Status.Pending }

      const { match, location, staticContext } = props
      const $guard = guard as Guard
      $guard({ match, location, staticContext }, this.next)
    }

    readonly next: Parameters<
      NonNullable<GlobalConfigT['guard']>
    >[1] = path => {
      const $path = typeof path === 'string' ? { path, replace: false } : path

      if (!$path || matchPath($path.path, this.props.match.path)) {
        this.setState({ status: Status.Resolved })
      } else if ($path.replace) {
        this.props.history.replace($path.path)
      } else {
        this.props.history.push($path.path)
      }
    }

    render() {
      const { props, state } = this
      return state.status === Status.Pending ? (
        pendingPlaceholder && pendingPlaceholder()
      ) : PageComponent ? (
        <PageComponent {...props} />
      ) : null
    }
  } as React.ComponentClass<RouteComponentProps<any>, { status: Status }>
}

export { RouterGuard, GlobalConfig }
