import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { StockResponseInterface } from '../data/interface/response/stock-response.interface';
import { OwnStockResponseInterface } from '../data/interface/response/own-stock-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  alphaNumericRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]+$/;
  constructor() { 

  }

  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      const isValid = this.alphaNumericRegex.test(value) && value.length >= 8;
      if (isValid) {
        return null;
      }
      else return { passwordStrength: true };
    };
  }
  
  greaterThanZeroValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      return value > 0 ? null : { greaterThanZero: true };
    };
  }



  containsStockValidator(stockList: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value.toUpperCase() as string;
      return stockList.includes(value) ? null : { stockNotAvailable : true };
   };
  }


  creditCardDateFormatValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const isValidDateFormat = /^(0[1-9]|1[0-2])\/\d{2}$/.test(value);
      return isValidDateFormat ? null : { invalidDateFormat: true };
    };
  }


  cvcValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const isValidCVC = /^\d{3}$/.test(value);
      console.log(isValidCVC);
      return isValidCVC ? null : { invalidCVC: true };
  };
}

  

}
