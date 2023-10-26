import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { IReport } from 'src/app/shared/interfaces/IReport';
import { IReportsPayload } from 'src/app/shared/interfaces/IReportsPayload';
import { EnvironmentService } from 'src/app/shared/services/environment.service';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { AppStoreService } from 'src/app/shared/stores/app-store.service';
import { AppStoreUtilsService } from 'src/app/shared/stores/app-store-utils.service';


@Injectable({ providedIn: 'root' })
export class ReportNameFilterService {

  constructor(
    private readonly httpClient: HttpClient,
    private readonly environmentSrvc: EnvironmentService,
    private readonly errorSrvc: ErrorHandlerService,
    private readonly appStoreSrvc: AppStoreService,
    private readonly appStoreUtilsSrvc: AppStoreUtilsService
  ) { }

  private _reportResponse$ = new Subject<IReport[]>();
  fetchReportNames(): Observable<IReport[]> {
    this._reportResponse$ = new Subject<IReport[]>();

    this.httpClient.post(this.getUrl(), this.getPayload())
      .pipe(take(1)).pipe(catchError(this.errorSrvc.handle)).subscribe(
        (successObj) => { this._reportResponse$.next(successObj); },
        (error) => { this._reportResponse$.error(error); }
      );

    // ---
    return this._reportResponse$.asObservable();
  }

  sortAndFormatResponse(_value: IReport[]) {
    _value.map(x => x.formattedText = `${x.reportName}`);
    return _value;
  }

  private getUrl(): string {
    let url = this.environmentSrvc.getHttpUrl('getReportNames');
    return url;
  }

  private getPayload(): IReportsPayload {
    const payload: IReportsPayload = {
      storeNbrs: this.appStoreUtilsSrvc.getSelectedStoreNumbersAsString(),
      companyCodes: this.appStoreUtilsSrvc.getSelectedLegacyCompanyCodes(),
      reportType: this.appStoreSrvc.REPORT_TYPE_REPORT,
    }
    // ---
    return payload;
  }

  //---
}