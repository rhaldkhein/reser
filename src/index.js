import React from 'react'
import { connect, Provider } from 'react-redux'
import BaseContainer from 'jservice'
import ServiceCollection from './collection'
import ServiceProvider from './provider'
import { Util } from 'jservice-common'
import { Storage, Store } from 'jservice-frontend'

// DI container contexts
const ContainerContext = React.createContext()

class Container extends BaseContainer {

  constructor() {
    super()
    this.collection = new ServiceCollection(this)
    this.provider = new ServiceProvider(this.collection)
  }

  createProvider() {
    throw new Error('Scoped providers are not supported yet')
  }

}

function createContainer() {
  return new Container()
    .build(services => {
      services.add(Util)
      services.add(Storage)
      services.add(Store)
    })
}

function mapStateToProps(serviceNames, state) {
  return serviceNames.reduce((result, name) => {
    const val = state[name]
    if (val) result[name] = val
    return result
  }, {})
}

function withHigherContainer(ChildComponent) {
  return function (props) {
    return React.createElement(ContainerContext.Consumer, null,
      function (contextValue) {
        return React.createElement(ChildComponent, {
          container: contextValue && contextValue.container,
          ...props
        })
      }
    )
  }
}

export function withContainer(registry, configure) {
  return function (ChildComponent) {
    // Single event emitter for loading services
    let _fn = null
    function listen(fn) {
      _fn = fn
      return () => (_fn = null)
    }
    // Build up container
    const container = createContainer().build(registry)
    if (configure) configure(container)
    let contextValue = { container }
    const loaded = (name) => {
      contextValue = { container }
      _fn && _fn(name)
    }
    container.provider.setAsyncLoadCallback(loaded)
    container.on('ready', loaded)

    class ContainerComponent extends React.Component {
      constructor(props) {
        super(props)
        // Contains higher container
        if (!container.parent && props.container)
          container.setParent(props.container)
        // Start own local container
        container.start()
        this.off = listen(name => this.setState({ name }))
      }
      componentWillUnmount() {
        this.off()
        this.off = null
      }
      render() {
        const store = container.provider.service('store').getStore()
        const childElement = React.createElement(
          ChildComponent,
          { ...this.props, container }
        )
        return React.createElement(
          ContainerContext.Provider,
          { value: contextValue },
          !store ? childElement :
            React.createElement(
              Provider,
              { store },
              childElement
            )
        )
      }
    }
    return withHigherContainer(ContainerComponent)
  }
}

export function withProvider(ChildComponent) {
  return function (props) {
    return React.createElement(ContainerContext.Consumer, null,
      function ({ container }) {
        return React.createElement(ChildComponent, {
          provider: container.provider,
          ...props
        })
      }
    )
  }
}

export function withService(...serviceNames) {
  const first = serviceNames[0]
  if (typeof first === 'object' && !Array.isArray(first))
    return withServiceObject(first)
  // Continue using services in arguments
  return function (ChildComponent) {
    if (Array.isArray(serviceNames[serviceNames.length - 1])) {
      const states = serviceNames.pop()
      ChildComponent = withState.apply(null,
        states.length ? states : serviceNames)(ChildComponent)
    }
    return function (props) {
      return React.createElement(ContainerContext.Consumer, null,
        function ({ container }) {
          return React.createElement(ChildComponent, {
            provider: container.provider,
            services: container.provider.createServices(serviceNames),
            ...props
          })
        }
      )
    }
  }
}

export function withServiceObject(services) {
  return function (ChildComponent) {
    const serviceNames = Object.keys(services)
      .filter(key => !!services[key])
    const serviceStates = serviceNames
      .filter(key => typeof services[key] === 'function')
    if (serviceStates.length) {
      ChildComponent = connect(
        state => ({
          state: serviceStates
            .reduce((result, key) => {
              result[key] = services[key](state[key])
              return result
            }, {})
        })
      )(ChildComponent)
    }
    return function (props) {
      return React.createElement(ContainerContext.Consumer, null,
        function ({ container }) {
          return React.createElement(ChildComponent, {
            provider: container.provider,
            services: container.provider.createServices(serviceNames),
            ...props
          })
        }
      )
    }
  }
}

export function withState(...serviceNames) {
  return function (ChildComponent) {
    if (Array.isArray(serviceNames[serviceNames.length - 1])) {
      const services = serviceNames.pop()
      ChildComponent = withService.apply(null,
        services.length ? services : serviceNames)(ChildComponent)
    }
    return connect(
      state => ({
        state: typeof serviceNames[0] === 'function' ?
          serviceNames[0](state) :
          mapStateToProps(serviceNames, state)
      })
    )(ChildComponent)
  }
}

export function and(...serviceNames) {
  return Array.isArray(serviceNames[0]) ? serviceNames[0] : serviceNames
}

export {
  // HOC
  createContainer,
  and as andService,
  and as andState,
  Util,
  Storage,
  Store
}
