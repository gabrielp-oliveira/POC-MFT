import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { HelperService } from 'src/app/shared/services/helper.service';
import { AppStoreService } from 'src/app/shared/stores/app-store.service';

@Component({
  selector: 'app-date-range-filter',
  templateUrl: './date-range-filter.component.html',
  styleUrls: ['./date-range-filter.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DateRangeFilterComponent implements OnInit, OnDestroy {
  @ViewChild('idDateRangePicker', { static: false }) private idDateRangePicker: any;

  constructor(
    private readonly appStoreSrvc: AppStoreService,
    private readonly helperSrvc: HelperService
  ) { }

  onClearAllFilters$: Subscription;
  ngOnDestroy(): void {
    this.onClearAllFilters$.unsubscribe();
  }

  minDate: Date = this.helperSrvc.subtractDays(90);
  maxDate: Date = (new Date());
  selectedDates: Date[] = null

  ngOnInit(): void {
    this.onClearAllFilters$ = this.appStoreSrvc.onClearFilters()
      .subscribe((_value) => this.clearSelectedDates());

    this.selectedDates = [this.helperSrvc.subtractDays(6), (new Date())];
    this.appStoreSrvc.selectedDateRange.sneakValue({
      startDate: this.helperSrvc.formatDate(this.selectedDates[0]),
      endDate: this.helperSrvc.formatDate(this.selectedDates[1])
    });
  }

  onDateSelectionChange($event) {
    if(this.selectedDates[1] !== undefined && this.selectedDates[1] !== null) {
      this.idDateRangePicker.overlayVisible = false;
      const _startDate = this.helperSrvc.formatDate(this.selectedDates[0]);
      const _endDate = this.helperSrvc.formatDate(this.selectedDates[1]);

      this.appStoreSrvc.selectedDateRange.setValue({
        startDate: _startDate,
        endDate: _endDate ? _endDate : _startDate
      });
    }
    // if (this.selectedDates?.length === 2) {
    // }
  }

  clearSelectedDates() {
    this.selectedDates = [this.helperSrvc.subtractDays(6), (new Date())];
    const startDate =  this.helperSrvc.formatDate(this.selectedDates[0])
    const endDate = this.helperSrvc.formatDate(this.selectedDates[1])
    this.appStoreSrvc.selectedDateRange.setValue({
      startDate: startDate,
      endDate: endDate
    }); 
  }



  //---
}