import { CUSTOM_ELEMENTS_SCHEMA, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { createCustomElement } from '@angular/elements';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxPaginationModule } from 'ngx-pagination';
import { TooltipModule } from 'ng2-tooltip-directive';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


import { AgGridModule } from '@ag-grid-community/angular';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';

import { environment } from 'src/environments/environment';
import { LoadScriptDirective } from './shared/directives/scriptload.directive';
import { LoadStyleDirective } from './shared/directives/styleload.directive';

import { TokenInterceptor } from './shared/interceptors/token.interceptor';
import { ErrorHandlerService } from './shared/services/error-handler.service';
import { AppService } from './shared/services/app.service';


import { AppComponent } from './app.component';
import { StoreReportsComponent } from './store-reports/store-reports.component';
import { HeaderComponent } from './store-reports/components/header/header.component';
import { SearchInputComponent } from './store-reports/components/header/components/search-input/search-input.component';
import { PageConfigComponent } from './store-reports/components/header/components/page-config/page-config.component';
import { FiltersComponent } from './store-reports/components/filters/filters.component';
import { GridViewComponent } from './store-reports/components/grid-view/grid-view.component';
import { StoreFilterComponent } from './store-reports/components/filters/components/store-filter/store-filter.component';
import { DownloadIconsCellRendererComponent } from './store-reports/components/grid-view/cell-renderers/download-icons-cell-renderer/download-icons-cell-renderer.component';
import { CompanyCodeFilterComponent } from './store-reports/components/filters/components/company-code-filter/company-code-filter.component';
import { ReportNameFilterComponent } from './store-reports/components/filters/components/report-name-filter/report-name-filter.component';
import { DateRangeFilterComponent } from './store-reports/components/filters/components/date-range-filter/date-range-filter.component';
import { FileUploadComponent } from './store-reports/components/header/components/file-upload/file-input.component';
import { DropzoneDirective } from './shared/directives/dropzone.directive';
import { TooltipDirective } from './shared/directives/tooltip.directive';


@NgModule({
  declarations: [
    AppComponent,
    FileUploadComponent,
    LoadScriptDirective,
    LoadStyleDirective,
    StoreReportsComponent,
    HeaderComponent,
    SearchInputComponent,
    PageConfigComponent,
    FiltersComponent,
    GridViewComponent,
    StoreFilterComponent,
    DownloadIconsCellRendererComponent,
    CompanyCodeFilterComponent,
    ReportNameFilterComponent,
    DateRangeFilterComponent,
    TooltipDirective,
    DropzoneDirective

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    HttpClientModule,
    AgGridModule,
    ToastrModule.forRoot(),
    NgxSpinnerModule,
    NgxPaginationModule,
    TooltipModule,

    AutocompleteLibModule,
    MatExpansionModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatTooltipModule,
    DropdownModule,
    CalendarModule,
    DialogModule,
    MultiSelectModule

    // AgGridModule.withComponents([TooltipCellRendererComponent])
  ],
  bootstrap: environment.production ? [] : [AppComponent],
  providers: [
    ErrorHandlerService,
    AppService,
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  entryComponents: [
    AppComponent,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class AppModule {

  constructor(private injector: Injector) { }

  ngDoBootstrap(): void {
    const _customElements = createCustomElement(AppComponent, { injector: this.injector });
    if (!customElements.get('storereports-element')) {
      customElements.define('storereports-element', _customElements);
    }

  }
}