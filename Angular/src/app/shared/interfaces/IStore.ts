/**
 * @author Pradeep. R
 * @email prajendr@cswg.com
 * @createdOn 11/Jul/2023
 * @version 0.1
*/
export interface IStoreResponse {
  userId: string;
  defaultStore: number;
  storeList: IStore[];
}

/**
 * @author Pradeep. R
 * @email prajendr@cswg.com
 * @createdOn 11/Jul/2023
 * @version 0.1
*/
export interface IStore {
  id: number;
  storeCountry: string;
  storeName: string;
  storeAddress1: string;
  storeAddress2: any;
  salesRepresentative: any;
  storeNbr: number;
  customerNbr: string;
  storeStatus: string;
  custPortalStatus: string;
  chainName: string;
  chainNbr: number;
  storeCity: string;
  storePostalCode: string;
  primaryContactName: any;
  primaryContactPhoneNbr?: string;
  storeState?: string;
  hqFlag: any;
  hqStoreNbr: string;
  delegateAuthFlag: string;
  parentId: number;
  orgName: string;
  updatedOn: string;
  updatedBy: string;
  storeGroupName: string;
  tenantCode: string;
  gsBillToStoreNbr: string;
  billToStoreName: string;
  formattedText?: string;
}