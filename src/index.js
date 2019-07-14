import React from 'react'
import BaseBuilder from 'jservice'

import ServiceCollection from './collection'
import ServiceProvider from './provider'

const ContainerContext = React.createContext()

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
}

export function withContainer(ChildComponent, registry) {
  return class extends React.Component {
    constructor(props) {
      super(props)
      this.state = {}
      this.container = createContainer().build(registry)
      this.contextValue = {
        provider: this.container.provider,
        asyncLoaded: () => {
          this.setState({})
        }
      }
    }
    render() {
      return React.createElement(
        ContainerContext.Provider,
        { value: this.contextValue },
        React.createElement(ChildComponent, {
          container: this.container,
          ...this.props
        })
      )
    }
  }
}

export function withService(ChildComponent, ...serviceNames) {
  return function (props) {
    return React.createElement(
      ContainerContext.Consumer,
      null,
      function (container) {
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
}

export {
  createContainer
}