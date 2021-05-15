import { Container } from './container'
import { load } from './load'

export default function () {

  const container = new Container()
  const path = './src/ioc/demo'
  load(container, path)

  const a:any = container.get('a')
  console.log(a); // A => {b: B {n: 10}}
  a.c.print() // hello
}