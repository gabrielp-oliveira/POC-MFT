/**
 * @author Pradeep. R
 * @email prajendr@cswg.com
 * @createdOn 12/Jul/2023
 * @version 0.1
*/
export interface ISearchReportsPayload {
  search: string;
  storeNbrs: string[],
  companyCodes: string[],
  reportNames: string[],
  reportType: string
  page: number;
  size: number;
  startDate: string;
  endDate: string;
}