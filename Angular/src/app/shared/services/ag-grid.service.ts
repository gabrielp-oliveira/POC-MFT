import { Injectable } from '@angular/core';
import { HelperService } from './helper.service';
import { LicenseManager } from '@ag-grid-enterprise/all-modules';
import { Observable, Subject } from 'rxjs';
import { SubscriptionHandlerService } from './subscription-handler.service';
import { AppStoreService } from '../stores/app-store.service';

/**
 * @author Pradeep. R
 * @email prajendr@cswg.com
 * @createdOn 10/Jul/2023
 * @version 0.1
*/
@Injectable({ providedIn: 'root' })
export class AgGridService {

  constructor(
    private readonly helperSrvc: HelperService,
    private readonly appStoreSrvc: AppStoreService,
    private readonly subscriptionSrvc: SubscriptionHandlerService
  ) { }

  private _init$ = new Subject<boolean>();
  init(): Observable<boolean> {
    this._init$ = new Subject<boolean>();
    this.setLicense();

    console.log('INITIALIZED', 'AgGridService');
    this.subscriptionSrvc.delayedCompleteSubject(this._init$, true)

    return this._init$.asObservable();
  }

  private setLicense() {
    this.appStoreSrvc.navigationObj.onChange().subscribe((value) => {
      if (this.helperSrvc.isValidObject(value)) {
        LicenseManager.setLicenseKey(atob(value.gridKey));
      }
    })

    return this;
  }

  lastRowStyles = (params) => {
    if (params.node.rowIndex == params.api.rowModel.rowsToDisplay.length - 1) {
      return 'last-row-styles'
    }
    else {
      return {}
    }
  }

  //---
}