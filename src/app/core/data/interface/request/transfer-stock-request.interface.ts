export interface TransferStockRequestInterface {
    issuerUsername: string;
    receptorUsername: string;
    ticker: string;
    name: string;
    quantity: number;
    amount: number;
}
