import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EnvironmentService } from './environment.service';

/**
 * @author Pradeep. R
 * @email prajendr@cswg.com
 * @createdOn 20/Dec/2022
 * @version 0.1
*/
@Injectable({ providedIn: 'root' })
export class ImageService {

  constructor(
    private readonly environmentSrvc: EnvironmentService
  ) { }

  readonly imageURL = environment.imageURL;
  readonly mainSearchIcon: string = this.imageURL + 'main-search.png';
  readonly exportIcon: string = this.imageURL + 'export.png';
  readonly filterIcon: string = this.imageURL + 'sliders.png';

  readonly pdfIcon: string = this.imageURL + 'pdf.png';
  readonly pngIcon: string = this.imageURL + 'png-format.png';
  readonly excelIcon: string = this.imageURL + 'excel.png';
  readonly csvIcon: string = this.imageURL + 'csv.png';
  readonly psvIcon: string = this.imageURL + 'csv.png';
  readonly txtIcon: string = this.imageURL + 'txt.png';
  readonly zipIcon: string = this.imageURL + 'zip.png';

  readonly cancelIcon: string = this.imageURL + 'cancel.png';

  //"grid-active.png" : imageURL + "grid-not-active.png"
  readonly gridActiveIcon: string = this.imageURL + 'grid-active.png';
  readonly gridNotActiveIcon: string = this.imageURL + 'grid-not-active.png';

  readonly tileActiveIcon: string = this.imageURL + 'cards-active.png';
  readonly tileNotActiveIcon: string = this.imageURL + 'cards-not-active.png';

  readonly maximizeIcon: string = this.imageURL + 'maximize.png';
  readonly notFoundImage: string = this.imageURL + 'imageNotFound.JPG';

  readonly expandIcon: string = this.imageURL + 'arrow-down.png';
  readonly collapseIcon: string = this.imageURL + 'arrow-up.png';

  readonly truckIcon: string = this.imageURL + 'truck.png';
  readonly calendarIcon: string = this.imageURL + 'calendar.png';

  readonly confirmationIcon: string = this.imageURL + 'confirmation.png';
  readonly failureIcon: string = this.imageURL + 'fail.png';

  //---
}