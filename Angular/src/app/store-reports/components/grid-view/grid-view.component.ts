import { Component, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  AllModules, ColDef, GridApi,
  GridOptions, ICellRendererParams, IGetRowsParams, RowClassParams, RowNode
} from '@ag-grid-enterprise/all-modules';

import { GridViewService } from './grid-view.service';
import { AppStoreService } from 'src/app/shared/stores/app-store.service';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';

import { DownloadIconsCellRendererComponent } from './cell-renderers/download-icons-cell-renderer/download-icons-cell-renderer.component';
import { AppStoreUtilsService } from 'src/app/shared/stores/app-store-utils.service';
import { ImftList } from 'src/app/shared/interfaces/iMft';


@Component({
  selector: 'app-grid-view',
  templateUrl: './grid-view.component.html',
  styleUrls: ['./grid-view.component.scss']
})
export class GridViewComponent implements OnInit, OnDestroy {


  //#region Grid
  readonly agGridAllModules = AllModules;
  readonly cellFlashDelay = 2000;
  readonly cellFadeDelay = 500;
  readonly editorColumn = 'editor';
  selectedItemIndex: number = null;
  frameworkComponents: {};


  gridApi: GridApi;
  gridColumnApi;
  gridColumnDefs: ColDef[];
  gridOptions: Partial<GridOptions>;

  paginationPageSize;
  cacheOverflowSize;
  maxConcurrentDataSourceRequests;
  infiniteInitialRowCount;

  newDataSource: any;
  
  overlayNoDataTemplate = `<span class="error-msg ml-2 p-2 mt-auto mb-auto font-12 fw-500 cp-warning">
    ${this.errorSrvc.NO_DATA_FOUND_ERROR_200}
  </span>`;
  defaultColDef = {
    enableRowGroup: false, enablePivot: false, enableValue: true, sortable: true,
    resizable: true, filter: false, autoHeight: false,
    tooltipComponent: "tooltipCellRendererComponent"
  };



  private _lastStoreNumber: string = null;
  private _formattedRowIndexes: number[] = [];

  
  onFilterChange$: Subscription;
  onGridDataSourceChange$: Subscription;

  isInValid: boolean = false;
  dataSource: ImftList[] = [];
  @Input() isFiltersCleared: any;

  
  constructor(
    private readonly toastSrvc: ToastrService,
    private readonly spinnerSrvc: NgxSpinnerService,
    private readonly errorSrvc: ErrorHandlerService,
    private readonly gridViewSrvc: GridViewService,
    private readonly appStoreSrvc: AppStoreService,
    private readonly appStoreUtilsSrvc: AppStoreUtilsService
  ) {
    let pageSize = this.appStoreSrvc.ROWS_PER_PAGE;

    this.cacheOverflowSize = 2;
    this.maxConcurrentDataSourceRequests = 2;
    this.infiniteInitialRowCount = 2;
    this.gridOptions = {
      cacheBlockSize: pageSize,
      paginationPageSize: pageSize,
      rowModelType: 'infinite',
      onPaginationChanged: (event)=>{this.fixLastGridElementDisplay();},
    };

    this.appStoreSrvc.selectedRowsPerPage.onChange().subscribe((_value) => {
      this.gridOptions.paginationPageSize = _value;
      this.gridOptions.cacheBlockSize = _value;
    })
  }

  private canApplyFormatting = (node: RowNode) => {
    const storeNumber = node?.data?.['storeNbr'];
    let applyFormat = false;
    if (this._formattedRowIndexes.includes(node.rowIndex)) {
      applyFormat = true;
    } else {
      if (!this._lastStoreNumber || this._lastStoreNumber !== storeNumber) {
        this._formattedRowIndexes.push(node.rowIndex);
        this._lastStoreNumber = storeNumber;
        applyFormat = true;
      }
    }
    return applyFormat;
  }

  getRowStyle = (params: RowClassParams) => {
    if (this.canApplyFormatting(params.node)) {
      return {
        borderTop: "#00000026 solid 1px !important",
      };
    }
  }

  getRowHeight = (params) => {
    // const { node } = params;
    // if (this.canApplyFormatting(node)) {
    //   return 56;
    // }
    return undefined;
  }
  onGridReady(params): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridViewSrvc.init(params);
  }

  setGridColumns(): void {
    this.gridColumnDefs = [
      // { headerName: 'Store Group', field: 'formattedText', width: 164 },
      { headerName: 'File name', field: 'fileName', width: 175 },
      { headerName: 'format', field: 'format', width: 100 },
      { headerName: 'Creation Date', field: 'creationDate', width: 175,  sortable: true, cellRenderer: this.DateCellRenderer.bind(this) },
      { headerName: 'Download', field: 'download', width: 100, cellRenderer: 'downloadIconsCellRenderer',sortable: false },
      // { headerName: 'Report Name', field: 'reportName', width: 325, sortable: true },
      // { headerName: 'Description', field: 'description', flex: 1, sortable: true },
    ];
  }

  /** function for converting date format to MM/DD/YYYY in display in grid  */
  formatDate(date) {
    if(date !== undefined && date !== null && date !== '') {
      var d = new Date(date),
    dformat = [(d.getMonth()+1),
               d.getDate(),
               d.getFullYear()].join('/') +' ' +
              [d.getHours(),
               d.getMinutes(),
               d.getSeconds()].join(':');
      return dformat
    }
    return '';
  }
  //#endregion Grid

  ngOnDestroy(): void {
    this.onFilterChange$.unsubscribe();
    this.onGridDataSourceChange$.unsubscribe();
  }

  
  clearDataSource() {
    this.dataSource = [];
    this.isInValid = true;
  }

  onDataSourceChange(_value: ImftList[]) {
    this.clearDataSource();
    this.dataSource = _value || [];
    this.isInValid = !_value || _value.length <= 0;
  }
  
  onPageChanged($event) {
    this.appStoreSrvc.selectedPageNumber.setValue($event);
  }
  
  //TODO: Figure out how to set the last row on the current page using a real ag-grid API instead of with hacky code
  fixLastGridElementDisplay(){
    setTimeout(()=>{
      const lastKnownRow = this.newDataSource?.rowCount;
      const curPageLastPossibleRow = (this.gridApi.paginationGetCurrentPage() + 1) * this.appStoreSrvc.selectedRowsPerPage.value;
      const endRow = (this.gridApi.paginationGetTotalPages() === 0) ? 0 : Math.min(lastKnownRow ?? Infinity, curPageLastPossibleRow); //Cap last row to total row count, if known; set to 0 if 0 pages
      const lastElementDisplay = document.querySelector(`[ref='lbLastRowOnPage']`);
      console.log(this.gridApi.paginationGetTotalPages())

      if(lastElementDisplay){
        lastElementDisplay.innerHTML = endRow + '';
      }
    }, 0);
  }

  //Show the overlay if no grid rows are showing
  fixOverlay(){
    if (this.gridApi.getDisplayedRowCount() === 0) {
      this.gridApi.showNoRowsOverlay();
    } else {
      this.gridApi.hideOverlay();
    }
  }


 /* Manikanta Ch code changes for pagination and sorting implementation code starts here on 09102023 */

  ngOnChanges(changes: SimpleChanges): void {
    if(this.isFiltersCleared) {
      this.setDataSource()
    }
    // const err = 'No Data found for this request.'
    // this.throwGridError(err);
     
  }

  ngOnInit(): void {
    this.frameworkComponents = {
      'downloadIconsCellRenderer': DownloadIconsCellRendererComponent
    }

    // ---observers---
    this.onFilterChange$ = this.appStoreSrvc.onFiltersChange()
      .subscribe((_value: any) => this.setDataSource());
    this.onGridDataSourceChange$ = this.appStoreSrvc.resultSet.onChange()
      .subscribe((_value: any) => this.onDataSourceChange(_value));

    // ---load-grid
    this.setGridColumns();

    // ---
  }
  
  setDataSource(){
    // const dataSource = {
    //   rowCount: null,
    //   getRows: (params: IGetRowsParams) => {
    //     console.log(`Loading rows ${params.startRow} to ${params.endRow}`);
    //     let pageNum = Math.floor(params.endRow / this.appStoreSrvc.selectedRowsPerPage.value);
    //     this.fetchDataSource(pageNum - 1).then((result: any) => {
    //       dataSource.rowCount = result.lastRow;
    //       params.successCallback(result.content, +result.lastRow);
    //       this.gridApi.redrawRows();
    //       this.fixOverlay();
    //     });
    //   }
    // };

    // if(this.gridApi){
    //   this.gridApi.setDatasource(dataSource);
    //   this.gridApi.redrawRows();
    // }

    // this.newDataSource = dataSource;

     /* Manikanta Ch code changes start here***/
         /** Implementation of pagination  */
        /* after some delay i am calling another function to get the records with grid params */
    setTimeout(() => {
        const dataSource = {
          getRows: (params: IGetRowsParams) => {
            // let pageNum = Math.floor(params.endRow / this.appStoreSrvc.selectedRowsPerPage.value);
            this.fetchReportsDataForGrid(params, dataSource);
          }
        };
        this.gridApi.setDatasource(dataSource);
        this.newDataSource = dataSource;
        this.gridApi.redrawRows();
    }, 500);
   
  }

  /* Function calling for getRowDataFromApi */
  fetchReportsDataForGrid(params, dataSource) {
    const pageNum = this.gridApi.paginationGetCurrentPage();

    this.fetchDataSource(params, pageNum).then((result: any) => {

      dataSource.rowCount = result.lastRow;
      params.successCallback(result.content, result.lastRow);
      this.gridApi.redrawRows();
      this.fixOverlay();
    });
  }

    /* Manikanta Ch code changes end here***/


    /* Commented old code by Manikanta Ch code changes start here ***/
      /** Implementation of pagination and sorting to api calls  */
      /* method calling and data patching */
  // fetchDataSource(params, page) {
  //   return new Promise((resolve, reject) => {
  //     this.clearDataSource();
  //     //this.appStoreSrvc.resultSet.setValue(null);

  //     if (this.appStoreUtilsSrvc.isValidFilter) {
  //       this.spinnerSrvc.show();
  //       this.gridViewSrvc.fetchGridContent(params,page).subscribe(
  //         (result) => {
  //           const _content: ImftList[] = (result?.content || []);
  //           this.gridViewSrvc.sortAndFormatResponse(_content);
  //           //this.appStoreSrvc.resultSet.setValue(_content);
  //           this.spinnerSrvc.hide();
  //           resolve({
  //             content: _content,
  //             lastRow: +result?.totalElements //page >= result?.totalPages-1 ? +result?.totalElements : null
  //           });
  //         },
  //         (error) => {
  //           this.isInValid = false;
  //           this.toastSrvc.error('Error while fetching Reports.');
  //           console.log('Report Fetch Error', error);
  //           this.spinnerSrvc.hide();
  //           reject(error);
  //         }
  //       );
  //     }
  //   });
  // }

  /* Commented old code by Manikanta Ch code changes end here ***/

    /* Manikanta Ch code changes start here***/
    /** Implementation of pagination and sorting to api calls  */
    /* method calling and data patching */
  fetchDataSource(params, page) {
    return new Promise((resolve, reject) => {
      this.clearDataSource();
      this.appStoreSrvc.resultSet.setValue(null);

      if (this.appStoreUtilsSrvc.isValidFilter) {
        this.spinnerSrvc.show();
        this.gridViewSrvc.fetchGridContent(params,page).subscribe(
          (result: any) => {
           
            if(result.length == 0) {
              params.successCallback([], 0)
              const msg = 'No data found for this request(200).';
              this.throwGridError(msg);
              this.spinnerSrvc.hide();
            } else {
              setTimeout(() => {
                this.gridApi.hideOverlay();
              }, 500)
              const _content: ImftList[] = (result || []);
              // this.gridViewSrvc.sortAndFormatResponse(_content, params);
              //params.successCallback(result?.content, result.totalElements);
              //this.appStoreSrvc.resultSet.setValue(_content);
              // this.mapResponse(_content);
              this.spinnerSrvc.hide();
              // if(this.appStoreSrvc.ROWS_PER_PAGE < result.length ){
              //   this.gridOptions.paginationPageSize = result.length
              // }
              resolve({
                content: _content,
                lastRow:  result?.length ? +result?.length : null //TODO: Won't this break on 0?
              });
            }
           
          },
          (error) => {
            params.successCallback([], 0)
            const msg = 'No data found for this request(200).';
            this.throwGridError(msg);
            this.isInValid = false;
           // this.toastSrvc.error('Error while fetching Reports.');
            console.log('Report Fetch Error', error);
            this.spinnerSrvc.hide();
            reject(error);
          }
        );
      } else { //Invalid filter
        params.successCallback([], 0)
        const msg = 'No data found for this request(200).';
        this.throwGridError(msg);
      }
    });
  }

  /* Manikanta Ch code changes start here***/
    /** display error messages in grid  */
  
  throwGridError(msg: string): void {
    this.overlayNoDataTemplate = '<span class="showgridMsg">' + msg + '</span>';

    setTimeout(() => {
      this.gridApi.showNoRowsOverlay();
    }, 1000);

  }

  DateCellRenderer(params: ICellRendererParams) {
    return this.formatDate(params.value);
  }
  
/* Manikanta Ch code changes for pagination and sorting implementation code end here on 09102023 */
  // ---
}