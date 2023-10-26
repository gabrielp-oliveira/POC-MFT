import { Injectable } from '@angular/core';
import { AppStoreService } from './app-store.service';
import { IStore } from '../interfaces/IStore';


@Injectable({ providedIn: 'root' })
export class AppStoreUtilsService {

  constructor(
    private readonly appStoreSrvc: AppStoreService,
  ) { }

  get isValidFilter(): boolean {
    return (
      this.appStoreSrvc.selectedStores.value?.length > 0 &&
      this.appStoreSrvc.selectedCompanyCodes.value?.length > 0 &&
      this.appStoreSrvc.selectedReportNames.value?.length > 0 &&
      // rowsPerPage
      this.appStoreSrvc.selectedRowsPerPage.value > 0// &&
      //this.appStoreSrvc.selectedPageNumber.value > 0
      // filterData.selectedSearchValue
    );
  }

  get userName(): string {
    let userName = this.appStoreSrvc.navigationObj.value?.userInfo?.userName;
    return userName ? userName : this.appStoreSrvc.DEFAULT_USER_NAME;
  }

  get tenantCode(): string {
    let tenantCode = (this.appStoreSrvc.navigationObj.value?.tenantCode + '').trim();
    return tenantCode ? tenantCode : this.appStoreSrvc.DEFAULT_TENANT_CODE;
  }

  get storeNumber(): number {
    return this.appStoreSrvc.navigationObj.value?.storeInfo?.storeObj?.storeNbr;
  }

  getStoreByParentStore(): IStore | null {
    let parentStore: IStore | null = null;

    if (this.appStoreSrvc.parentStore.value) {
      (this.appStoreSrvc.stores.value || []).some(x => {
        if (x.storeNbr === this.appStoreSrvc.parentStore.value.storeNbr) {
          parentStore = x;
        }
      });
    }

    // ---
    return parentStore;
  }

  /**
   * NOTE: here customerNbr is the actual storeNumber
   * @returns customerNbr as StoreNumber
   */
  getSelectedStoreNumbers(): number[] {
    return (this.appStoreSrvc.selectedStores.value || []).map(store => Number(store.customerNbr));
  }

  getSelectedStoreNumbersAsString(): string[] {
    return (this.getSelectedStoreNumbers() || []).map(x => x.toString());
  }

  getSelectedLegacyCompanyCodes(): string[] {
    return (this.appStoreSrvc.selectedCompanyCodes.value || []).map(companyCodeInfo => companyCodeInfo.legacyCompany ?? companyCodeInfo.companyCode);
  }

  getSelectedReportNames(): string[] {
    return (this.appStoreSrvc.selectedReportNames.value || []).map(x => x.reportName);
  }


  // ---
}