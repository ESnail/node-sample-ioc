import { Provider } from '../provider'

@Provider()
export default class B {
  getProps (id?: string, name?: string) {
    return {
      id: id || 'mock',
      name: name || 'mock',
    };
  }
}