import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, $call: CallHandler): Observable<any> {
    const now = Date.now();

    // check if we are in the http context and log the info for the request
    const req = context.switchToHttp().getRequest<Request>();
    if (req) {
      const { method, url } = req;

      return $call
        .handle()
        .pipe(
          tap(() =>
            Logger.log(
              `${method} ${url} ${Date.now() - now}ms`,
              context.getClass().name,
            ),
          ),
        );
    }

    // we need to create a gql execution context to log the relevant info
    const gqlctx = GqlExecutionContext.create(context);
    const info = gqlctx.getInfo();
    const resolverName = gqlctx.getClass().name;

    return $call
      .handle()
      .pipe(
        tap(() =>
          Logger.log(
            `${info.parentType} "${info.fieldName}" ${Date.now() - now}ms`,
            resolverName,
          ),
        ),
      );
  }
}
