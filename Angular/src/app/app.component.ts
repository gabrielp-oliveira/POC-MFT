import {
    Component, Input, SimpleChanges, OnChanges,
    OnInit, Output, EventEmitter, OnDestroy
} from '@angular/core';
import { take } from 'rxjs/operators';

import { AppService } from './shared/services/app.service';
import { EnvironmentService } from './shared/services/environment.service';
import { SubscriptionHandlerService } from './shared/services/subscription-handler.service';
import { AppStoreService } from './shared/stores/app-store.service';
import { Subscription } from 'rxjs';


/**
 * @author Pradeep. R
 * @email prajendr@cswg.com
 * @createdOn 09/Dec/2022
 * @version 0.1
*/
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, OnChanges {

    constructor(
        private readonly appSrvc: AppService,
        private readonly environmentSrvc: EnvironmentService,
        private readonly subscriptionSrvc: SubscriptionHandlerService,
        private readonly appStoreSrvc: AppStoreService,
    ) { }

    @Input() navigationObj: any;
    @Input() adParam: any;
    @Input() adReportObj: any;
    @Output() selectedItem = new EventEmitter();

    appInitialized: boolean = false;
    appStoreObserver$: Subscription = null;

    ngOnDestroy(): void {
        console.log('StoreReports -> ngOnDestroy');
    }

    ngOnInit() {
        console.log('STORE-REPORTS-CHECK-v5');

        if (this.appStoreObserver$) { this.appStoreObserver$.unsubscribe(); }
        this.appStoreObserver$ = this.appStoreSrvc.onChange().subscribe((_value) => {
            //console.log('APP-STORE', this.appStoreSrvc.getCurrentValues());
        });
        this.init();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.init();
    }

    init() {
        this.subscriptionSrvc.clearAll();
        this.appStoreSrvc.reset();

        if (this.environmentSrvc.isNotProdEnv) {
            this.navigationObj = {
                "storeInfo": {
                    "selectedStore": "5327",
                    "defaultStore": {
                        "id": 5,
                        "storeCountry": "US",
                        "storeName": "SELLERS BROS. #22",
                        "storeAddress1": "2311 STRAWBERRY RD",
                        "storeAddress2": null,
                        "salesRepresentative": null,
                        "storeNbr": 15327010,
                        "customerNbr": "5327",
                        "storeStatus": "Active",
                        "custPortalStatus": "active",
                        "chainName": "GS SELLERS",
                        "chainNbr": 106,
                        "storeCity": "PASADENA",
                        "storePostalCode": "77502",
                        "primaryContactName": "CLAUDIA NINO",
                        "primaryContactPhoneNbr": "713-944-1150",
                        "storeState": "TX",
                        "hqFlag": "0",
                        "hqStoreNbr": "106",
                        "delegateAuthFlag": "N",
                        "parentId": 10088,
                        "orgName": "EA SELLERS",
                        "updatedOn": "2023-08-30T13:29:41.095+00:00",
                        "updatedBy": "gabriel",
                        "storeGroupName": "EA SELLERS",
                        "tenantCode": "2023-GS-PRTL",
                        "gsBillToStoreNbr": "5327",
                        "billToStoreName": "SELLERS BROS. #22",
                        "storeNum": 15327010
                    },
                    "storeObj": {
                        "storeNbr": 15327010,
                        "storeName": "SELLERS BROS. #22",
                        "storeCombo": "15327010 - SELLERS BROS. #22 - 5327",
                        "storePhone": "713-944-1150",
                        "storeAddress": "2311 STRAWBERRY RD,   PASADENA,  TX",
                        "customerNbr": "5327",
                        "cpStoreStatus": "active",
                        "chainNbr": 106,
                        "chainName": "GS SELLERS",
                        "storeNbrTrim": "5327",
                        "storeAddress1": "2311 STRAWBERRY RD",
                        "storeAddress2": null,
                        "storeCity": "PASADENA",
                        "storeState": "TX",
                        "storeZipCode": "77502",
                        "storeCountry": "US",
                        "storePhoneNbr": "713-944-1150"
                    }
                },
                "bearerToken": "eyJ4NXQiOiJORFV6Wm1FME9XSmhaalZtT0RKaU1EQmxaVFEwWTJNNU1XRTBNalF3T1RBellUUm1aRFkxT0EiLCJraWQiOiJPV1ZrTTJabE9UUXhOV0V5WWpBeE16STNNVFZpTWpneU9HTTBORE13TlRGallUSm1NekF6TURJMk1qVTBabU5tTXpKaE5XVmlaRGszWVdSalkyVXlaUV9SUzI1NiIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJnYWJyaWVsIiwiYXV0IjoiQVBQTElDQVRJT05fVVNFUiIsImF1ZCI6ImVhOFpWaHlSQmRVQ2ZYcGhLWlQybWNNX0tYUWEiLCJiaW5kaW5nX3R5cGUiOiJzc28tc2Vzc2lvbiIsIm5iZiI6MTY5ODIzOTA3MSwiYXpwIjoiZWE4WlZoeVJCZFVDZlhwaEtaVDJtY01fS1hRYSIsInNjb3BlIjoiR1NfQ1VTVE9NRVJfQUNDRVNTIG9wZW5pZCIsImlzcyI6Imh0dHBzOlwvXC9xYWNzaWRzLmNzd2cuY29tXC9vYXV0aDJcL3Rva2VuIiwiZXhwIjoxNjk4MjY3ODcxLCJpYXQiOjE2OTgyMzkwNzEsImJpbmRpbmdfcmVmIjoiYWY5MDE2N2FjZDRhNThkZmQ4MmIyODhhMDcyMTNiM2MiLCJqdGkiOiJlZjI3MzMxOS00YmUwLTQ2OWEtYjJkOC1iZTI5ZGM2YTZhM2EifQ.bjzuLi7d0sO8kdKeNvq8mu-f6pn6zzgT73QvlN48LDksmkOamBonZShOxNQWLO0ajD6GrjwdBsnGPgoWEkZU2wYAIfuApRu0uGxb-SdJSs8sqyuDJrbsixcKYEZlE9QhANFUbIJd8PANd11eTnzszxQSdzYrXoicygGakIoPu3Qe0Luy0OtR6tV1z1G0OBAmRQVg0TxXDW4HvYpPI41mtFGu0zRmGAe91isZq4GLT8cTfhTxN6OiZ8bXV-iOw_gmoZQp2grxvNFmvmz_ACxECW9Nro-c3M_4TRX0hFRmFi5Jyz9BV6iiqSv1RIZ5LlP3vXk9V7lpTz5xFzOpEMynbA",
                "userInfo": {
                    "firstName": "Gabriel",
                    "lastName": "Oliveira",
                    "email": "goliveir1@cswg.com",
                    "userName": "gabriel",
                    "userId": "5b25d85b-be0b-4574-9ef7-32f1bcf5a877",
                    "userType": "internal"
                },
                "widgetMap": {
                    "widgetList": [
                        1044
                    ]
                },
                "cmsData": [
                    {
                        "id": 1,
                        "componentId": "Announcements",
                        "elementId": 730
                    },
                    {
                        "id": 2,
                        "componentId": "planogramlandingpage",
                        "elementId": 1043
                    },
                    {
                        "id": 3,
                        "componentId": "Bulletins",
                        "elementId": 136889
                    },
                    {
                        "id": 4,
                        "componentId": "CpRetailServices",
                        "elementId": null
                    },
                    {
                        "id": 5,
                        "componentId": "privatelabels",
                        "elementId": null
                    },
                    {
                        "id": 6,
                        "componentId": "Recalls",
                        "elementId": 1259
                    },
                    {
                        "id": 7,
                        "componentId": "privatebranddetails",
                        "elementId": null
                    },
                    {
                        "id": 8,
                        "componentId": "PBNavigationTitleLink",
                        "elementId": null
                    },
                    {
                        "id": 9,
                        "componentId": "PBOurBrands",
                        "elementId": null
                    },
                    {
                        "id": 10,
                        "componentId": "PBOurDisplayPrograms",
                        "elementId": null
                    },
                    {
                        "id": 11,
                        "componentId": "PBCardDetail",
                        "elementId": null
                    },
                    {
                        "id": 12,
                        "componentId": "CPDownload",
                        "elementId": null
                    },
                    {
                        "id": 13,
                        "componentId": "RSSignupForm",
                        "elementId": null
                    },
                    {
                        "id": 14,
                        "componentId": "SpecialPromotions",
                        "elementId": 136970
                    },
                    {
                        "id": 15,
                        "componentId": "CPHelpPages",
                        "elementId": null
                    },
                    {
                        "id": 16,
                        "componentId": "FoodshowPromotions",
                        "elementId": 136736
                    },
                    {
                        "id": 17,
                        "componentId": "GrocersSupplyAnnouncements",
                        "elementId": 137615
                    },
                    {
                        "id": 18,
                        "componentId": "GrocersSupplyBulletins",
                        "elementId": 137616
                    },
                    {
                        "id": 19,
                        "componentId": "GrocersHelpPages",
                        "elementId": null
                    },
                    {
                        "id": 20,
                        "componentId": "PBGrocersOurBrands",
                        "elementId": null
                    },
                    {
                        "id": 21,
                        "componentId": "PBGrocersHome",
                        "elementId": null
                    },
                    {
                        "id": 22,
                        "componentId": "GrocersRetailServices",
                        "elementId": null
                    }
                ],
                "gridKey": "VXNpbmdfdGhpc19BR19HcmlkX0VudGVycHJpc2Vfa2V5XyggQUctMDQ0NDE1IClfaW5fZXhjZXNzX29mX3RoZV9saWNlbmNlX2dyYW50ZWRfaXNfbm90X3Blcm1pdHRlZF9fX1BsZWFzZV9yZXBvcnRfbWlzdXNlX3RvXyggbGVnYWxAYWctZ3JpZC5jb20gKV9fX0Zvcl9oZWxwX3dpdGhfY2hhbmdpbmdfdGhpc19rZXlfcGxlYXNlX2NvbnRhY3RfKCBpbmZvQGFnLWdyaWQuY29tIClfX18oIEMmUyBXaG9sZXNhbGUgR3JvY2VycywgSW5jLiApX2lzX2dyYW50ZWRfYV8oIE11bHRpcGxlIEFwcGxpY2F0aW9ucyApX0RldmVsb3Blcl9MaWNlbnNlX2Zvcl8oIDcgKV9Gcm9udC1FbmRfSmF2YVNjcmlwdF9kZXZlbG9wZXJzX19fQWxsX0Zyb250LUVuZF9KYXZhU2NyaXB0X2RldmVsb3BlcnNfbmVlZF90b19iZV9saWNlbnNlZF9pbl9hZGRpdGlvbl90b190aGVfb25lc193b3JraW5nX3dpdGhfQUdfR3JpZF9FbnRlcnByaXNlX19fVGhpc19rZXlfaGFzX2JlZW5fZ3JhbnRlZF9hX0RlcGxveW1lbnRfTGljZW5zZV9BZGQtb25fZm9yXyggMiApX1Byb2R1Y3Rpb25fRW52aXJvbm1lbnRzX19fVGhpc19rZXlfd29ya3Nfd2l0aF9BR19HcmlkX0VudGVycHJpc2VfdmVyc2lvbnNfcmVsZWFzZWRfYmVmb3JlXyggOCBTZXB0ZW1iZXIgMjAyNCApX19fX1t2Ml1fTVRjeU5UYzFNREF3TURBd01BPT02YjE2MDMxZTcxMzFhOTkxOThlY2ZjZDM0MzA0NDllNA==",
                "tenantCode": "2023-GS-PRTL"
            };
        };

        //---
        if (this.navigationObj) {
            this.appSrvc.init({
                navigationObj: this.navigationObj,
            }).pipe(take(1)).subscribe(
                (success) => {
                    this.appInitialized = success;
                    console.log('APP-INITIALIZATION-SUCCESS');
                },
                (error) => {
                    console.log('APP-INITIALIZATION-ERROR', error);
                }
            );
        } else {
            console.log('APP-INITIALIZATION-ERROR', 'Empty NavigationObj received.!');
        }

    }


    //---
}