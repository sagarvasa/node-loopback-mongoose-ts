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
import { inject } from '@loopback/core';

export class SellerController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject(RestBindings.Http.RESPONSE) private res: Response,
  ) {}
}
