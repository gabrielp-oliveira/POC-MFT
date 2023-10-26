import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {

  constructor() { }

  public readonly NO_DATA_FOUND_ERROR_200 = 'No data found for this request (200)';

  public handle(err: HttpErrorResponse): Observable<any> {
    let errorMessage = '';
    console.log(err)
    if (err.error instanceof Error) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      if (err.status === 0) {
        errorMessage = 'Unable to reach the server(#0). Please try after some time.';
      } else if (err.status === 401) {
        errorMessage = 'Your session is expired! Please login';
        const logout = new CustomEvent('logout', { detail: { code: 401, logout: true } });
        window.dispatchEvent(logout);
      } else if (err.status === 500) {
        errorMessage = 'Unable to complete request(500). Please try after some time.';
      } else if (err.status === 404) {
        errorMessage = 'No data found for this request(404)';
      } else if (err.status === 400) {
        errorMessage = 'Unable to reach the server(400). Please try after some time.';
      } else if (err.status === 204) {
        errorMessage = 'No data found for this request(204).';
      } else if (err.status === 415) {
        errorMessage = 'Server refuses to accept the request(415). Please try after some time.';
      } else if (err.status === 429) {
        errorMessage = 'Server refuses to accept the request(429). Please try after some time.';
      } else if (err.status === 200) {
        errorMessage = this.NO_DATA_FOUND_ERROR_200;
      } else {
        errorMessage = `Unable to reach the server(${err.status}). Please try after some time.`;
      }
    }
    return throwError(errorMessage);
  }


}