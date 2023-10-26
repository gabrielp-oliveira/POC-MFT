import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorHandlerService } from '../shared/services/error-handler.service';
import { EnvironmentService } from '../shared/services/environment.service';
import { catchError, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MftService {

  constructor(
    private readonly httpClient: HttpClient,
    private readonly errorSrvc: ErrorHandlerService,
    private readonly environmentSrvc: EnvironmentService,
  ) { }

  
  //---
  getFormatList() : Observable<any>{
    return this.httpClient.get(this.environmentSrvc.getHttpUrl('getFormatList'))
    .pipe(take(1)).pipe(catchError(this.errorSrvc.handle))
  }
  uploadFiles(store, docList: File[]): Observable<any>{
    let testData:FormData = new FormData();
    testData.append('file_upload', docList[0], docList[0].name);

    return this.httpClient.post(this.environmentSrvc.getHttpUrl('uploadFiles'), {testData})
    .pipe(take(1)).pipe(catchError(this.errorSrvc.handle))
  }
  
}