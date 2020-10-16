import {
  Request,
  RestBindings,
  get,
  ResponseObject,
  Response,
  param,
  post,
  requestBody,
  getModelSchemaRef,
  put,
} from '@loopback/rest';
import { inject, service } from '@loopback/core';
import { VendorService } from '../services';
import { IVendorDocument } from '../types/vendor-data';

export class VendorController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject(RestBindings.Http.RESPONSE) private res: Response,
    @service(VendorService) public vendorService: VendorService,
  ) {}

  @get('/vendor/email/status')
  checkEmailStatus(@param.query.string('email') email: string): object {
    return this.vendorService.checkEmailStatus(email);
  }

  @post('/vendor/profile/create')
  createSellerProfile(@requestBody() body: IVendorDocument) {
    return this.vendorService.createVendorProfile(body);
  }

  @put('/vendor/profile/query/{id}')
  updateSellerQuery(@param.path.string('id') id: string, @requestBody() body: any) {
    let query = body['vendorQuery'];
    return this.vendorService.updateVendorQuery(id, query);
  }
}
