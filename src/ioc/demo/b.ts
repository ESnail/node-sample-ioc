import { Provider } from '../provider'

@Provider('b', [10])
export default class B {
  n: number
  constructor (n: number) {
    this.n = n
  }
}
