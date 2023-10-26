import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { catchError, take } from 'rxjs/operators';

import { IStoreResponse } from 'src/app/shared/interfaces/IStore';
import { EnvironmentService } from 'src/app/shared/services/environment.service';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { AppStoreUtilsService } from 'src/app/shared/stores/app-store-utils.service';
import { PermissionService } from 'src/app/shared/services/permission.service';


@Injectable({ providedIn: 'root' })
export class StoreFilterService {

    constructor(
        private readonly httpClient: HttpClient,
        private readonly errorSrvc: ErrorHandlerService,
        private readonly environmentSrvc: EnvironmentService,
        private readonly permissionSrvc: PermissionService,
        private readonly appStoreUtilsSrvc: AppStoreUtilsService
    ) { }

    private _storeResponse$ = new Subject<IStoreResponse>();

    fetchStores(): Observable<IStoreResponse> {
        if (this.permissionSrvc.isGSAdmin) {
            return this._fetchAllActiveStores();
        } else {
            return this._fetchUserStores();
        }
    }

    private _fetchUserStores(): Observable<IStoreResponse> {
        this._storeResponse$ = new Subject<IStoreResponse>();

        let url = this.environmentSrvc.getHttpUrl('getUserStores');
        url += `/${this.appStoreUtilsSrvc.userName}/${this.appStoreUtilsSrvc.tenantCode}`;

        this.httpClient.get(url)
            .pipe(take(1)).pipe(catchError(this.errorSrvc.handle)).subscribe(
                (successObj) => { this._storeResponse$.next(successObj); },
                (error) => { this._storeResponse$.error(error); }
            );

        // ---
        return this._storeResponse$.asObservable();
    }

    private _fetchAllActiveStores(): Observable<IStoreResponse> {
        this._storeResponse$ = new Subject<IStoreResponse>();

        this.httpClient.post(this.environmentSrvc.getHttpUrl('getAllActiveStores'), this._getPayload())
            .pipe(take(1)).pipe(catchError(this.errorSrvc.handle)).subscribe(
                (successObj) => { this._storeResponse$.next(successObj); },
                (error) => { this._storeResponse$.error(error); }
            );

        // ---
        return this._storeResponse$.asObservable();
    }

    private _getPayload() {
        const payload = {
            storeIds: null,
            status: "active",
            tenantCode: "2023-GS-PRTL",
            sortColumn: "customerNbr",
            sortType: "asc"
        };
        return payload;
    }


    sortAndFormatResponse(_value: IStoreResponse) {
        //NOTE: here customerNbr is tha actual storeNumber
        _value.storeList.map(x => x.formattedText = `${x.customerNbr} - ${x.storeName}`);
        return _value;
    }


    //---
}