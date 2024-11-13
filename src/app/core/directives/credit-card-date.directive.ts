import { Directive } from "@angular/core";
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from "@angular/forms";
import { ValidatorService } from "../services/validator.service";


@Directive({
  selector: '[stockCreditCardDate]',
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: CreditCardDateDirective,
      multi: true
    }
  ]
})
export class CreditCardDateDirective implements Validator{

  constructor(
    private validatorService: ValidatorService
  ) {

  }
  validate(control: AbstractControl): ValidationErrors | null {
    return this.validatorService.creditCardDateFormatValidator()(control);
  }
 }


