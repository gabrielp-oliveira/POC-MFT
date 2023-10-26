import { Component, OnInit } from '@angular/core';

import { ImageService } from 'src/app/shared/services/image.service';
import { PageConfigService } from './page-config.service';
import { AppStoreService } from 'src/app/shared/stores/app-store.service';


@Component({
  selector: 'app-page-config',
  templateUrl: './page-config.component.html',
  styleUrls: ['./page-config.component.scss']
})
export class PageConfigComponent implements OnInit {

  exportIcon = this.imgSrvc.exportIcon;
  rowsPerPage: string = this.appStoreSrvc.ROWS_PER_PAGE+''; //Dropdown breaks if these values aren't strings
  rowsPerPageOptions = [
    { count: '20' },
    { count: '50' },
    { count: '100' },
    { count: '200' },
    { count: '300' },
    { count: '400' }
  ];

  constructor(
    private readonly imgSrvc: ImageService,
    private readonly appStoreSrvc: AppStoreService,
    private readonly pageConfigSrvc: PageConfigService
  ) { }

  ngOnInit(): void {
  }

  onPageSizeChanged($event: number) {
    this.appStoreSrvc.selectedRowsPerPage.setValue(+$event)
  }


  //---
}