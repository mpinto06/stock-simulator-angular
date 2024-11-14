export interface TransactionResponseInterface {
    stockTicker: string;
    type: string;
    issuerUsername: string;
    receptorUsername: string | null;
    amount: number;
    quantity: number;
    date: string;
 }
