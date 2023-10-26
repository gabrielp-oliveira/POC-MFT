import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { catchError, take } from 'rxjs/operators';

import { ICompanyCodeResponse } from 'src/app/shared/interfaces/ICompanyCodeResponse';
import { ICompanyCodePayload } from 'src/app/shared/interfaces/ICompanyCodePayload';
import { EnvironmentService } from 'src/app/shared/services/environment.service';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { AppStoreUtilsService } from 'src/app/shared/stores/app-store-utils.service';
import { PermissionService } from 'src/app/shared/services/permission.service';


@Injectable({ providedIn: 'root' })
export class CompanyCodeFilterService {

  constructor(
    private readonly httpClient: HttpClient,
    private readonly errorSrvc: ErrorHandlerService,
    private readonly environmentSrvc: EnvironmentService,
    private readonly permissionSrvc: PermissionService,
    private readonly appStoreUtilsSrvc: AppStoreUtilsService,
  ) { }


  private _companyCodesResponse$ = new Subject<ICompanyCodeResponse>();
  fetchCompanyCodes(customerNbr: string | [string]): Observable<ICompanyCodeResponse> {
    this._companyCodesResponse$ = new Subject<ICompanyCodeResponse>();

    let [url, method] = this.getAPIData(customerNbr);
    let resp: Observable<any>;
    if(method === 'GET'){
      resp = this.httpClient.get(url);
    } else if(method === 'POST'){
      resp = this.httpClient.post(url, this.getPayload());
    } else {
      console.error('Invalid method for store reports company code API access');
    }
    resp.pipe(take(1)).pipe(catchError(this.errorSrvc.handle)).subscribe(
      (successObj) => { this._companyCodesResponse$.next(successObj); },
      (error) => { this._companyCodesResponse$.error(error); }
    );

    // ---
    return this._companyCodesResponse$.asObservable();
  }

  private getAPIData(customerNbr: string | [string]): string[] {
    let url: string = '';
    let method: string = '';

    if ((this.permissionSrvc.isGSAdmin || this.permissionSrvc.IsCorporateUser ||
      this.permissionSrvc.isSubRoleActivated)) {
      url = this.environmentSrvc.getHttpUrl('getCompanyCodes');
      method = 'POST';
    } else {
      const userName: string = this.appStoreUtilsSrvc.userName;
      const tenantCode: string = this.appStoreUtilsSrvc.tenantCode;
      url = this.environmentSrvc.getHttpUrl('getAssignedCompaniesByStore');
      url += `?storeNbr=${customerNbr}&userId=${userName}&tenantCode=${tenantCode}`;
      method = 'GET';
    }

    // ---
    return [url, method];
  }

  //Unused since fetchCompanyCodes now uses GET instead of POST
  private getPayload(): ICompanyCodePayload {
    const payload = {
      groupCode: null,
      storeGroup: null,
      storeNbr: this.appStoreUtilsSrvc.getSelectedStoreNumbers()
    }
    // ---
    return payload;
  }

  sortAndFormatResponse(_value: ICompanyCodeResponse) {
    _value.response.map(x => x.formattedText = x.companyName);
    // ---
    return _value;
  }

  
  //---
}