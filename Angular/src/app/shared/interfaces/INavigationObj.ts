/**
 * @author Pradeep. R
 * @email prajendr@cswg.com
 * @createdOn 16/Dec/2022
 * @version 0.1
*/
export interface INavigationObj {
  storeInfo: IStoreInfo;
  bearerToken: string;
  userInfo: IUserInfo;
  widgetMap: IWidgetMap;
  cmsData: ICMSData[];
  gridKey: string;
  tenantCode: string;
}


/**
 * @author Pradeep. R
 * @email prajendr@cswg.com
 * @createdOn 16/Dec/2022
 * @version 0.1
*/
export interface IStoreInfo {
  selectedStore: string;
  defaultStore: IDefaultStore;
  storeObj: IStoreObj;
}

/**
 * @author Pradeep. R
 * @email prajendr@cswg.com
 * @createdOn 16/Dec/2022
 * @version 0.1
*/
export interface IWidgetMap {
  widgetList: number[];
}

/**
 * @author Pradeep. R
 * @email prajendr@cswg.com
 * @createdOn 16/Dec/2022
 * @version 0.1
*/
export interface ICMSData {
  id: number;
  componentId: string;
  elementId: number;
}

/**
 * @author Pradeep. R
 * @email prajendr@cswg.com
 * @createdOn 16/Dec/2022
 * @version 0.1
*/
export interface IStoreObj {
  storeNbr: number;
  storeName: string;
  storeCombo: string;
  storePhone: string;
  storeAddress: string;
  customerNbr: string;
  cpStoreStatus: string;
  chainNbr: number;
  chainName: string;
  storeNbrTrim: string;
}

/**
 * @author Pradeep. R
 * @email prajendr@cswg.com
 * @createdOn 16/Dec/2022
 * @version 0.1
*/
export interface IUserInfo {
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  userId: string;
  userType: string
}

/**
 * @author Pradeep. R
 * @email prajendr@cswg.com
 * @createdOn 16/Dec/2022
 * @version 0.1
*/
export interface IDefaultStore {
  id: number;
  storeCountry: string;
  storeName: string;
  storeAddress1: string;
  storeAddress2: string;
  salesRepresentative: string;
  storeNbr: number;
  customerNbr: string;
  storeStatus: string;
  custPortalStatus: string;
  chainName: string;
  chainNbr: number;
  storeCity: string;
  storePostalCode: string;
  primaryContactName: string;
  primaryContactPhoneNbr: string;
  storeState: string;
  hqFlag: string;
  hqStoreNbr: string;
  delegateAuthFlag: string;
  level: number;
  parentId: number;
  orgName: string;
  updatedOn: string;
  updatedBy: string;
  storeNum: number
}