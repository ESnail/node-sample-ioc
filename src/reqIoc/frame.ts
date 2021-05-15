import { Container } from './container'
import { load } from './load'

export default function (ctx) {
  const container = new Container()
  const path = './src/reqIoc/demo'
  load(container, path, ctx)
}