import { ICompanyCode } from "./ICompanyCode";
import { IReport } from "./IReport";
import { IContent } from "./ISearchReportsResponse";
import { IStore } from "./IStore";

/**
 * @author Pradeep. R
 * @email prajendr@cswg.com
 * @createdOn 10/Jul/2023
 * @version 0.1
*/
export interface IDataSources {
  parentStore: IStore;
  stores: IStore[];
  companyCodes: ICompanyCode[];
  reports: IReport[];
  resultSet: IContent[];
}