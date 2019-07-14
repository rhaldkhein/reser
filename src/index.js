import React from 'react'
import { connect, Provider } from 'react-redux'
import BaseBuilder from 'jservice'
import ServiceCollection from './collection'
import ServiceProvider from './provider'

// Built-in services
import * as UtilService from './services/util'
import StorageService from './services/storage'
import StoreService from './services/store'

// DI container contexts
const ContainerContext = React.createContext()
const AsyncCountContext = React.createContext(0)

class ReactJService extends BaseBuilder {

  constructor() {
    super()
    this.collection = new ServiceCollection(this)
    this.provider = new ServiceProvider(this.collection)
  }

  createScopedProvider() {
    throw new Error('Scoped providers are not supported yet')
  }

}

function createContainer() {
  return new ReactJService()
    .build(services => {
      services.add(UtilService, '@util')
      services.add(StorageService)
      services.add(StoreService)
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
        this.state = { count: 0 }
        this.container = createContainer().build(registry)
        this.container.start().then(() => this.forceUpdate())
        this.contextValue = {
          provider: this.container.provider,
          asyncLoaded: () => {
            this.setState({ count: this.state.count + 1 })
          }
        }
      }
      render() {
        const store = this.container.provider.service('@store').getStore()
        const childElement = React.createElement(ChildComponent, {
          container: this.container,
          ...this.props
        })
        return React.createElement(
          ContainerContext.Provider,
          { value: this.contextValue },
          React.createElement(
            AsyncCountContext.Provider,
            { value: this.state.count },
            !store ? childElement :
              React.createElement(
                Provider,
                { store },
                childElement
              ))
        )
      }
    }
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
        function (container) {
          return React.createElement(AsyncCountContext.Consumer, null,
            function () {
              return React.createElement(ChildComponent, {
                services: container.provider.createServices(
                  serviceNames,
                  container.asyncLoaded
                ),
                ...props
              })
            }
          )
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
    return connect(state => ({ state: mapStateToProps(serviceNames, state) }))(
      ChildComponent
    )
  }
}

export function andService(...serviceNames) {
  return serviceNames
}

export function andState(...serviceNames) {
  return serviceNames
}

export {
  createContainer,
  StorageService,
  StoreService
}
