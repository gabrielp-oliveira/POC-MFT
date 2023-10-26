import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { catchError, take } from 'rxjs/operators';

import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { EnvironmentService } from 'src/app/shared/services/environment.service';
import { AppStoreUtilsService } from 'src/app/shared/stores/app-store-utils.service';


@Injectable({ providedIn: 'root' })
export class FiltersService {

  constructor(
    private readonly httpClient: HttpClient,
    private readonly environmentSrvc: EnvironmentService,
    private readonly errorSrvc: ErrorHandlerService,
    private readonly appStoreUtilSrvc: AppStoreUtilsService
  ) { }

  private _isSubRoleActivated$ = new Subject<boolean>();
  isSubRoleActivated(): Observable<boolean> {
    this._isSubRoleActivated$ = new Subject<boolean>();

    this.httpClient.get(this.getUrl())
      .pipe(take(1)).pipe(catchError(this.errorSrvc.handle)).subscribe(
        (successObj) => {
          const result = successObj?.response === true;
          this._isSubRoleActivated$.next(result);
        },
        (error) => { this._isSubRoleActivated$.error(error); }
      );

    // ---
    return this._isSubRoleActivated$.asObservable();
  }

  getUrl(): any {
    const tenantCode: string = this.appStoreUtilSrvc.tenantCode;
    const userName: string = this.appStoreUtilSrvc.userName;

    let urlParam = this.environmentSrvc.getHttpUrl('checkSubRole');
    urlParam += `?roleName=gs_store_reports&tenantCode=${tenantCode}&userName=${userName}`;

    // ---
    return urlParam;
  }


  // ---
}