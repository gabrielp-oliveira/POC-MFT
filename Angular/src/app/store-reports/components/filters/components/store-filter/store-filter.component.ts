import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { IStore } from 'src/app/shared/interfaces/IStore';
import { StoreFilterService } from './store-filter.service';
import { PermissionService } from 'src/app/shared/services/permission.service';
import { AppStoreService } from 'src/app/shared/stores/app-store.service';
import { AppStoreUtilsService } from 'src/app/shared/stores/app-store-utils.service';


@Component({
    selector: 'app-store-filter',
    templateUrl: './store-filter.component.html',
    styleUrls: ['./store-filter.component.scss']
})
export class StoreFilterComponent implements OnInit, OnDestroy {

    constructor(
        private readonly toastSrvc: ToastrService,
        private readonly appStoreSrvc: AppStoreService,
        private readonly appStoreUtilsSrvc: AppStoreUtilsService,
        private readonly storeFilterSrvc: StoreFilterService,
        private readonly permissionSrvc: PermissionService
    ) { }

    onClearAllFilters$: Subscription;
    onStoresDataSource$: Subscription;

    isInvalid: boolean = false;
    dataSource: IStore[] = null;
    selectedItems: IStore[] = [];
    selectionDisplayString: string = '';

    ngOnDestroy(): void {
        this.onClearAllFilters$.unsubscribe();
        this.onStoresDataSource$.unsubscribe();
    }

    ngOnInit(): void {
        // ---observers---
        this.onClearAllFilters$ = this.appStoreSrvc.onClearFilters()
            .subscribe((_value) => this.clearSelectedItems());
        this.onStoresDataSource$ = this.appStoreSrvc.stores.onChange()
            .subscribe((_value) => this.onDataSourceChange(_value));
        // ---load-data-source---
        this.fetchDataSource();
    }

    fetchDataSource() {
        this.clearDataSource(true);
        this.storeFilterSrvc.fetchStores().subscribe(
            (response: any) => {
                const derivedResponse = this.permissionSrvc.isNotGSAdmin ? response : {
                    storeList: response.response,
                    defaultStore: this.appStoreUtilsSrvc.storeNumber,
                    userId: this.appStoreUtilsSrvc.userName
                };

                this.storeFilterSrvc.sortAndFormatResponse(derivedResponse);
                this.appStoreSrvc.stores.setValue(derivedResponse.storeList);
            },
            (error) => {
                this.isInvalid = false;
                this.toastSrvc.error('Error while fetching Stores.');
                console.log('Stores Fetch Error', error);
            }
        );
    }

    clearDataSource(_propagate: boolean) {
        if (_propagate) { this.appStoreSrvc.selectedStores.setValue(null); }
        this.selectedItems = [];
        this.dataSource = [];
        this.isInvalid = true;
    }

    onDataSourceChange(_value: IStore[]) {
        this.clearDataSource(false);
        this.dataSource = _value;
        this.setParentStoreAsSelectedStore();
        this.isInvalid = !_value || _value.length <= 0;
    }

    setParentStoreAsSelectedStore() {
        const parentStore = this.appStoreUtilsSrvc.getStoreByParentStore();
        if (parentStore) {
            this.selectedItems = [parentStore];
            this.applyFilters(null);
        }
    }

    clearSelectedItems() {
        this.selectedItems = [];
        this.appStoreSrvc.selectedStores.setValue(null);
    }

    applyFilters($event) {
        console.log(this.selectedItems)
        this.appStoreSrvc.selectedStores.setValue(this.selectedItems);
        this.setSelectionDisplayString();
    }

    setSelectionDisplayString() {
        if (this.selectedItems.length === 1) {
            this.selectionDisplayString = this.selectedItems[0].formattedText; //`1 Store`;
        } else if (this.selectedItems.length === this.dataSource.length) {
            this.selectionDisplayString = `All (${this.selectedItems.length} Stores)`;
        } else {
            this.selectionDisplayString = `${this.selectedItems.length} Stores`;
        }
    }

    
    //---
    getFormatList(){}
}