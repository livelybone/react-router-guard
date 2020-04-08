import React, { ReactNode } from 'react'
import { RouteComponentProps, RouteProps } from 'react-router'
import { GuardConfig, Guard, Meta, Path, Status } from '../type'

function getPathStr(location: Exclude<Path, string>) {
  const { pathname = '/', search = '', hash = '' } = location
  return pathname + search + hash
}

function pathEqual<L extends Exclude<Path, string>>(path: Path, location: L) {
  if (typeof path === 'string') return path === getPathStr(location)
  return getPathStr(path) === getPathStr(location)
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
export function RouterGuard(
  PageComponent: RouteProps['component'],
  meta?: Meta | null,
  guard: GuardConfig['guard'] = RouterGuard.guard,
  pendingPlaceholder: GuardConfig['pendingPlaceholder'] = RouterGuard.pendingPlaceholder,
):
  | typeof PageComponent
  | React.ComponentClass<RouteComponentProps<any>, { status: Status }> {
  if (!guard) return PageComponent

  return class extends React.Component<RouteComponentProps<any>> {
    state = { status: Status.Pending }

    private $isNextCalled: boolean = false
    private $isMounted: boolean = false

    constructor(props: RouteComponentProps<any>) {
      super(props)

      const $guard = guard as Guard
      $guard(
        Object.assign({}, props, { meta: meta || {} }),
        this.next(state => {
          if (this.$isMounted) this.setState(state)
          else this.state = state
        }),
      )
    }

    componentDidMount() {
      this.$isMounted = true
    }

    next(setState?: (state: any) => void) {
      const set = setState || this.setState.bind(this)
      return (path?: Path, replace?: boolean) => {
        if (this.$isNextCalled) return

        if (!path || pathEqual(path, this.props.location)) {
          set({ status: Status.Resolved })
        } else if (replace) {
          this.props.history.replace(path as any)
        } else {
          this.props.history.push(path as any)
        }

        this.$isNextCalled = true
      }
    }

    render() {
      const { props, state } = this
      return state.status === Status.Pending ? (
        pendingPlaceholder && pendingPlaceholder(props, meta)
      ) : PageComponent ? (
        <PageComponent {...props} />
      ) : (
        <></>
      )
    }
  }
}

RouterGuard.guard = null as GuardConfig['guard']

RouterGuard.pendingPlaceholder = null as GuardConfig['pendingPlaceholder']
