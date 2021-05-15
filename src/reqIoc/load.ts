import * as fs from 'fs'
import { resolve } from 'path'
import { class_key } from './provider'
import { class_key as controller_class_key } from './controller'
import { props_key, params_key } from './request'

const req_mthods_key = 'req_methods'
const joinSymbol = '_|_'

// 启动时扫描所有文件，获取定义的类，根据元数据进行绑定
/**
 * 单层目录扫描实现
 * @param container: the global Ioc container
 * @param path: 扫描路径
 * @param ctx: 上下文，没有用框架，所以 ctx = {req, res}。而 req、res 是 server.on('request', function (req, res) {}
 */
export function load(container, path, ctx) {
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

            // 上面的代码逻辑是基础版，下面的是新增的

            // 先收集 Controller 上的 prefix 信息，请求方法的绑定函数 Get，函数对应的参数 Query
            const controllerMetadata = Reflect.getMetadata(controller_class_key, module)
            if (controllerMetadata) {
              const reqMethodMetadata = Reflect.getMetadata(props_key, module)

              if (reqMethodMetadata) {
                // 只需要存储信息，不需要额外的操作。简单起见，把所有请求信息都放到一个对象中了，方便后续根据接口请求及入参进行判断响应
                const methods = container.getReq(req_mthods_key) || {};
                const reqMethodParamsMetadata = Reflect.getMetadata(params_key, module)

                // 将收集到的信息整理放到容器中
                reqMethodMetadata.forEach(item => {
                  // 完整的请求路径
                  const path = controllerMetadata.prefix + item.routerName
                  // 用请求方法和完整路径作为 key
                  methods[item.method + joinSymbol + path] = {
                    id: metadata.id, // Controll 类
                    fn: item.fn, // Get 方法
                    args: reqMethodParamsMetadata ? reqMethodParamsMetadata[item.fn] || [] : [] // Get 方法 Query 参数
                  }
                })

                container.bindReq(req_mthods_key, methods)
              }
            }
          }
        }
      }
    }
  }

  // 将所有请求数据拿出来，根据请求方法及入参进行处理响应
  const reqMethods = container.getReq(req_mthods_key)
  if (reqMethods) {
    // ctx.req.url /api/c?id=12
    const [urlPath, query] = ctx.req.url.split('?')
    // key: 请求方法 + 路径
    const methodUrl = ctx.req.method + joinSymbol + urlPath
    // 根据 key 取出数据
    const reqMethodData = reqMethods[methodUrl]
    if (reqMethodData) {
      const {id, fn, args} = reqMethodData
      let fnQueryParams = []
      // 方法有参数
      if (args.length) {
        // 将查询字符串转换为对象
        const queryObj = queryParams(query)
        // 这儿先根据参数在函数中的位置进行排序，这儿只处理了 Query 的情况， 再根据参数名从查询对象中取出数据
        fnQueryParams = args.sort((a, b) => a.index - b.index).filter(item => item.type === 'query').map(item => queryObj[item.paramName])
      }

      // 调用方法，获取数据，进行响应
      const res = container.get(id)[fn](...fnQueryParams)
      ctx.res.end(JSON.stringify(res))
    }
  }
}

function queryParams (searchStr: string = '') {
  const reg = /([^?&=]+)=([^?&=]*)/g;
  const obj = {}
  searchStr.replace(reg, function (rs, $1, $2) {
    var name = decodeURIComponent($1);
    var val = decodeURIComponent($2);
    val = String(val);
    obj[name] = val;
    return rs;
  });
  return obj
}