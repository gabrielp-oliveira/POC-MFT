import { Component, OnInit } from '@angular/core';

import { ImageService } from 'src/app/shared/services/image.service';
import { AppStoreService } from 'src/app/shared/stores/app-store.service';


@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements OnInit {

  searchValue: string = '';
  searchIcon: string = this.imgSrvc.mainSearchIcon;

  constructor(
    private readonly imgSrvc: ImageService,
    private readonly appStoreSrvc: AppStoreService,
  ) {

  }

  ngOnInit(): void {
  }

  performSearch() {
    this.appStoreSrvc.selectedSearchTerm.setValue(this.searchValue);
  }


  //---
}
