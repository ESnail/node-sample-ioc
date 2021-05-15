// 将绑定的类注入到什么地方
import 'reflect-metadata'

export const props_key = 'ioc:request_method'

export const params_key = 'ioc:request_method_params'

// 装饰的是类方法，target：类，targetKey: 类的方法名
export function Get (path?: string) {
  return function (target: any, targetKey: string) {
    // 注入对象
    const annotationTarget = target.constructor

    let props = []
    // 同一个类，多个方法
    if (Reflect.hasOwnMetadata(props_key, annotationTarget)) {
      props = Reflect.getMetadata(props_key, annotationTarget)
    }

    const routerName = path ?? ''

    props.push({
      method: 'GET',
      routerName,
      fn: targetKey
    })

    Reflect.defineMetadata(props_key, props, annotationTarget)
  }
}

// 装饰的是类方法的入参，index 代表第几个参数
export function Query () {
  return function (target: any, targetKey: string, index: number) {
    // 注入对象
    const annotationTarget = target.constructor

    const fn = target[targetKey]
    // 函数的参数
    const args = getParamNames(fn)
    // 拿到绑定的参数名；index
    let paramName = ''
    if (fn.length === args.length && index < fn.length) {
      paramName = args[index]
    }

    let props = {}
    // 同一个类，多个方法
    if (Reflect.hasOwnMetadata(params_key, annotationTarget)) {
      props = Reflect.getMetadata(params_key, annotationTarget)
    }

    // 同一方法，多个参数
    const paramNames = props[targetKey] || []
    paramNames.push({type: 'query', index, paramName})
   
    props[targetKey] = paramNames    

    console.log({props, annotationTarget})
    Reflect.defineMetadata(params_key, props, annotationTarget)
  }
}

const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
/**
 * get parameter from function
 * @param func 
 */
export function getParamNames(func): string[] {
  const fnStr = func.toString().replace(STRIP_COMMENTS)
  let result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).split(',').map(content => content.trim().replace(/\s?=.*$/, ''))

  if (result.length === 1 && result[0] === '') {
    result = []
  }
  return result
}