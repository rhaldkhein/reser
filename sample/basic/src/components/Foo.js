import { withService } from "../reser"

function Foo(props) {
  console.log(props)
  return null
}

const services = {
  async: false,
  user: s => ({
    email: s.email + 'nice!'
  })
}

export default withService(services)(Foo)