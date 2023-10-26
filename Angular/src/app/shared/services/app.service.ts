import { Injectable } from '@angular/core';
import { combineLatest, Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';

import { SubscriptionHandlerService } from './subscription-handler.service';
import { EnvironmentService } from './environment.service';
import { PermissionService } from './permission.service';
import { AgGridService } from './ag-grid.service';
import { AppStoreService } from '../stores/app-store.service';
import { IAppInputData } from '../interfaces/IAppInputData';

/**
 * @author Pradeep. R
 * @email prajendr@cswg.com
 * @createdOn 09/Dec/2022
 * @version 0.1
*/
@Injectable({ providedIn: 'root' })
export class AppService {

  private readonly APP_INIT_SUBSCRIPTION_KEY = 'app_init_subscription';

  constructor(
    private readonly subscriptionSrvc: SubscriptionHandlerService,
    private readonly environmentSrvc: EnvironmentService,
    private readonly agGridSrvc: AgGridService,
    private readonly permissionSrvc: PermissionService,
    private readonly appStoreSrvc: AppStoreService
  ) { }


  private init$ = new Subject<boolean>();
  init(appInput: IAppInputData): Observable<boolean> {
    this.init$ = new Subject<boolean>();
    console.log('APP-INPUT', appInput);

    // services should be initialized as per the dependency order
    this.subscriptionSrvc.clearAll();
    this.subscriptionSrvc.add(this.APP_INIT_SUBSCRIPTION_KEY,
      combineLatest([
        this.appStoreSrvc.init(appInput),
        this.environmentSrvc.init(),
        this.agGridSrvc.init(),
        this.permissionSrvc.init(),
      ]).pipe(take(1)).subscribe(
        (_success) => {
          console.log('App Init completed.!')
          this.subscriptionSrvc.delayedCompleteSubject(this.init$, true);
        },
        (_error) => {
          console.log('App Init failed.!')
          this.subscriptionSrvc.delayedCompleteSubject(this.init$, false);
        }
      )
    );

    //---
    return this.init$.asObservable();
  }


  //---
}