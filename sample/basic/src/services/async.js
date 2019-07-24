
export default function Async() {
  this.name = 'Async'
}

function InsideAsync(provider) {
  console.log('InsideAsync', provider.get('store'));
}

InsideAsync.setup = (p, s) => console.log('InsideAsync setup', p, s)
InsideAsync.ready = (p, s) => console.log('InsideAsync ready', p, s)

Async.setup = (container) => {
  console.log('setup', container)
  container.createContainer(services => {

    services.add(InsideAsync, 'inside')

  }).start().then(provider => provider.get('inside'))
}