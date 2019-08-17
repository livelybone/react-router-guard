import React, { ReactNode } from 'react'
import { RouteComponentProps, RouteProps, StaticContext } from 'react-router'

declare type Path =
  | string
  | {
      path: string
      replace?: boolean
    }

interface Guard {
  (to: RouteComponentProps, next: (path?: Path) => void): void
}

declare enum Status {
  Pending = 0,
  Resolved = 1,
}

declare function RouteGuard(
  PageComponent: RouteProps['component'],
  guard: Guard,
  pendingPlaceholder?: (() => ReactNode) | null,
): {
  new (props: RouteComponentProps<any, StaticContext, any>): {
    readonly next: (
      path?:
        | string
        | {
            path: string
            replace?: boolean | undefined
          }
        | undefined,
    ) => void
    render(): {} | null | undefined
    context: any
    setState<K extends 'status'>(
      state:
        | {
            status: Status
          }
        | ((
            prevState: Readonly<{
              status: Status
            }>,
            props: Readonly<RouteComponentProps<any, StaticContext, any>>,
          ) =>
            | {
                status: Status
              }
            | Pick<
                {
                  status: Status
                },
                K
              >
            | null
          )
        | Pick<
            {
              status: Status
            },
            K
          >
        | null,
      callback?: (() => void) | undefined,
    ): void
    forceUpdate(callback?: (() => void) | undefined): void
    readonly props: Readonly<RouteComponentProps<any, StaticContext, any>> &
      Readonly<{
        children?: React.ReactNode
      }>
    state: Readonly<{
      status: Status
    }>
    refs: {
      [key: string]: React.ReactInstance
    }
  }
  contextType?: React.Context<any> | undefined
}

export default RouteGuard
