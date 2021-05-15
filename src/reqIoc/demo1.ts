// 耦合
// b.ts
class B {
  constructor () {}
}

// a.ts
class A {
  b: B
  constructor () {
    this.b = new B()
  }
}

// main.ts
const a = new A();

// =================== 给 b 添加一个参数，结果每个类都需要改

// b.ts
class B1 {
  n: number
  constructor (n: number) {
    this.n = n
  }
}

// a.ts
class A1 {
  b: B1
  constructor (n: number) {
    this.b = new B1(n)
  }
}

// main.ts
const a1 = new A1(12);
console.log(a1) // A {b: B {n: 12}}

// ================ 去耦

// b.ts
class B2 {
  n: number
  constructor (n: number) {
    this.n = n
  }
}

// a.ts
class A2 {
  private b: B2
  constructor (n: B2) {
    this.b = n
  }
}

// main.ts
const b2 = new B2(10)
const a2 = new A2(b2)
console.log(a2) // A {b: B {n: 12}}

// DI 依赖注入，Ioc 控制反转
// IoC只是一个原则，DI是IoC的具体实现
// 程序启动时注册类，并实例化，可在依赖的地方之间使用

// Reflect Metadata 容器存储类的元信息。当一个全局容器用，保存所有的注册类信息，方便其他地方实例化绑定等
import 'reflect-metadata'

const class_key = 'ioc:key'

function ClassDecorator () {
  return function (target: any) {
    Reflect.defineMetadata(class_key, {
      metadata: 'metadata'
    }, target)

    return target
  }
}

@ClassDecorator()
class D {
  constructor () {}
}

console.log(Reflect.getMetadata(class_key, D)) // {metaData: 'metaData'}
