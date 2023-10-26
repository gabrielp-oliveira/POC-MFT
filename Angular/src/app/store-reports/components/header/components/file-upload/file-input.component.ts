import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { IStore } from 'src/app/shared/interfaces/IStore';
import { AppStoreService } from 'src/app/shared/stores/app-store.service';
import { MftService } from 'src/app/store-reports/mft.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})

export class FileUploadComponent implements OnInit {
  constructor(
    private readonly appStoreSrvc: AppStoreService,
    private mftSrvc: MftService

  ) {}
  @ViewChild('fileUpload') fileUpload: ElementRef<HTMLInputElement> | any;
  @ViewChild('fileUploadText') fileUploadText: ElementRef<HTMLInputElement> | any;
  filesList: any = [];
  dummy:any = [];
  formatAllowList: string[] = ["PDF", "XLS", "CSV","PSV","ZIP","PIPE","XLSX", "PNG", "LSX"]
  selectedStore: IStore;
  dataSource: IStore[] = null;
  errorStatus:any = {
    file:false,
    store:false,
    format: false
  }


  onStoresDataSource$: Subscription;
  ngOnInit(): void {
    const length = this.dummy.length;

    for (let i = 0; i < length; i++) {
      this.filesList.push(this.dummy[i]);
    }

    this.onStoresDataSource$ = this.appStoreSrvc.stores.onChange()
    .subscribe((_value) => this.dataSource = _value );
  }


  openModal(){
    this.errorStatus = {
      file:true,
      store:true,
      format: false
    }
    this.filesList = []
    this.selectedStore = null
  }
  async confirmFile(){
    console.log(this.filesList)
    console.log(this.selectedStore)
    this.mftSrvc.uploadFiles(this.selectedStore, this.filesList)
    .subscribe((resp) => {
      console.log(resp)
    })
    // this.fileUploadText.nativeElement.files = {}
  }
  selectStore(){
    console.log(this.selectedStore)
    if(this.selectedStore !== undefined) {
      this.errorStatus.store = false
    }else{
      this.errorStatus.store = true
    }
  }

  deleteFile(i: any){
    this.filesList.splice(i, 1)
    const isFileWithError = this.filesList.find((f:any) => f.isInvalid == true)
    if(isFileWithError  == undefined) {
      this.errorStatus.format = false
    }else{
      this.errorStatus.format = true
    }
  }
  dragFile(files: any) {
    const length = files.length;

    for (let i = 0; i < length; i++) {

      const fileToBeUploadedFormat = files[i].name.substr(files[i].name.length - 3).toUpperCase();
      const result = this.formatAllowList.findIndex((fAllow) =>fAllow == fileToBeUploadedFormat)
      if(result == -1){
        files[i].isInvalid = true
        this.errorStatus.format = true
      }
      if(this.filesList.find((f:any) => f.name == files[i].name)) {
      }else{
        this.filesList.push(files[i]);
        this.errorStatus.file = false

      }
      this.filesList.find((f:any) => !f.isInvalid ? this.errorStatus.format = false : this.errorStatus.format = true)
    }

  }

  uploadFiles(e: any) {
    this.dragFile(this.fileUploadText.nativeElement.files)
  }
  uploadFile(){

  }
}
