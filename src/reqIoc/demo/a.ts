import { Provider } from "../provider";
import { Inject } from "../inject";
import { Controller } from '../Controller'
import { Get, Query } from '../request'
import B from './b'

@Provider()
@Controller('/api')
export class A {

  @Inject()
  b: B;

  // async getBProps(@Query() uid) {
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