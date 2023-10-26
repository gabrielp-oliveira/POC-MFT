import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { ICellRendererParams } from '@ag-grid-community/all-modules';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';

import { TFileType } from 'src/app/shared/types/TFileType';
import { ImageService } from 'src/app/shared/services/image.service';
import { EnvironmentService } from 'src/app/shared/services/environment.service';
import { DateTimeService } from 'src/app/shared/services/date-time.service';

@Component({
  selector: 'app-download-icons-cell-renderer',
  templateUrl: './download-icons-cell-renderer.component.html',
  styleUrls: ['./download-icons-cell-renderer.component.scss']
})
export class DownloadIconsCellRendererComponent implements ICellRendererAngularComp {

  params: ICellRendererParams;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly environmentSrvc: EnvironmentService,
    private readonly imgSrvc: ImageService,
    private readonly spinnerSrvc: NgxSpinnerService,
    private readonly toastSrvc: ToastrService,
    private format: DateTimeService
  ) { }

  pdfIcon: string = null;
  xlsIcon: string = null;
  csvIcon: string = null;
  pipeIcon: string = null;
  txtIcon: string = null;
  zipIcon: string = null;
  reportNameToDownload: string = null;
  excelMode: TFileType = 'XLS';

  agInit(params: ICellRendererParams): void {
    this.params = params;
    // file-types
    const format = params?.data?.format
    const fileTypes = (params?.data?.fileName.toUpperCase())
    this.pdfIcon = format == ('PDF') ? this.imgSrvc.pdfIcon : null;
    this.xlsIcon = format == ('XLS') || format == ('XLSX')|| format == ('LSX')  ? this.imgSrvc.excelIcon : null;
    this.csvIcon = format == ('CSV') ? this.imgSrvc.csvIcon : null;
    this.pipeIcon = format == ('PSV') || format == ('PIPE') ? this.imgSrvc.psvIcon : null;
    this.txtIcon = format == ('TXT') ? this.imgSrvc.txtIcon : null;
    this.zipIcon = format == ('ZIP') ? this.imgSrvc.zipIcon : null;
    this.zipIcon = format == ('PNG') ? this.imgSrvc.pngIcon : null;

    
    // report-name
    this.reportNameToDownload = this.params?.data?.fileName;
    
    this.excelMode = (fileTypes?.includes('XLS') || fileTypes?.includes('XLSX')) ?? 'XLSX'; //Can only use one of XLS or XLSX per report/bulletin
  }

  refresh(params: any): boolean {
    return false;
  }

  onDownloadPDF() { this.initiateDownload('PDF'); }
  onDownloadXLS() { this.initiateDownload(this.excelMode); }
  onDownloadCSV() { this.initiateDownload('CSV'); }
  onDownloadPIPE() { this.initiateDownload('PSV'); }
  onDownloadTXT() { this.initiateDownload('TXT'); }
  onDownloadZIP() { this.initiateDownload('ZIP'); }

  initiateDownload(_fileType: TFileType) {
    const reportNameIndex = this.params.data['fileTypes'].indexOf(_fileType);
    const reportName = this.params.data['mobiusFileName'][reportNameIndex];
    const _ext = _fileType.toLowerCase();
    const reportDate = this.format.formatDateYYYYMMDD(this.params.data['reportCreatedDate']);
    const fileName = `${this.params.data['reportName']}_${reportDate}`;

    this.spinnerSrvc.show();
    this.httpClient.post(this.getUrl(),
      {
        reportId: this.reportNameToDownload,
        fileType: _fileType,
        reportName: reportName,
        reportDate: reportDate
      },
      {
        responseType: "blob",
        headers: { 'Accept': this.getMimeType(_fileType) }
      }
    ).subscribe(
      (blob) => {
        saveAs(blob, `${fileName}.${_ext}`);
        this.spinnerSrvc.hide();
        this.toastSrvc.success('File downloaded.');
      },
      (error) => {
        this.spinnerSrvc.hide();
        this.toastSrvc.error('Error downloading the file.');
        console.log('error downloading the file', error);
      });
  }

  private getUrl(): string {
    let url = this.environmentSrvc.getHttpUrl('downloadFile');
    return url;
  }

  getMimeType(_fileType: TFileType) {
    const obj = {};
    obj['PDF'] = 'application/pdf';
    obj['XLS'] = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    obj['XLSX'] = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    obj['CSV'] = 'application/csv';
    obj['PSV'] = 'application/text';
    obj['TXT'] = 'application/text';
    obj['ZIP'] = 'application/zip';

    return obj[_fileType];
  }

  //---
}