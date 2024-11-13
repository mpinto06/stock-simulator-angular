import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataFlowService {

   public selectedTicker: string = '';


  preloadTicker(ticker: string) {
    this.selectedTicker = ticker;
  }

  cleanData(): void {
    this.selectedTicker = '';
  }

  

}
