import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppUtilService } from './app-util.service';
import { NotificationService } from './notification.service';
import { StorageService } from './storage.service';
import { firstValueFrom } from 'rxjs';
import { StockEODResponseInterface } from '../data/interface/response/stock-eod-response.interface';
import { StockResponseInterface } from '../data/interface/response/stock-response.interface';
import { StockInterface } from '../data/interface/stock.interface';
import { BuyStockRequest } from '../data/interface/request/buy-stock-request.interface';
import { UserService } from './user.service';
import { SellStockRequestInterface } from '../data/interface/request/sell-stock-request.interface';
import { TransferStockRequestInterface } from '../data/interface/request/transfer-stock-request.interface';

@Injectable({
  providedIn: 'root'
})
export class StockService {


  headers: HttpHeaders;
  constructor(
    private appUtil: AppUtilService,
    private http: HttpClient,
    private storageService: StorageService,
  ) { 
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });
  }  
  
  getAllStocksRequest(): Promise<any> {
    const url = `${this.appUtil.apiUrl}${this.appUtil.urls.allStocks}`;
    const headers = this.headers;
    return firstValueFrom(this.http.get(url, {headers} ));
  }

  getOwnStocksRequest(username: string): Promise<any> {
    const url = `${this.appUtil.apiUrl}${this.appUtil.urls.ownStock.replace('{user}', username)}`;
    const headers = this.headers;
    return firstValueFrom(this.http.get(url, {headers} ));
  }

  getTransactionsRequest(username: string): Promise<any> {
    const url = `${this.appUtil.apiUrl}${this.appUtil.urls.transactions}?username=${username}`;
    const headers = this.headers;
    return firstValueFrom(this.http.get(url, {headers} ));
  }

  getStockEODRequest(ticker: string): Promise<any> {
    const url = `${this.appUtil.apiUrl}${this.appUtil.urls.stockEOD.replace('{ticker}', ticker)}`
    const headers = this.headers;
    return firstValueFrom(this.http.get(url, {headers}))
  }

  buyStock(buyRequest: BuyStockRequest): Promise<any> {
    const url = `${this.appUtil.apiUrl}${this.appUtil.urls.buyStock}`
    const headers = this.headers;
    return firstValueFrom(this.http.post(url, buyRequest, {headers}))
  }

  sellStock(sellRequest: SellStockRequestInterface): Promise<any> {
    const url = `${this.appUtil.apiUrl}${this.appUtil.urls.sellStock}`
    const headers = this.headers;
    return firstValueFrom(this.http.post(url, sellRequest, {headers}))
  }

  transferStock(transferRequest: TransferStockRequestInterface): Promise<any> {
    const url = `${this.appUtil.apiUrl}${this.appUtil.urls.transferStock}`;
    const headers = this.headers;
    return firstValueFrom(this.http.post(url, transferRequest, { headers }));
  }

  verifyVisaCard(cardNumber: string): Promise<any> {
    const url = `${this.appUtil.apiUrl}${this.appUtil.urls.verifyVisa}?cardNumber=${cardNumber}`
    const headers = this.headers;
    return firstValueFrom(this.http.post(url, {headers}))
  }


  saveStockEOD(stockResponse: StockResponseInterface, stockDetail: StockEODResponseInterface[]): void {
    const stock: StockInterface = {
      'ticker': stockResponse.ticker,
      'description': stockResponse.description,
      'name': stockResponse.name,
      'stockEODList': stockDetail
    }
    this.storageService.setItem(stockResponse.ticker, stock);
  }

  saveStockAvailable(stockResponseList: StockResponseInterface[]) {
    this.storageService.setItem('stockAvailableList', stockResponseList);
  }

  getStock(ticker: string): StockInterface {
    return this.storageService.getItem(ticker) as StockInterface;
  }

  getStockAvailable(): StockResponseInterface[] {
    return this.storageService.getItem('stockAvailableList') as StockResponseInterface[];
  }



}
