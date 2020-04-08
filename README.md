# router-guard
[![NPM Version](http://img.shields.io/npm/v/router-guard.svg?style=flat-square)](https://www.npmjs.com/package/router-guard)
[![Download Month](http://img.shields.io/npm/dm/router-guard.svg?style=flat-square)](https://www.npmjs.com/package/router-guard)
![gzip with dependencies: 1.3kb](https://img.shields.io/badge/gzip--with--dependencies-1.3kb-brightgreen.svg "gzip with dependencies: 1.3kb")
![typescript](https://img.shields.io/badge/typescript-supported-blue.svg "typescript")
![pkg.module](https://img.shields.io/badge/pkg.module-supported-blue.svg "pkg.module")

> `pkg.module supported`, which means that you can apply tree-shaking in you project

A higher-order component for react-router v4 that implements routing guards

## repository
https://github.com/livelybone/react-router-guard.git

## Demo
https://github.com/livelybone/react-router-guard#readme

## Run Example
Your can see the usage by run the example of the module, here is the step:

1. Clone the library `git clone https://github.com/livelybone/react-router-guard.git`
2. Go to the directory `cd your-module-directory`
3. Install npm dependencies `npm i`(use taobao registry: `npm i --registry=http://registry.npm.taobao.org`)
4. Open service `npm run dev`
5. See the example(usually is `http://127.0.0.1/examples/test.html`) in your browser

## Installation
```bash
npm i -S router-guard
```

## Global name
`RouterGuard`

## Interface
See in [index.d.ts](./index.d.ts)

## Usage
```typescript jsx
import React from 'react'
import { Route } from 'react-router'
import ReactDOM, { BrowserRouter } from 'react-router-dom'
import { RouterGuard } from 'router-guard'

RouterGuard.guard = (to, next) => {
  if(to.meta.needAuth && !authorized) {
    // pushState '/sign-in'
    next('/sign-in')
    
    // or 
    // next({ path: '/sign-in', replace: true } )
  } else {
    next()
  }
}

RouterGuard.pendingPlaceholder = () => 'Loading...'

const Dashboard: React.FC = () => <div>dashboard</div>

const SignIn: React.FC = () => <div className="sign-in">sign-in</div>

const Layout: React.FC = () => {
  return (
    <BrowserRouter>
      <Route path="/some-path" component={RouterGuard(Dashboard, { needAuth: true })} />
      <Route path="/sign-in" component={RouterGuard(Dashboard)} />
    </BrowserRouter>
  )
}

ReactDOM.render(<Layout />, document.getElementById('root'))
```

### One Route one guard
You can custom the guard and pendingPlaceholder to cover the global config on a Route

Use in html, see what your can use in [CDN: unpkg](https://unpkg.com/router-guard/lib/umd/)
```html
<-- use what you want -->
<script src="https://unpkg.com/router-guard/lib/umd/<--module-->.js"></script>
```
