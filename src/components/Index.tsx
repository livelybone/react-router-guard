import React, { ReactNode } from 'react'
import { RouteComponentProps, RouteProps } from 'react-router'

type Path = string | { path: string; replace?: boolean }

/**
 * The meta info of the route
 * */
type Meta =
  | {
      [key in string | number]: any
    }
  | null

type RouteInfo = RouteComponentProps & { meta: Meta }

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
  (to: RouteInfo, next: (path?: Path) => void): void
}

interface GlobalConfigT {
  guard: Guard | null
  pendingPlaceholder: (() => ReactNode) | null
}

const GlobalConfig: GlobalConfigT = {
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
function RouterGuard(
  PageComponent: RouteProps['component'],
  meta: Meta = null,
  guard: GlobalConfigT['guard'] = GlobalConfig.guard,
  pendingPlaceholder: GlobalConfigT['pendingPlaceholder'] = GlobalConfig.pendingPlaceholder,
):
  | typeof PageComponent
  | React.ComponentClass<RouteComponentProps<any>, { status: Status }> {
  if (!guard) return PageComponent

  return class extends React.Component<
    RouteComponentProps<any>,
    { status: Status }
  > {
    private $isNextCalled: boolean = false
    private $isMounted: boolean = false

    constructor(props: RouteComponentProps<any>) {
      super(props)

      this.state = { status: Status.Pending }

      const $guard = guard as Guard
      $guard(Object.assign({}, props, { meta }), this.next)
    }

    componentDidMount() {
      this.$isMounted = true
    }

    componentWillUnmount() {
      this.$isMounted = false
    }

    readonly next: Parameters<
      NonNullable<GlobalConfigT['guard']>
    >[1] = path => {
      if (this.$isNextCalled) return

      const $path = typeof path === 'string' ? { path, replace: false } : path

      const {
        location: { pathname, search, hash },
      } = this.props
      if (!$path || $path.path === pathname + search + hash) {
        const state = { status: Status.Resolved }
        if (this.$isMounted) this.setState(state)
        else this.state = state
      } else if ($path.replace) {
        this.props.history.replace($path.path)
      } else {
        this.props.history.push($path.path)
      }

      this.$isNextCalled = true
    }

    render() {
      const { props, state } = this
      return state.status === Status.Pending ? (
        pendingPlaceholder && pendingPlaceholder()
      ) : PageComponent ? (
        <PageComponent {...props} />
      ) : null
    }
  }
}

export { RouterGuard, GlobalConfig }
