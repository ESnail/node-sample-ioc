import { Provider } from "../provider";
import { Inject } from "../inject";
import B from './b'
import C from './c'

@Provider('a')
export default class A {
  @Inject()
  private b: B

  @Inject()
  c: C

  print () {
    this.c.print()
  }
}