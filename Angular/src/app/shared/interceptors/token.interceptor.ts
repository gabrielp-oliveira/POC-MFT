import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';

import { PermissionService } from 'src/app/shared/services/permission.service';
import { EnvironmentService } from '../services/environment.service';


/**
 * @author Pradeep. R
 * @email prajendr@cswg.com
 * @createdOn 09/Dec/2022
 * @version 0.1
*/
@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private readonly permissionSrvc: PermissionService,
    private readonly environmentSrvc: EnvironmentService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (request.body && request.body.type == 'elastic') {

      delete request.body.type;

      const elasticToken = this.environmentSrvc.getElasticToken();
      request = request.clone({
        headers: request.headers.append('Content-Type', 'application/json')
          .set('Authorization', 'ApiKey ' + elasticToken).set('Content-Language', 'en-US')
      });
    } else {
      const token = this.permissionSrvc.getToken();
      request = request.clone({
        headers: request.headers.append('Content-Type', 'application/json')
          .set('Authorization', 'Bearer ' + token).set('Content-Language', 'en-US')
      });
    }

    return next.handle(request);
  }


  //---
}
