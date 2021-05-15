# node-sample-ioc
用node、ts实现简单的ioc，支持基本使用@Provider、@Inject，增强@Controller、@Get、@Query。纯属个人理解学习的demo，所以比较简单，都是最基础的实现。

## 项目说明

### 项目调试

由于只是练习，需要调试，方便看细节。所以是：

- `npm i`
- `npm run debug`

即可启动服务。为了方便调试，借助了浏览器的node调试功能(浏览器控制台，可看到 node 的icon，点击打开进行调试)。

### 浏览器访问：默认使用的是 `reqIoc`，即支持接口 `Get` 带 `Query` 的请求响应。所以是像下面这样访问：

- `http://localhost:3000/api/b?id=12&name=n`

  可看到以下信息：

  ```
  {
    success: true,
    message: "OK",
    data: {
      id: "12",
      name: "n",
      className: "b"
    }
  }
  ```

  reqIoc/demo。方便起见，把代码放一起
  ```ts  
    // a.ts 
    @Provider()
    @Controller('/api')
    export class A {

      @Inject()
      b: B;

      @Get('/b')
      printB(@Query() id, @Query() name) {
        const bProps:any = this.b.getProps(id, name);
        bProps.className = 'b'
        return { success: true, message: 'OK', data: bProps };
      }

      @Get('/c')
      printC(@Query() id) {
        const bProps:any = this.b.getProps(id);
        bProps.className = 'c'
        return { success: true, message: 'OK', data: bProps };
      }
    }

    // b.ts
    @Provider()
    export default class B {
      getProps (id?: string, name?: string) {
        return {
          id: id || 'mock',
          name: name || 'mock',
        };
      }
    }
  ```

### 项目入口

- 项目入口是：`src/server.ts`

```ts
server.on('request', function (req, res) {

  // 简化版 ioc 
  // iocFrame()

  // 在简化版 ioc 基础上，支持 请求响应，将 req、res 简单封装为 ctx。
  reqIocFrame({req, res})

  res.end('hello nodejs w ')
})
```

若需要看细节，可从这个文件开始。

