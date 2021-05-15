import 'reflect-metadata'
import * as camelcase from 'camelcase'
export const class_key = 'ioc:tagged_class'

// Provider 装饰的类，表明是要注册到Ioc容器中
export function Provider (identifier?: string, args?: Array<any>) {
  return function (target: any) {
    // 驼峰命名
    identifier = identifier ?? camelcase(target.name)

    console.log(identifier, target.name, 'nn')
    Reflect.defineMetadata(class_key, {
      id: identifier, // key，用来注册Ioc容器
      args: args || [] // 实例化所需参数
    }, target)
    return target
  }
}