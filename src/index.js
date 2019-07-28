import React from 'react'
import { connect, Provider } from 'react-redux'
import BaseContainer from 'jservice'
import ServiceCollection from './collection'
import ServiceProvider from './provider'

// Built-in services
import { Util, Storage, Store } from './services'

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

export function withContainer(registry) {
  return function (ChildComponent) {
    return class extends React.Component {
      constructor(props) {
        super(props)
        const container = createContainer().build(registry)
        container.provider.setAsyncLoadCallback(this.loaded)
        container.start().then(() => this.loaded(''))
        this.state = { container, name: null }
      }
      loaded = name => this.setState({ name })
      render() {
        const store = this.state.container.provider.service('store').getStore()
        const childElement = React.createElement(ChildComponent, {
          container: this.state.container,
          ...this.props
        })
        return React.createElement(
          ContainerContext.Provider,
          { value: this.state },
          !store ? childElement :
            React.createElement(
              Provider,
              { store },
              childElement
            )
        )
      }
    }
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
  and as andState
}
