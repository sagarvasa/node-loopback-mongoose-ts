import {
  Request,
  RestBindings,
  get,
  //ResponseObject,
  Response,
  param,
  post,
  requestBody,
  HttpErrors,
  //getModelSchemaRef,
  put,
} from '@loopback/rest';
import { inject, service } from '@loopback/core';
import { VendorService } from '../services';
import { IVendorDocument } from '../types/vendor-data';
import { HttpError } from 'http-errors';
import { ErrorConst } from '../utilities/errors';

export class VendorController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject(RestBindings.Http.RESPONSE) private res: Response,
    @service(VendorService) public vendorService: VendorService,
  ) {}

  @get('/vendor/email/status/{email}')
  async checkEmailStatus(@param.path.string('email') email: string) {
    try {
      return await this.vendorService.checkEmailStatus(email, this.res);
    } catch (err) {
      this.throwErrorHandler(err);
    }
  }

  @post('/vendor/profile/create')
  async createSellerProfile(@requestBody() body: IVendorDocument) {
    try {
      return await this.vendorService.createVendorProfile(body, this.res);
    } catch (err) {
      this.throwErrorHandler(err);
    }
  }

  @put('/vendor/profile/query/{id}')
  async updateSellerQuery(@param.path.string('id') id: string, @requestBody() body: { vendorQuery: string }) {
    try {
      const query = body['vendorQuery'];
      return await this.vendorService.updateVendorQuery(id, query, this.res);
    } catch (err) {
      this.throwErrorHandler(err);
    }
  }

  private throwErrorHandler(err: Error) {
    const error = <HttpError>err;
    switch (error.status) {
      case ErrorConst.BAD_REQUEST:
        throw new HttpErrors.BadRequest(err.message);
      case ErrorConst.UNAUTHORIZED:
        throw new HttpErrors.Unauthorized(err.message);
      case ErrorConst.NOT_FOUND:
        throw new HttpErrors.NotFound(err.message);
      case ErrorConst.CONFLICT:
        throw new HttpErrors.Conflict(err.message);
      default:
        throw new HttpErrors.InternalServerError(err.message);
    }
  }
}
