import * as fs from 'fs'
import { resolve, dirname } from 'path'
import { class_key } from './provider'

// 启动时扫描所有文件，获取定义的类，根据元数据进行绑定
/**
 * 单层目录扫描实现
 * @param container: the global Ioc container
 */
export function load(container, path) {
  const list = fs.readdirSync(path)
  for (const file of list) {
    if (/\.ts$/.test(file)) {
      const exports = require(resolve(path, file))

      for (const m in exports) {
        const module = exports[m]
        if (typeof module === 'function') {
          const metadata = Reflect.getMetadata(class_key, module)
          // register
          if (metadata) {
            container.bind(metadata.id, module, metadata.args)
          }
        }
      }
    }
  }
}