import React, { ReactNode } from 'react'
import { matchPath, RouteComponentProps, RouteProps } from 'react-router'

type Path = string | { path: string; replace?: boolean }

interface Guard {
  (to: RouteComponentProps, next: (path?: Path) => void): void
}

enum Status {
  Pending,
  Resolved,
}

function RouteGuard(
  PageComponent: RouteProps['component'],
  guard: Guard,
  pendingPlaceholder: (() => ReactNode) | null = null,
) {
  return class extends React.Component<
    RouteComponentProps<any>,
    { status: Status }
  > {
    constructor(props: RouteComponentProps<any>) {
      super(props)

      this.state = { status: Status.Pending }

      guard(props, this.next)
    }

    readonly next: Parameters<Guard>[1] = path => {
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
      return this.state.status === Status.Pending ? (
        pendingPlaceholder && pendingPlaceholder()
      ) : PageComponent ? (
        <PageComponent {...this.props} />
      ) : null
    }
  }
}

export default RouteGuard
