import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { ValidatorService } from '../services/validator.service';

@Directive({
  selector: '[stockCVCDigits]',
  standalone: true,
  providers: [ 
    { 
      provide: NG_VALIDATORS, 
      useExisting: CVCDigitsDirective, 
      multi: true 
    } 
  ]
})
export class CVCDigitsDirective implements Validator{


  constructor(
    private validatorService: ValidatorService
  )
  {

  }
  validate(control: AbstractControl): ValidationErrors | null { return this.validatorService.cvcValidator()(control); }
 }
