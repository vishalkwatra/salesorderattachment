namespace my.salesorder;

using {
    managed,
    cuid,
    Currency
} from '@sap/cds/common';

entity SalesOrders : managed, cuid {
    SalesDocumentType : String        @Common.Label : 'SalesDocument Type';
    SoldToParty       : String        @(Common.Label : 'SoldTo Party');
    ShipToParty       : String        @(Common.Label : 'ShipTo Party');
    ReferenceDocument : String        @(Common.Label : 'Reference Document');
    Price             : Decimal(9, 2) @(Common.Label : 'Order Price');
    Currency          : Currency      @(Common.Label : 'Currency');
    repositoryId      : String;
    folderId          : String;
}