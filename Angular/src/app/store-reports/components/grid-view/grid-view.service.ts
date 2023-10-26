import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { catchError, take } from 'rxjs/operators';

import { ISearchReportsPayload } from 'src/app/shared/interfaces/ISearchReportsPayload';
import { IContent, ISearchReportsResponse } from 'src/app/shared/interfaces/ISearchReportsResponse';

import { EnvironmentService } from 'src/app/shared/services/environment.service';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { AppStoreService } from 'src/app/shared/stores/app-store.service';
import { AppStoreUtilsService } from 'src/app/shared/stores/app-store-utils.service';
import { ImftList } from 'src/app/shared/interfaces/iMft';


@Injectable({ providedIn: 'root' })
export class GridViewService {

  constructor(
    private readonly httpClient: HttpClient,
    private readonly errorSrvc: ErrorHandlerService,
    private readonly environmentSrvc: EnvironmentService,
    private readonly appStoreSrvc: AppStoreService,
    private readonly appStoreUtilsSrvc: AppStoreUtilsService
  ) { }

  //#region Grid-Related
  gridApi: any;
  gridColumnApi: any;
  storeReportSortColumn: string = 'fileName';
  storeReportSortType = 'ASC';

  init(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  refreshAll() {
    this.gridApi.refreshCells();
  }

  refreshColumns(columnsToRefresh: string[]) {
    this.gridApi.refreshCells({
      force: true,
      columns: columnsToRefresh
    });
  }

  delayedRefreshColumns(columnsToRefresh: string[], delay: number = 100) {
    setTimeout(() => { this.refreshColumns(columnsToRefresh) }, delay);
  }

  /**
  * resizes the columns to fit the width of the grid
  * @param allowShrink if false, columns will NOT be resized when there is no "empty" horizontal space
  */
  public resizeColumnsToFit(allowShrink = true) {
    if (this.gridApi) {
      if (allowShrink) {
        this.gridApi.sizeColumnsToFit();
      } else {
        /**
         * this is a "hacK" - there is no way to check if there is "empty" space in the grid using the
         * public grid api - we have to use the internal tools here.
         * it could be that some of this apis will change in future releases
         */
        const panel = this.gridApi["gridPanel"];
        const availableWidth = this.gridApi["gridPanel"].eBodyViewport.clientWidth;
        const columns = this.gridApi["gridPanel"]["columnController"].getAllDisplayedColumns();
        const usedWidth = this.gridApi["gridPanel"]["columnController"].getWidthOfColsInList(columns);

        if (usedWidth < availableWidth) {
          this.gridApi.sizeColumnsToFit();
        }
      }
    }
  }

  //#endregion


  private _gridContentResponse$ = new Subject<ImftList>();
  fetchGridContent(params, page: number): Observable<ImftList> {
    this._gridContentResponse$ = new Subject<ImftList>();

    this.httpClient.post(this.getUrl(), this.getPayload(params, page))
    // console.log(this.getPayload(params, page))
    // this.httpClient.get(this.getUrl())
    .subscribe(
        // .pipe(take(1)).pipe(catchError(this.errorSrvc.handle)).subscribe(
        (successObj: ImftList) => { this._gridContentResponse$.next(successObj); },
        (error) => { this._gridContentResponse$.error(error); }
      );

    // ---
    return this._gridContentResponse$.asObservable();
  }


  sortAndFormatResponse(_value: IContent[] = []) {

    //TODO: Fix the complexity later
    _value.map(x => {
      x.formattedText = x.storeNbr ? `${x.storeNbr}` : 'All';
      x.description = (x.invoiceNumber ? `${x.invoiceNumber} - ` : '') + x.description;
    });

    _value.sort((a, b) =>
      (!a.storeNbr || !b.storeNbr) ? 1 : 0 ||
        a.storeNbr.localeCompare(b.storeNbr) ||
        a.reportName.localeCompare(b.reportName)
    );
    return _value;
  }

  private getUrl(): string {
    let url = this.environmentSrvc.getHttpUrl('getMftList');
    return url;
  }

  private getPayload(params, page: number): ISearchReportsPayload {
    const payload: ISearchReportsPayload = {
      search: this.appStoreSrvc.selectedSearchTerm.value,
      storeNbrs: this.appStoreUtilsSrvc.getSelectedStoreNumbersAsString(),
      companyCodes: this.appStoreUtilsSrvc.getSelectedLegacyCompanyCodes(),
      reportNames: this.appStoreUtilsSrvc.getSelectedReportNames(),
      reportType: this.appStoreSrvc.REPORT_TYPE_REPORT,
      size: this.appStoreSrvc.selectedRowsPerPage.value,
      page: page, //this.appStoreSrvc.selectedReportsGridPageNumber.value - 1,
      startDate: this.appStoreSrvc.selectedDateRange.value?.startDate,
      endDate: this.appStoreSrvc.selectedDateRange.value?.endDate
    }

      /* Manikanta Ch code changes start here***/
    /** Implementation of Sorting  */
    /* added sorting params to WS body */
    if (params.sortModel?.length > 0) {
      // this.sortColumnOrderHist = '';
        const columnName = this.getSortColumnsForReports(params?.sortModel[0].colId);
        this.storeReportSortColumn = columnName;
        this.storeReportSortType = params.sortModel[0].sort;

        // Object.assign(queryBuilder, { sort: [ { [this.sortColumn]: params.sortModel[0].sort  }] });
      } else {

      this.storeReportSortColumn = this.storeReportSortColumn;
      this.storeReportSortType = this.storeReportSortType;
      }
      const sort = [{column: this.storeReportSortColumn, direction: this.storeReportSortType.toUpperCase()}]
      Object.assign(payload, {sort: sort}  )
      console.log(sort)
      // ---
      return payload;
  }
  
    /* Manikanta Ch code changes start here***/
    /** Implementation of Sorting  */
    /* based on selected column and sort type building the req body for api call */
  getSortColumnsForReports(column): string {
  
    let sortColumn;
    if (column === 'storeNbr') {
      sortColumn = 'storeNbr';
    }
    else if (column === 'creationDate') {
      sortColumn = 'creationDate';
    }
    else if (column === 'fileName') {
      sortColumn = 'fileName';
    }
    else if (column === 'format') {
      sortColumn = 'format';
    }
   
    return sortColumn;
  }


 /* Manikanta Ch code changes end here***/
  // ---
}