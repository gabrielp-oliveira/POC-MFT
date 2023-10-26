import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { IStore } from '../interfaces/IStore';
import { ICompanyCode } from '../interfaces/ICompanyCode';
import { IReport } from '../interfaces/IReport';
import { IContent } from '../interfaces/ISearchReportsResponse';
import { IAppInputData } from '../interfaces/IAppInputData';
import { INavigationObj, IStoreObj } from '../interfaces/INavigationObj';

import { Store } from './store';
import { SubscriptionHandlerService } from '../services/subscription-handler.service';
import { IDateRange } from '../interfaces/IDateRange';


/**
 * @remarks Uses SSOT/SPOT Design Pattern & EventDriven Architecture
 * @author Pradeep. R
 * @email prajendr@cswg.com
 * @createdOn 24/JUL/2023
 * @version 0.1
*/
@Injectable({ providedIn: 'root' })
export class AppStoreService {


  //#region CONSTANTS
  readonly REPORT_TYPE_REPORT: string = 'Report';
  readonly DEFAULT_TENANT_CODE: string = '2023-GS-PRTL';
  readonly DEFAULT_USER_NAME: string = 'awi_cust_01';
  readonly START_PAGE_NUMBER: number = 1;
  readonly ROWS_PER_PAGE: number = 20;
  //#endregion


  //#region OBSERVERS
  private _onChange$ = new BehaviorSubject<boolean>(null);
  onChange() { return this._onChange$.asObservable(); }

  private _onFiltersChange$ = new BehaviorSubject<boolean>(null);
  onFiltersChange() { return this._onFiltersChange$.asObservable(); }

  private _onClearFilters$ = new BehaviorSubject<boolean>(null);
  onClearFilters() { return this._onClearFilters$.asObservable(); }
  clearFilters() { this._onClearFilters$.next(true); }
  //#endregion


  //#region STORE-ENTRIES
  private _storeItems = new Map<string, any>();
  get storeChangeObservers() { return [this._onChange$] };
  get filterChangeObservers() { return [this._onChange$, this._onFiltersChange$]; };

  navigationObj = Store.CREATE<INavigationObj>(null, this.storeChangeObservers);
  parentStore = Store.CREATE<IStoreObj>(null, this.storeChangeObservers);
  isSubRoleActivated = Store.CREATE<boolean>(false, this.storeChangeObservers);
  
  stores = Store.CREATE<IStore[]>(null, this.storeChangeObservers);
  companyCodes = Store.CREATE<ICompanyCode[]>(null, this.storeChangeObservers);
  reportNames = Store.CREATE<IReport[]>(null, this.storeChangeObservers);
  resultSet = Store.CREATE<IContent[]>(null, this.storeChangeObservers);

  selectedRowsPerPage = Store.CREATE<number>(this.ROWS_PER_PAGE, this.filterChangeObservers);
  selectedPageNumber = Store.CREATE<number>(this.START_PAGE_NUMBER, this.filterChangeObservers);
  selectedSearchTerm = Store.CREATE<string>(null, this.filterChangeObservers);
  selectedStores = Store.CREATE<IStore[]>(null, this.filterChangeObservers);
  selectedCompanyCodes = Store.CREATE<ICompanyCode[]>(null, this.filterChangeObservers);
  selectedReportNames = Store.CREATE<IReport[]>(null, this.filterChangeObservers);
  selectedDateRange = Store.CREATE<IDateRange>({ startDate: null, endDate: null }, this.filterChangeObservers);
  //#endregion

  constructor(
    private readonly subscriptionSrvc: SubscriptionHandlerService
  ) { }

  private _init$ = new Subject<boolean>();
  init(appInputData: IAppInputData) {
    this._init$ = new Subject<boolean>();

    this.navigationObj.setValue(appInputData?.navigationObj);
    this.parentStore.setValue(appInputData?.navigationObj?.storeInfo?.storeObj);
    this._createThisStoreItemsMap();
    console.log('INITIALIZED', 'AppStoreService');
    this.subscriptionSrvc.delayedCompleteSubject(this._init$, true)

    // ---
    return this._init$.asObservable();
  }

  private _createThisStoreItemsMap() {
    this._storeItems.clear()
    Object.keys(this).forEach((key) => {
      if (this[key]['__isStoreItem'] === true) {
        this._storeItems.set(key, this[key]);
      }
    });
  }

  reset() {
    this._storeItems.forEach(x => x.reset());
  }

  getCurrentValues() {
    const currentValues = {};
    this._storeItems.forEach((_storeItem, _key) => {
      currentValues[_key] = _storeItem.value;
    });
    return currentValues;
  }

  //---
}