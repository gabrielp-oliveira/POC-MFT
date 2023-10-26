import { Injectable } from '@angular/core';
import { combineLatest, Observable, Subject } from 'rxjs';

import { SubscriptionHandlerService } from './subscription-handler.service';
import { AppStoreService } from '../stores/app-store.service';


/**
 * @author Pradeep. R
 * @email prajendr@cswg.com
 * @createdOn 09/Dec/2022
 * @version 0.1
*/
@Injectable({ providedIn: 'root' })
export class PermissionService {

  readonly CONNECT_ADMIN_ID = 1044;
  readonly CONNECT_CORPORATE_ID = 1054;
  readonly CONNECT_STORE_ADMIN_ID = 1033;
  readonly CONNECT_STORE_REPORTS = 1053;

  constructor(
    private readonly appStoreSrvc: AppStoreService,
    private readonly subscriptionSrvc: SubscriptionHandlerService,
  ) { }


  private _init$ = new Subject<boolean>();
  init(): Observable<boolean> {
    this._init$ = new Subject<boolean>();

    combineLatest([
      this.appStoreSrvc.navigationObj.onChange(),
    ]).subscribe(([navigationObj]) => {
      this.setToken(navigationObj?.bearerToken)
        .setWidgetList(navigationObj?.widgetMap?.widgetList);
      // ---
      console.log('INITIALIZED', 'PermissionService');
      this.subscriptionSrvc.delayedCompleteSubject(this._init$, true);
    });

    return this._init$.asObservable();
  }

  private _token: any;
  getToken() { return this._token; }
  private setToken(value: any) {
    this._token = value;
    return this;
  }

  private _widgetList: number[];
  getWidgetList() { return this._widgetList; }
  private setWidgetList(value: number[]) {
    this._widgetList = value;
    // TODO: set other permissions if any

    return this;
  }

  get IsGroupReportsUser(): boolean {
    return this.isNotGSAdmin && this.IsNotCorporateUser && this.IsNotStoreAdmin;
  }

  get isSubRoleNotActivated(): boolean { return !this.isSubRoleActivated; }
  get isSubRoleActivated(): boolean {
    return this.appStoreSrvc.isSubRoleActivated.value === true;
  }
  
  get isNotGSAdmin(): boolean { return !this.isGSAdmin; }
  get isGSAdmin(): boolean {
    return this._widgetList.includes(this.CONNECT_ADMIN_ID) === true;
  }

  get IsNotCorporateUser(): boolean { return !this.IsCorporateUser; }
  get IsCorporateUser(): boolean {
    return this._widgetList.includes(this.CONNECT_CORPORATE_ID) === true;
  }

  get IsNotStoreAdmin(): boolean { return !this.IsStoreAdmin; }
  get IsStoreAdmin(): boolean {
    return this._widgetList.includes(this.CONNECT_STORE_ADMIN_ID) === true;
  }


  // getUserType(): any {
  //   let userType: string = 'GROUPREPORTS';
  //   if (this._widgetList.includes(this.CONNECT_ADMIN_ID) === true) {
  //     userType = 'GSADMIN';
  //   } else if (this._widgetList.includes(this.CONNECT_CORPORATE_ID) === true) {
  //     userType = 'CORPORATE';
  //   } else if (this._widgetList.includes(this.CONNECT_STORE_ADMIN_ID) === true) {
  //     userType = 'STOREADMIN';
  //   }
  //   return userType;
  // }

  // get isAdminUserType(): boolean {
  //   return this.isGSAdmin || this.IsCorporateUser || this.appStoreSrvc.isSubRoleActivated.value;
  // }



  //---
}