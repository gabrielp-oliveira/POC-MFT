import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-mft',
  templateUrl: './mft.component.html',
  styleUrls: ['./mft.component.scss']
})
export class StoreReportsComponent implements OnInit {

  isClearFilters: any; 

  isFiltersCleared: any;

  constructor(
    private readonly spinnerSrvc: NgxSpinnerService
  ) { }

  ngOnInit(): void {
  }

  closeSpinner() {
    this.spinnerSrvc.hide();
  }
  getClearFilters(event) {
    this.isClearFilters = event
  }

  checkIsFiltersApplied(event) {
    this.isFiltersCleared = event
   
  }
  // ---
}