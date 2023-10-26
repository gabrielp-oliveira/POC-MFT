import { Injectable } from '@angular/core';
import * as _ from 'underscore';
import { StringFilterEnum } from '../enums/string-filter.enum';

/**
 * @author Pradeep. R
 * @email prajendr@cswg.com
 * @createdOn 09/Dec/2022
 * @version 0.1
*/
@Injectable({ providedIn: 'root' })
export class HelperService {

  constructor() { }

  //---object----------------------

  /** returns true if the object is NULL (OR) UNDEFINED **/
  isNullOrUndefined(obj: any): boolean {
    return obj === undefined || obj === null || typeof (obj) == "undefined";
  }

  isArrayEqual<T>(_array1: T[], _array2: T[]) {
    return _.isEqual(_array1, _array2);
  }
  isArrayNotEqual<T>(_array1: T[], _array2: T[]) {
    return !this.isArrayEqual(_array1, _array2);
  }

  isObject = (_value: any) => {
    return typeof _value === 'object';
  }
  isNotObject(_value: any) { return !this.isObject(_value); }

  isEqual = (obj1: any, obj2: any) => {
    const tempObj1 = this.isObject(obj1) ? { ...obj1 } : obj1;
    const tempObj2 = this.isObject(obj2) ? { ...obj2 } : obj2;
    return _.isEqual(tempObj1, tempObj2);
  }
  isNotEqual = (obj1: any, obj2: any) => { return !this.isEqual(obj1, obj2); }

  sortBy = (a, b) => {
    return a > b ? +1 : a < b ? -1 : 0;
  }
  sortByDesc = (a, b) => {
    return a > b ? -1 : a < b ? +1 : 0;
  }

  deepClone = (obj: any) => {
    return JSON.parse(JSON.stringify(obj))
  }

  /**
   * 
   * @param obj 
   * @returns returns true if the object is NOT-NULL (AND) NOT-UNDEFINED
   */
  isNotNullOrUndefined(obj: any): boolean {
    return !this.isNullOrUndefined(obj);
  }

  //---boolean---------------------
  /**
   * 
   * @param value 
   * @returns if the value equals {true} then returs true, for all others (string, number,null,undefiend, etc,..) returns false
   */
  parseBoolean(value: any) {
    return (value === true);
  }

  /**
   * 
   * @param value 
   * @returns return <true> only if the value exactly equals <true>
   */
  isTrue(value: any) {
    return this.parseBoolean(value);
  }

  /**
   * 
   * @param value 
   * @returns return <true> only if the value exactly equals <false>
   */
  isFalse(value: any) {
    return (value === false);
  }



  //---string----------------------

  parseDbValue(_value: any) {
    switch (_value) {
      case undefined:
      case null:
      case false:
      case typeof (_value) == "undefined":
        return '';
      default:
        return _value;
    }
  }

  isStringNullOrEmpty(value: string = ''): boolean {
    const tt = this.isNullOrUndefined(value) || (value + '').trim() === '';
    return tt;
  }

  isValidString(value: any): boolean {
    const tt = !this.isStringNullOrEmpty(value);
    return tt;
  }

  getStringOrDefault(value: any, defaultValue = '') {
    return this.isStringNullOrEmpty(value) ? defaultValue : value;
  }

  getValidDateStringOrDefault(_value: string, _defaultValue: string = '') {
    let returnValue = this.getStringOrDefault(_value);
    return returnValue === '0001-01-01' ? "" : returnValue;
  }

  formatDate(_value: Date) {
    if (_value) {
      const monthValue = _value.getMonth() + 1;
      const monthString = monthValue < 10 ? `0${monthValue}` : monthValue;

      const dayValue = _value.getDate();
      const dayString = dayValue < 10 ? `0${dayValue}` : dayValue;

      return `${_value.getFullYear()}-${monthString}-${dayString}`;
    }
    else { return null; }
  }

  stringIsOfMinLength(value: any, minLength = 3) {
    return this.isNullOrUndefined(value) || (value + '').trim().length >= minLength;
  }

  stringIsOfMaxLength(value: any, maxLength = 3) {
    return this.isNullOrUndefined(value) || (value + '').trim().length <= maxLength;
  }

  stringIsOfLengthBetween(value: any, minLength = 3, maxLength = 256) {
    return this.stringIsOfMinLength(value, minLength) && this.stringIsOfMaxLength(value, maxLength);
  }

  toTitleCase(_value: string) {
    return _value.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
    });
  }

  insertStringAtIndex(_target: string, _targetIndex: number, _value: string,) {
    const splited = (_target + '').split('');
    if (splited.length > _targetIndex) {
      splited.splice(_targetIndex, 0, _value);
    }
    return splited.join('');
  }


  //---string-filters--------------

  stringContains(testString: string, targetString: string) {
    return this.applyFilter(StringFilterEnum.Contains, testString, targetString);
  }

  stringNotContains(testString: string, targetString: string) {
    return this.applyFilter(StringFilterEnum.NotContains, testString, targetString);
  }

  stringEquals(testString: string, targetString: string) {
    return this.applyFilter(StringFilterEnum.Equals, testString, targetString);
  }

  stringNotEquals(testString: string, targetString: string) {
    return this.applyFilter(StringFilterEnum.NotEquals, testString, targetString);
  }

  stringEndsWith(testString: string, targetString: string) {
    return this.applyFilter(StringFilterEnum.EndsWith, testString, targetString);
  }

  stringStartsWith(testString: string, targetString: string) {
    return this.applyFilter(StringFilterEnum.StartsWith, testString, targetString);
  }

  /**
   * String Filter
   * @param filterType 
   * @param testString 
   * @param targetString 
   * @returns Returns true if the matches else returns false
   */
  applyFilter(filterType: StringFilterEnum, testString: string, targetString: string) {
    const valueLowerCase = (targetString + '').toLowerCase();
    const filterTextLowerCase = (testString + '').toLowerCase();

    switch (filterType) {
      case StringFilterEnum.Contains:
        return valueLowerCase.indexOf(filterTextLowerCase) >= 0;
      case StringFilterEnum.NotContains:
        return valueLowerCase.indexOf(filterTextLowerCase) === -1;
      case StringFilterEnum.Equals:
        return valueLowerCase === filterTextLowerCase;
      case StringFilterEnum.NotEquals:
        return valueLowerCase != filterTextLowerCase;
      case StringFilterEnum.StartsWith:
        return valueLowerCase.indexOf(filterTextLowerCase) === 0;
      case StringFilterEnum.EndsWith:
        var index = valueLowerCase.lastIndexOf(filterTextLowerCase);
        return index >= 0 && index === (valueLowerCase.length - filterTextLowerCase.length);
      default:
        return false;
    }
  }



  //---number----------------------

  isNumberShouldBeMinimum(value: any, minValue: number): boolean {
    return (this.isNotNullOrUndefined(value) && value >= minValue);
  }

  isNumberShouldBeMaximum(value: any, maxValue: number): boolean {
    return (this.isNotNullOrUndefined(value) && value <= maxValue);
  }

  isNumberGreaterThan(value: any, minValue: number): boolean {
    return (this.isNotNullOrUndefined(value) && value > minValue);
  }

  isNumberNotGreaterThan(value: any, minValue: number): boolean {
    return !this.isNumberGreaterThan(value, minValue);
  }

  isNumberLesserThan(value: any, minValue: number): boolean {
    return (this.isNotNullOrUndefined(value) && value < minValue);
  }
  isNumberEqualOrLesser(value: any, valueToTest: number): boolean {
    return (this.isNotNullOrUndefined(value) && value <= valueToTest);
  }

  isNumberNotLesserThan(value: any, minValue: number): boolean {
    return !this.isNumberLesserThan(value, minValue);
  }


  /**
   * False if <Null/Undefined/''/ invalid chars>
   * True if integer or decimal
   * @param {*} value 
  */
  isValidNumber(value: any) {
    if (this.isStringNullOrEmpty(value)) { return false; } // null / undefined / ''
    else if (value === '-Infinity') { return false; }
    else if (Number.isNaN(value)) { return false; }
    else { return true; }
  }

  isNotValidNumber(value: any): boolean {
    return !this.isValidNumber(value);
  }

  getNumberOrDefault(value: any, defaultValue: number | null = null) {
    return this.isValidNumber(value) ? Number(value) : defaultValue;
  }
  getNumberOrDefaultNumber(value: any, defaultValue: number = 0) {
    const number = Number(value);
    return this.isValidNumber(number) ? number : defaultValue;
  }

  getPriceOrDefault(_value: any, _defaultValue: number = 0): string {
    const cleanedPrice = (_value + '').replace(' ', '').replace('$', '');
    const numericPrice = this.getNumberOrDefaultNumber(cleanedPrice, _defaultValue);
    return parseFloat(numericPrice + '').toFixed(2);
  }



  //---array----------------------

  isValidArray(value: any): boolean {
    return this.isNotNullOrUndefined(value) && Array.isArray(value);
  }

  hasElements<T>(array: T[]) {
    return this.isValidArray(array) && array.length > 0;
  }

  hasNoElements<T>(array: T[]) {
    return !this.hasElements(array);
  }

  getDistinct<T>(array: T[]): T[] {
    return this.hasNoElements(array) ? [] : [...new Set(array)];
  }

  /** @returns items from array-1 that are not in array-2 */
  getDifference<T>(_array1: T[], _array2: T[]): T[] {
    return _.difference((_array1 || []), (_array2 || []));
  }

  /** @returns (array-1 items that are not in arrya-2) & (array-2 items that are not in array-1) */
  getSymmetricDifference<T>(_array1: T[], _array2: T[]): T[] {
    const a1Diff = [...this.getDifference(_array1, _array2)];
    const a2Diff = [...this.getDifference(_array2, _array1)];

    return [...a1Diff, ...a2Diff];
  }

  arrayToString<T>(array: T[], delim = ",") {
    if (this.hasNoElements(array)) { return ''; }
    else { return array.length === 1 ? '' + array[0] : array.join(delim); }
  }

  arrayToObject<T>(array: T[], keyProp: string, valueProp: string) {
    if (this.hasNoElements(array)) { return {}; }
    else {
      return array.reduce((obj: any, item: any) => {
        obj[item[keyProp]] = item[valueProp];
        return obj;
      }, {});
    }
  }

  insertAt<T>(targetArray: T[], targetIndex: number, elementToInsert: T) {
    if (this.hasElements(targetArray)) {
      const maxIndex = targetArray.length - 1;
      if (maxIndex <= targetIndex) { targetArray.push(elementToInsert); } // push at the end
      else { targetArray.splice(targetIndex, 0, elementToInsert); }
    }
    return targetArray;
  }

  getFirstOrDefault<T>(array: T[], defaultValue = null) {
    if (this.hasElements(array)) { return array[0]; }
    return defaultValue;
  }

  getLastOrDefault<T>(array: T[], defaultValue = null) {
    if (this.hasElements(array)) { return array[array.length - 1]; }
    return defaultValue;
  }

  sortArrayAsc<T>(array: T[], prop: string): T[] {
    if (this.hasNoElements(array)) {
      return array;
    } else {
      return array.sort((a: any, b: any) => (a[prop] > b[prop]) ? 1 : -1);
    }
  }

  sortArrayDesc<T>(array: T[], prop: string): T[] {
    return this.sortArrayAsc(array, prop).reverse();
  }



  /**
   * 
   * @param booleanArray 
   * @param defaultValue value to return if the array is empty or null
   * @returns return true as soon as it finds a truthy element
   */
  hasAnyTrue(booleanArray: boolean[], defaultValue: boolean = false) {
    if (this.hasNoElements(booleanArray)) { return defaultValue; }
    else {
      booleanArray.some(bool => {
        if (bool) { return true; }
      });
      return false;
    }
  }

  /**
   * For quick iteration, it return the negation of hasAnyTrue()
   * @param booleanArray 
   * @param defaultValue value to return if the array is empty or null
   * @returns If array is empty, returns defaultValue
   */
  isAllFalse(booleanArray: boolean[], defaultValue: boolean = true) {
    return !this.hasAnyTrue(booleanArray, defaultValue);
  }

  /**
   * 
   * @param booleanArray 
   * @param defaultValue value to return if the array is empty or null
   * @returns return true as soon as it finds a falsy element
   */
  hasAnyFalse(booleanArray: boolean[], defaultValue: boolean = false) {
    if (this.hasNoElements(booleanArray)) { return defaultValue; }
    else {
      booleanArray.some(bool => {
        if (!bool) { return true; }
      });
      return false;
    }
  }

  /**
   * For quick iteration, it return the negation of hasAnyFalse()
   * @param booleanArray 
   * @param defaultValue value to return if the array is empty or null
   * @returns If array is empty, returns defaultValue
   */
  isAllTrue(booleanArray: boolean[], defaultValue: boolean = false) {
    return !this.hasAnyFalse(booleanArray, defaultValue);
  }



  //---map-----------------------

  mapHasElements<K, V>(map: Map<K, V>) {
    return this.isNotNullOrUndefined(map) && map.size > 0;
  }

  mapHasNoElements<K, V>(map: Map<K, V>) {
    return !this.mapHasElements(map);
  }

  getMapKeys<K, V>(map: Map<K, V>) {
    return this.mapHasElements(map) ? Array.from(map.keys()) : [];
  }



  //---object--------------------

  isValidObject(value: any) {
    return this.isNotNullOrUndefined(value) && typeof value === 'object';
  }

  sortObjectByKeysAsc<T>(obj: T) {
    if (this.isNullOrUndefined(obj)) { return {}; }
    else {
      return Object.keys(obj).sort().reduce((result: any, key: string) => {
        result[key] = obj[key];
        return result;
      }, {});
    }
  }

  sortObjectByKeysDesc<T>(obj: T) {
    return this.sortObjectByKeysAsc(obj).reverse();
  }


  sortObjectByEntries<T>(obj: T, sortProp: string) {
    if (this.isNullOrUndefined(obj)) { return obj; }
    else {
      const entries = Object.entries(obj);
      const keys = Object.keys(obj);
      if (keys.includes(sortProp)) {
        return entries.sort((a: any, b: any) => a[1][sortProp] - b[1][sortProp]).map((x) => x[1]);
      }
      else { return obj; }
    }
  }



  /**
   * adds a key to an object
   * Link : https://gomakethings.com/how-to-add-a-new-item-to-an-object-at-a-specific-position-with-vanilla-js/
   * @param targetObj 
   * @param newKey 
   * @param newValue 
   * @param newIndex inserts to the specific position or to the end if not specified
   * @returns 
   */
  addToObject<T, V>(targetObj: T, newKey: string, newValue: V, newIndex: number | undefined) {

    var tempObj: Record<string, V> = {};

    // If no index, add to the end
    if (!newIndex && newKey && newValue) {
      tempObj[newKey] = newValue;
    }
    else {
      // Create an index variable
      var currentIndex = 0;

      // Loop through the original object.
      // const targetObjProps: string[] = Object.keys(tempObj); <--- don't use this since it gives a key value pair
      for (var targetObjProp in tempObj) {
        if (targetObj.hasOwnProperty(targetObjProp)) {

          // If the indexes match, add the new item
          if (currentIndex === newIndex && newKey && newValue) {
            tempObj[newKey] = newValue;
          }

          // Add the current item in the loop to the temp obj
          tempObj[targetObjProp] = targetObj[targetObjProp];

          // Increase the count
          currentIndex++;
        }
      }
    }

    // return
    return tempObj;
  };


  //---json----------------------

  /**
   * this adds escape characters to the json object and stringifies it
   * @param {*} jsonObj 
  */
  addEscapeCharactersToJsonString(jsonObj: any) {
    return JSON.stringify(JSON.stringify(jsonObj));
  }

  arrayToSingleQuotedJsonString(array: any[], defaultValue = '') {
    if (this.hasNoElements(array)) { return defaultValue; }
    else {
      return this.toSingleQuotedJsonString(JSON.stringify(array));
    }
  }

  toSingleQuotedJsonString(stringified: string, defaultValue = '') {
    if (this.isStringNullOrEmpty(stringified)) {
      return defaultValue;
    } else {
      stringified = stringified.replace(/\\"/g, '"')
        .replace(/([\{|:|,])(?:[\s]*)(")/g, "$1'")
        .replace(/(?:[\s]*)(?:")([\}|,|:])/g, "'$1")
        .replace(/([^\{|:|,])(?:')([^\}|,|:])/g, "$1\\'$2");
      return stringified;
    }
  }


  formatPrice(value: any): string {
    return '$' + (value > 0 ? value : '0.00');
  }

  formatPercent(value: any): string {
    return (value > 0 ? value : '0') + ' %';
  }


  subtractDays = (_value: number): Date => {
    var d = new Date(); // today!
    d.setDate(d.getDate() - _value);
    return d;
  }

  getPreviousDates = (_value: number): Date[] => {
    const dates = [...Array(_value)].map((_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - i)
      return d
    });

    // ---
    return dates;
  }

  getDatesBetween = (startDate, endDate): Date[] => {
    const currentDate = new Date(startDate.getTime());
    const dates = [];
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  }

  //---
}
