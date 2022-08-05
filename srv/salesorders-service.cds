using my.salesorder as my from '../db/data-model';

service SalesOrdersService{
    @odata.draft.enabled
    entity SalesOrders as projection on my.SalesOrders;
}