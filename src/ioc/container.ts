import 'reflect-metadata'
import { props_key } from './inject'

export class Container {
  bindMap = new Map()

  // 绑定类信息
  bind(identifier: string, registerClass: any, constructorArgs: any[]) {
    this.bindMap.set(identifier, {registerClass, constructorArgs})
  }

  // 获取实例，将实例绑定到需要注入的对象上
  get<T>(identifier: string): T {
    const target = this.bindMap.get(identifier)
    console.log({identifier, target})
    if (target) {
      const { registerClass, constructorArgs } = target
      // 等价于 const instance = new A([...constructorArgs]) // 假设 registerClass 为定义的类 A
      // 对象实例化的另一种方式，new 后面需要跟大写的类名，而下面的方式可以不用，可以把一个类赋值给一个变量，通过变量实例化类
      const instance = Reflect.construct(registerClass, constructorArgs)

      const props = Reflect.getMetadata(props_key, registerClass)
      console.log({props})
      for (let prop in props) {
        const identifier = props[prop].value
        // 递归获取 injected object
        instance[prop] = this.get(identifier)
      }
      return instance
    }
  }
}