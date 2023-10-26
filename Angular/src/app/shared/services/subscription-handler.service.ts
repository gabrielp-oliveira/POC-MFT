import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { ErrorHandlerService } from './error-handler.service';

/**
 * @author Pradeep. R
 * @email prajendr@cswg.com
 * @createdOn 10/Jul/2023
 * @version 0.1
*/
@Injectable({ providedIn: 'root' })
export class SubscriptionHandlerService {

  constructor(
    private readonly errorHandlerService: ErrorHandlerService
  ) { }

  subscriptionsMap: Map<string, Subscription> = new Map();

  /**
   * If exists, then it unsubscribes first & adds the new value
   * @param key 
   * @param value 
   */
  add(key: string, value: Subscription) {
    this.unSubscribe(key);
    this.subscriptionsMap.set(key, value);
  }

  unSubscribe(key: string) {
    if (this.subscriptionsMap.has(key)) {
      let value = this.subscriptionsMap.get(key);
      if (value) { value.unsubscribe(); }
      this.subscriptionsMap.delete(key);
    }
  }

  clear(keys: string[]) {
    keys.forEach(key => {
      this.unSubscribe(key);
    });
  }

  clearAll() {
    this.subscriptionsMap.forEach(subscription => {
      subscription.unsubscribe();
    });
    this.subscriptionsMap.clear();
  }

  /**
    * @remarks completes a subject after emiting a given value
    * @param subject 
    * @param value 
    * @param timeout default is 100ms
    */
  complete<T>(
    subject: BehaviorSubject<T>, value: T, timeout: number = 100
  ): void {
    setTimeout(() => {
      subject.next(value);
      subject.complete();
    }, timeout);

  }


  /**
    * @remarks completes a subject after emiting a given value
    * @param subject 
    * @param value 
    * @param timeout default is 100ms
    */
  delayedCompleteSubject<T>(
    subject: Subject<T>, value: T, timeout: number = 100
  ): void {
    setTimeout(() => {
      subject.next(value);
      subject.complete();
    }, timeout);

  }

  

  //---
}