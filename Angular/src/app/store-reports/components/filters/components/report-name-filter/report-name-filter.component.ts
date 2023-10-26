import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ReportNameFilterService } from './report-name-filter.service';
import { IReport } from 'src/app/shared/interfaces/IReport';
import { ICompanyCode } from 'src/app/shared/interfaces/ICompanyCode';
import { AppStoreService } from 'src/app/shared/stores/app-store.service';

@Component({
  selector: 'app-report-name-filter',
  templateUrl: './report-name-filter.component.html',
  styleUrls: ['./report-name-filter.component.scss']
})
export class ReportNameFilterComponent implements OnInit, OnDestroy {

  constructor(
    private readonly toastSrvc: ToastrService,
    private readonly appStoreSrvc: AppStoreService,
    private readonly reportNameFilterSrvc: ReportNameFilterService
  ) { }

  onSelectedCompanyCodesChange$: Subscription;
  onReportsDataSource$: Subscription;

  isInValid: boolean = false;
  dataSource: IReport[] = null;
  selectedItems: IReport[] = [];
  selectionDisplayString: string = '';

  ngOnDestroy(): void {
    this.onSelectedCompanyCodesChange$.unsubscribe();
    this.onReportsDataSource$.unsubscribe();
  }

  ngOnInit(): void {
    // ---observers---
     this.appStoreSrvc.selectedCompanyCodes.onChange()
      .subscribe((_value) => this.fetchDataSource(_value));
    this.appStoreSrvc.reportNames.onChange()
      .subscribe((_value) => this.onDataSourceChange(_value));
  }

  fetchDataSource(selectedCompanyCodes: ICompanyCode[]) {
    // clear from data-source-store
    this.clearDataSource(true);
    this.appStoreSrvc.reportNames.setValue(null);

    if (selectedCompanyCodes?.length) {
      this.reportNameFilterSrvc.fetchReportNames().subscribe(
        (result) => {
          this.reportNameFilterSrvc.sortAndFormatResponse(result);
          this.appStoreSrvc.reportNames.setValue(result);
        },
        (error) => {
          this.isInValid = false;
          this.toastSrvc.error('Error while fetching Reports.');
          console.log('Reports Fetch Error', error);
        }
      );
    }
  }

  clearDataSource(_propagate: boolean) {
    if (_propagate) { this.appStoreSrvc.reportNames.setValue(null); }
    this.selectedItems = [];
    this.dataSource = [];
    this.isInValid = true;
  }

  onDataSourceChange(_value: IReport[]) {
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
    this.appStoreSrvc.selectedReportNames.setValue(this.selectedItems);
    this.setSelectionDisplayString();
  }

  setSelectionDisplayString() {
    if (this.selectedItems.length === 1) {
      this.selectionDisplayString = this.selectedItems[0].formattedText; //`1 Report`;
    } else if (this.selectedItems.length === this.dataSource.length) {
      this.selectionDisplayString = `All (${this.selectedItems.length} Reports)`;
    } else {
      this.selectionDisplayString = `${this.selectedItems.length} Reports`;
    }
  }


  //---
}