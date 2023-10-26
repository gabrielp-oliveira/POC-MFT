import { inject } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { HelperService } from "../services/helper.service";

/**
 * @author Pradeep. R
 * @email prajendr@cswg.com
 * @createdOn 09/Dec/2022
 * @version 0.1
*/
export class Store<T> {

  /** @remarks static factory */
  static CREATE<T>(defaultValue: T, observers: BehaviorSubject<boolean>[] = [] || null) {
    return new Store<T>(defaultValue, observers);
  }

  private __isStoreItem: boolean = true;
  private _isNotEqualRef: (obj1: any, obj2: any) => boolean;
  private _subject$ = new BehaviorSubject<T>(this.defaultValue);

  private constructor(
    private readonly defaultValue: T = null,
    private readonly observers: BehaviorSubject<boolean>[]
  ) {
    const helperSrvc: HelperService = inject(HelperService);
    this._isNotEqualRef = helperSrvc.isNotEqual;
  }

  reset() {
    this._subject$.next(this.defaultValue);
  }

  get value(): T {
    return this._subject$.value;
  }

  onChange(): Observable<T> {
    return this._subject$.asObservable();
  }

  setValue(_value: T,  _force: boolean = false) {
    if (_force || this._isNotEqualRef(this.value, _value)) {
      this._subject$.next(_value);
      (this.observers || []).forEach(_observer => { _observer.next(true); });
    }
  }

  /**
   * It won't trigger the observers like setValue
   * @param _value 
   */
  sneakValue(_value: T) {
    this._subject$.next(_value);
  }

  // ---
}