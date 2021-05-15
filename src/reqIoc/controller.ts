import 'reflect-metadata'
export const class_key = 'ioc:controller_class'

export function Controller (prefix = '/') {
  return function (target: any) {

    const props = {
      prefix
    }

    Reflect.defineMetadata(class_key, props, target)
    return target
  }
}