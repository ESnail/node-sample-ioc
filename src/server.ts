const http = require('http')

import iocFrame from './ioc/frame'
import reqIocFrame from './reqIoc/frame'


const port = 3000
const server = http.createServer()

server.listen(port, () => {
  console.log(`server running on port ${port}`)
})

server.on('request', function (req, res) {
  console.log('收到请求了，请求路径是：' + req.url)
  console.log('请求我的客户端的地址是：', req.socket.remoteAddress, req.socket.remotePort)
  console.log({req, res})

  // 简化版 ioc 
  // iocFrame()

  // 在简化版 ioc 基础上，支持 请求响应，将 req、res 简单封装为 ctx。
  reqIocFrame({req, res})

  res.end('hello nodejs w ')
})
