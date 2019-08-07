
export default function Async() {
  this.name = 'Async'
}

function InsideAsync(provider) {
  console.log('InsideAsync', provider.get('store'));
}

InsideAsync.setup = (p, s) => console.log('InsideAsync setup', p, s)
InsideAsync.ready = (p, s) => console.log('InsideAsync ready', p, s)

Async.setup = (container) => {
  console.log('Async setup', container)
  container.createContainer(services => {

    services.add(InsideAsync, 'inside')

  }).start().then(provider => {
    provider.get('inside')
    const func = provider.get('func')
    console.log('X', func);
  })
}

Async.start = provider => {
  console.log('Async start')
  return new Promise(resolve => setTimeout(resolve, 3000))
}

Async.ready = provider => {
  console.log('Async ready')
}