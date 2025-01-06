import { Injectable } from '@angular/core';
import { UserResponseInterface } from '../data/interface/response/user-response.interface';

@Injectable({
  providedIn: 'root'
})
export class DataFlowService {

  public selectedTicker: string = '';
  public selectedUser: UserResponseInterface | null = null;


  preloadTicker(ticker: string) {
    this.selectedTicker = ticker;
  }

  preloadSelectedUsername(user: UserResponseInterface) {
    this.selectedUser = user;
  }

  cleanData(): void {
    this.selectedTicker = '';
    this.selectedUser = null;
  }

  

}
