export interface ISearchReportsResponse {
  content: IContent[];
  pageable: IPageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: ISort;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface IContent {
  reportName: string;
  fileTypes: string[];
  storeNbr: string;
  storeName: string;
  storeGroupName: string;
  storeGroupNbr: string;
  description: string;
  reportId: string;
  isGlobal: boolean;
  mobiusFileName: string[];
  reportCreatedDate: string;
  asciiCode: string;
  invoiceNumber: string;
  formattedText?: string;
}

export interface IPageable {
  sort: ISort;
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
}

export interface ISort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}


