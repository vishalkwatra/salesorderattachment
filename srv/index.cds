using {SalesOrdersService as my} from './salesorders-service';

annotate my.SalesOrders with @odata.draft.enabled;

annotate my.SalesOrders with @(UI : {
    SelectionFields  : [
        SoldToParty,
        SalesDocumentType,
        ShipToParty
    ],
    LineItem         : [
        {
            Value : ID,
            Label : 'ID'
        },
        {
            Value : SalesDocumentType,
            Label : 'Sales Document Type'
        },
        {
            Value : SoldToParty,
            Label : 'SoldTo Party'
        },
        {
            Value : ShipToParty,
            Label : 'ShipTo Party'
        },
        {
            Value : Price,
            Label : 'Order Price'
        },
        {
            Value : Currency.code,
            Label : 'Currency'
        }
    ],
    HeaderInfo       : {
        TypeName       : 'SalesOrder',
        TypeNamePlural : 'SalesOrders',
        Title          : {
            Label : 'Order number ', //A label is possible but it is not considered on the ObjectPage yet
            Value : ID
        },
        Description    : {Value : createdBy}
    },
    Facets           : [{
        $Type  : 'UI.CollectionFacet',
        ID     : 'General',
        Label  : 'Sales Order Info',
        Facets : [{
            $Type  : 'UI.ReferenceFacet',
            Target : '@UI.FieldGroup#Main',
            Label  : 'Main Facet'
        }]
    }],
    FieldGroup #Main : {Data : [
        {Value : SalesDocumentType},
        {Value : ShipToParty},
        {Value : Price},
        {Value : Currency.code},
    ]}
});
