import { ICompanyCode } from "./ICompanyCode";
import { IReport } from "./IReport";
import { IStore } from "./IStore";

/**
 * @author Pradeep. R
 * @email prajendr@cswg.com
 * @createdOn 10/Jul/2023
 * @version 0.1
*/
export interface ICurrentFilter {
  isValid: boolean;
  filterData: IFilterData;
}

/**
 * @author Pradeep. R
 * @email prajendr@cswg.com
 * @createdOn 10/Jul/2023
 * @version 0.1
*/
export interface IFilterData {
  selectedRowsPerPage: number;
  selectedPageNumber: number;
  selectedSearchValue: string;
  selectedStores: IStore[];
  selectedCompanyCodes: ICompanyCode[];
  selectedReports: IReport[];
}