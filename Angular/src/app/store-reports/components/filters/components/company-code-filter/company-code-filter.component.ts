import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { CompanyCodeFilterService } from './company-code-filter.service';
import { ICompanyCode } from 'src/app/shared/interfaces/ICompanyCode';
import { IStore } from 'src/app/shared/interfaces/IStore';
import { AppStoreService } from 'src/app/shared/stores/app-store.service';


@Component({
  selector: 'app-company-code-filter',
  templateUrl: './company-code-filter.component.html',
  styleUrls: ['./company-code-filter.component.scss']
})
export class CompanyCodeFilterComponent implements OnInit, OnDestroy {

  constructor(
    private readonly toastSrvc: ToastrService,
    private readonly appStoreSrvc: AppStoreService,
    private readonly companyCodeFilterSrvc: CompanyCodeFilterService,
  ) { }

  onSelectedStoresChange$: Subscription;
  onCompanyCodesDataSource$: Subscription;

  isInValid: boolean = false;
  dataSource: ICompanyCode[] = null;
  selectedItems: ICompanyCode[] = [];
  selectionDisplayString: string = '';

  ngOnDestroy(): void {
    this.onSelectedStoresChange$.unsubscribe();
    this.onCompanyCodesDataSource$.unsubscribe();
  }

  ngOnInit(): void {
    // ---observers---
    this.onSelectedStoresChange$ = this.appStoreSrvc.selectedStores.onChange()
      .subscribe((_value) => this.fetchDataSource(_value));
    this.onCompanyCodesDataSource$ = this.appStoreSrvc.companyCodes.onChange()
      .subscribe((_value) => this.onDataSourceChange(_value));
  }


  fetchDataSource(_parentValues: IStore[]) {
    // clear from data-source-store
    this.clearDataSource(true);
    this.appStoreSrvc.companyCodes.setValue(null);
    if (_parentValues?.length) {
      const storeNumbers = _parentValues.map((str) =>  str.customerNbr).join(',')
      this.companyCodeFilterSrvc.fetchCompanyCodes(storeNumbers).subscribe(
        (result) => {
          this.companyCodeFilterSrvc.sortAndFormatResponse(result);
          this.appStoreSrvc.companyCodes.setValue(result.response);
        },
        (error) => {
          this.isInValid = false;
          this.toastSrvc.error('Error while fetching Company codes.');
          console.log('Company codes Fetch Error', error);
        }
      )
    }
  }

  clearDataSource(_propagate: boolean) {
    if (_propagate) { this.appStoreSrvc.selectedCompanyCodes.setValue(null); }
    this.selectedItems = [];
    this.dataSource = [];
    this.isInValid = true;
  }

  onDataSourceChange(_value: ICompanyCode[]) {
    this.clearDataSource(false);
    this.dataSource = _value;
    if (_value?.length) {
      this.selectedItems = [..._value];
      this.isInValid = false;
      this.applyFilters(null);
    } else {
      this.isInValid = true;
    }
  }

  applyFilters($event) {
    this.appStoreSrvc.selectedCompanyCodes.setValue(this.selectedItems);
    this.setSelectionDisplayString();
  }

  setSelectionDisplayString() {
    if (this.selectedItems.length === 1) {
      this.selectionDisplayString = this.selectedItems[0].formattedText; //`1 Company Code`;
    } else if (this.selectedItems.length === this.dataSource.length) {
      this.selectionDisplayString = `All`;
    } else {
      this.selectionDisplayString = `${this.selectedItems.length} Company Codes`;
    }
  }


  //---
}