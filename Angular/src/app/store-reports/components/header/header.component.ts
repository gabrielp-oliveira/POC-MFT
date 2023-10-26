import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppStoreService } from 'src/app/shared/stores/app-store.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HeaderService } from './header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {

  pdfURL: string = null;
  pdfTarget: string = '_blank';
  helpImg: string = '';
  pageId: string = '';
  pageIdMsg: string = '';
  showPageIdMsg: boolean = false;
  
  displayPageId(){
    this.showPageIdMsg = !this.showPageIdMsg;
    this.pageIdMsg = `Page ID: ${this.pageId}`;
  }

  constructor(
    private http: HttpClient,
    private appStore: AppStoreService,
    private headerSrvc: HeaderService,
  ) { }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.helpImg = environment.imageURL + 'help-circle.png';
    this.http.get(environment.wsPath).subscribe((res: any) => {
      this.headerSrvc.setProperties(res);
      this.pageId = (this.appStore?.navigationObj?.value?.tenantCode === '2022-CS-PRTL') ?  res['pageId'] : res['gsPageId'];
      this.getHelpDocUrl();
    });
  }

  async getHelpDocUrl(){
    const wsBody = this.getHelpDocWsBody(environment.wsBody);
   
    this.headerSrvc.getContentDetails(wsBody).subscribe(
      (resp) => {
        const helpPDFs = resp?.resultSet?.items;
        const item = helpPDFs.find(item => this.pageId === item.fields.pageId);
        //console.log(helpPDFs, item);
        if(item != null){
          this.pdfURL = item.fields?.pdfAttachment?.url;
          this.pdfTarget = "_blank";
        } else {
          //TODO
        }
      }, (error) => {
        //TODO
      });
  }
  
  getHelpDocWsBody(wsBody) {
    const navObj = this.appStore.navigationObj.value;
    if (navObj != undefined && navObj?.userInfo?.userName != undefined) {
      navObj.cmsData.map(item => {
        if ((navObj.tenantCode === '2022-CS-PRTL' && item.id === 15) ||
            (navObj.tenantCode === '2023-GS-PRTL' && item.id === 19)) {
          wsBody.userName = navObj?.userInfo?.userName;
          wsBody.componentID = undefined;
          wsBody.referenceName = item.componentId;
          wsBody.elementId = item.elementId;
        }
      });
    }
    else {
      wsBody.userName = 'superadmin1';
      wsBody.referenceName = navObj.tenantCode === '2022-CS-PRTL' ? 'CPHelpPages' : 'GrocersHelpPages';
      wsBody.componentID = undefined;
    }
    return wsBody;
  }

}