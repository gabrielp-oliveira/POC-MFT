import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ImageService } from 'src/app/shared/services/image.service';
import { AppStoreService } from 'src/app/shared/stores/app-store.service';
import { FiltersService } from './filters.service';
import { Subject, Subscription } from 'rxjs';
import { PermissionService } from 'src/app/shared/services/permission.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit, OnDestroy {

  @Output() isClearFilters = new EventEmitter();
  
  constructor(
    private readonly imgSrvc: ImageService,
    private readonly permissionSrvc: PermissionService,
    private readonly appStoreSrvc: AppStoreService,
    private readonly filterSrvc: FiltersService
  ) { }

  onSubRoleActivatedObserver$: Subscription;

  ngOnDestroy(): void {
    this.onSubRoleActivatedObserver$.unsubscribe();
  }

  filterIcon: string = this.imgSrvc.filterIcon;
  isClearFilterDisabled: boolean = false;

  ngOnInit(): void {
    this.onSubRoleActivatedObserver$ = this.filterSrvc.isSubRoleActivated().subscribe(
      (result) => { this.appStoreSrvc.isSubRoleActivated.setValue(result); },
      (error) => { console.log(error); }
    )
  }

  clearAllFilters() {
    this.isClearFilters.emit(true)
    this.appStoreSrvc.clearFilters();
   
  }
  //---
}