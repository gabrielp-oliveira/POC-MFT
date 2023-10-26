import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { IApiService } from 'src/app/shared/interfaces/IApiService';

import { HelperService } from './helper.service';
import { SubscriptionHandlerService } from './subscription-handler.service';

/**
 * @author Pradeep. R
 * @email prajendr@cswg.com
 * @createdOn 09/Dec/2022
 * @version 0.1
*/
@Injectable({ providedIn: 'root' })
export class EnvironmentService {

  constructor(
    private readonly httpClient: HttpClient,
    private readonly helperSrvc: HelperService,
    private readonly subscriptionHandler: SubscriptionHandlerService,
  ) { }

  readonly isProdEnv: boolean = environment.production === true;
  readonly isNotProdEnv: boolean = environment.production === false;

  readonly baseURL = environment.baseURL;
  readonly wsPath = environment.wsPath;
  readonly propertiesUrl: string = environment.propertiesUrl;

  readonly jsonHeader = new HttpHeaders({ 'Content-Type': 'application/json;', });
  readonly promotionsPath: string = environment.baseURL + 'promotions.json';


  private _init$ = new Subject<boolean>();
  init(): Observable<boolean> {
    this._init$ = new Subject<boolean>();

    this.httpClient.get(this.wsPath)
      .pipe(take(1)).subscribe((properties) => {
        this.setHttpUrl(properties)
          .setMainImgID(properties['mainImgID'])
          .setCmsImagePath(properties['cmsImagePath']);

        console.log('INITIALIZED', 'EnvironmentService');
        this.subscriptionHandler.delayedCompleteSubject(this._init$, true);
      });

    return this._init$.asObservable();
  }

  private getService(serviceName: string): IApiService {
    return this.httpUrl[serviceName];
  }

  private _cmsImagePath: string = '';
  getCmsImagePath() { return this._cmsImagePath; }
  private setCmsImagePath(value: string) {
    this._cmsImagePath = value;
    return this;
  }

  private _mainImgID: number = 1;
  getMainImgID() { return this._mainImgID; }
  private setMainImgID(value: number) {
    this._mainImgID = value;
    return this;
  }

  private httpUrl: Object;
  getHttpUrl(serviceName: string): any {
    const { serverHost, contextRoot, endPoint } = this.getService(serviceName);
    return `${serverHost}${this.helperSrvc.getStringOrDefault(contextRoot, '')}${endPoint}`;
  }
  private setHttpUrl(value: Object) {
    this.httpUrl = value;
    return this;
  }


  private _elasticToken: string = '';
  getElasticToken(): string {
    const { key } = this.helperSrvc.getStringOrDefault(this._elasticToken, this.httpUrl['_search']);
    return key;
  }


  //---
}

