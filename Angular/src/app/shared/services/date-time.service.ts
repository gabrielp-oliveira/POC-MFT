import { Injectable } from '@angular/core';

/**
 * @author Pradeep. R
 * @email prajendr@cswg.com
 * @createdOn 09/Dec/2022
 * @version 0.1
*/
@Injectable({ providedIn: 'root' })
export class DateTimeService {

  constructor() { }

  getUTC(): string {
    return (new Date(Date.now())).toUTCString();
  }

  getDisplayString(dateString: string) {
    return dateString?.substring(5, 10) || '';
  }

  /** @param dateString "2021-09-13" */
  getDateFromFormattedString(dateString: string): Date {
    const splittedDate = dateString.split('-');
    const newDateString = splittedDate[1] + '-' + splittedDate[2] + '-' + splittedDate[0];
    let formatted = this.getFullDateIfShortString(newDateString);

    return new Date(formatted);
  }

  formatDate(currentDate): string {
    let formatted = this.getFullDateIfShortString(currentDate);

    const d = new Date(formatted);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    return [month, day, year].join('/');
  }


  // 2022-02-18 to 02/18/2022
  formatSavedItemDate(currentDate: string): string {

    const d = currentDate;;
    let year = d.substring(0, 4);
    let month = d.substring(5, 7);
    let day = d.substring(8, 10);
    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    return [month, day, year].join('/');
  }


  /* This method for format date
   @Input  {date} - date
   @output ->fromated date*/

  formatDateToUTC(date: string) {

    const year = date.substring(0, 4);
    const month = date.substring(5, 7);
    const day = date.substring(8, 10);
    const formatedDate = month + '/' + day + '/' + year;

    return formatedDate;

  }


  formatDatefromUTC(date: string) {

    const year = date.substring(0, 4);
    const month = date.substring(5, 7);
    const day = date.substring(8, 10);
    const formatedDate = year + '-' + month + '-' + day;

    return formatedDate;

  }


  formatDateToApi(currentDate): string {
    let formatted = this.getFullDateIfShortString(currentDate);
    const d = new Date(formatted);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    return [day, month, year].join('-');
  }

  getFullDateIfShortString(_value: any) {
    if ((typeof _value === 'string' || _value instanceof String)
      && _value.length === 10 // 2023-05-16  
      && _value.split('-')[0].length === 4 // 2023-05-16 (not 16-05-2023)
      && !_value.includes('T')
    ) {
      return _value + 'T00:00:00';
    }
    return _value;
  }

  formatDateForRDD(currentDate): string {
    if (currentDate) {
      let formatted = this.getFullDateIfShortString(currentDate);

      const d = new Date(formatted);
      let month = '' + (d.getMonth() + 1);
      let day = '' + d.getDate();
      const year = d.getFullYear();
      if (month.length < 2) {
        month = '0' + month;
      }
      if (day.length < 2) {
        day = '0' + day;
      }
      return [year, month, day].join('-');
    } else {
      return null;
    }
  }


  formatDateForCSOR(dateVal): string {

    let formatted = this.getFullDateIfShortString(dateVal);

    const d = new Date(formatted);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    return [month, day].join('');

  }




  formatUTCDate(currentDate): string {
    let formatted = this.getFullDateIfShortString(currentDate);

    const d = new Date(formatted).toISOString().slice(0, 10);
    let year = d.substring(0, 4);
    let month = d.substring(5, 7);
    let day = d.substring(8, 10);
    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    return [month, day, year].join('/');
  }


  isLesserThanToday(targetDate: Date): boolean {
    if (targetDate) {
      const todayDate = new Date();
      // strip the time
      targetDate.setHours(0, 0, 0, 0);
      todayDate.setHours(0, 0, 0, 0);
      // return
      return targetDate < todayDate;
    }
    return false;
  }

  formatDateYYYYMMDD(date): any {
    let formattedDate = date.replace(/-/g, '');
    return formattedDate;
  }



  //---
}