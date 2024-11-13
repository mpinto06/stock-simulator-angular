import { StockEODResponseInterface } from "./response/stock-eod-response.interface";

export interface StockInterface { 
    ticker: string;
    description: string;
    name: string;
    stockEODList: StockEODResponseInterface[];
}
