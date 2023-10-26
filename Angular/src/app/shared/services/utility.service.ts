import { Injectable } from '@angular/core';

/**
 * @author Pradeep. R
 * @email prajendr@cswg.com
 * @createdOn 09/Dec/2022
 * @version 0.1
*/
@Injectable({ providedIn: 'root' })
export class UtilityService {

  constructor() { }

  /**
   * bind it in the input control:
   * -> <input (keypress)="utilityService.allowNumbersOnly($event)" onpaste="return false;" ondrop="return false;" .../>
   */
  allowNumbersOnly(e) {
    var event = e || window.event;

    // Handle paste
    if (event.type === 'paste') {
      key = e.clipboardData.getData('text/plain');
    } else {
      // Handle key press
      var key = event.keyCode || event.which;
      key = String.fromCharCode(key);
    }
    var regex = /[0-9]|\./;
    if (!regex.test(key)) {
      event.returnValue = false;
      if (event.preventDefault) event.preventDefault();
    }
  }

}
