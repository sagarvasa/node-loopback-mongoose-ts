import { inject } from '@loopback/context';
import {
  FindRoute,
  InvokeMiddleware,
  InvokeMethod,
  ParseParams,
  Reject,
  RequestContext,
  RestBindings,
  Send,
  SequenceHandler,
  Response,
  Request,
} from '@loopback/rest';
import * as shortid from 'shortid';
import { Constants } from './utilities/constants';

const SequenceActions = RestBindings.SequenceActions;

export class MySequence implements SequenceHandler {
  /**
   * Optional invoker for registered middleware in a chain.
   * To be injected via SequenceActions.INVOKE_MIDDLEWARE.
   */
  @inject(SequenceActions.INVOKE_MIDDLEWARE, { optional: true })
  protected invokeMiddleware: InvokeMiddleware = () => false;

  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
  ) {}

  async handle(context: RequestContext) {
    try {
      const { request, response } = context;
      const route = this.findRoute(request);

      // Custom: response header setting
      await this.setResponseHeader(request, response);

      const finished = await this.invokeMiddleware(context);
      if (finished) return;

      const args = await this.parseParams(request, route);

      const result = await this.invoke(route, args);

      this.send(response, result);
    } catch (err) {
      this.reject(context, err);
    }
  }

  private async setResponseHeader(request: Request, response: Response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Credentials', 'true');
    response.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    response.setHeader(
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
    );
    response.setHeader('Cache-Control', 'no-cache');

    response.setHeader(Constants.CORR_ID, request.get(Constants.CORR_ID) ?? shortid.generate());
  }
}
