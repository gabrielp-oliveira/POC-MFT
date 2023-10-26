import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  
  properties: any = {};

  constructor(
    private http: HttpClient,
    private err: ErrorHandlerService,
  ) { }

  setProperties(JSON: any): void {
    this.properties = JSON;
  }
  
  getProperty(propertyName: string): any {
    return this.properties[propertyName];
  }

  // APIM integration
  getHttpUrl(serviceName: string){
    const data = this.getProperty(serviceName);
    let url;
    if (data.contextRoot === undefined || data.contextRoot === '' || data.contextRoot === null) {
      url = data.serverHost + data.endPoint;
    } else {
      url = data.serverHost + data.contextRoot + data.endPoint;
    }
    return url;
  }
  
  getContentDetails(body): Observable<any> {
    return this.http.post(this.getHttpUrl('getCMSData'), body).pipe(catchError(this.err.handle));
  }
}
