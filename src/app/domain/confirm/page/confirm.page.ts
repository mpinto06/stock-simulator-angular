import { CommonModule } from '@angular/common';
import { Component, DestroyRef, type OnInit } from '@angular/core';
import { StandardCardComponent } from '../../../core/components/standard-card/standard-card.component';
import { StandardCardInterface } from '../../../core/data/interface/standard-card.interface';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CapitalCaseDirective } from '../../../core/directives/capital-case.directive';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { pipe } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserService } from '../../../core/services/user.service';
import { UserResponseInterface } from '../../../core/data/interface/response/user-response.interface';
import { UserVerifyRequestInterface } from '../../../core/data/interface/request/user-verify-request';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'stock-confirm',
  standalone: true,
  imports: [
    CommonModule,
    StandardCardComponent,
    CapitalCaseDirective,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './confirm.page.html',
  styleUrl: './confirm.page.scss',
})
export class ConfirmPage implements OnInit {

  standardCard: StandardCardInterface;
  formGroup: FormGroup;
  currentUser: UserResponseInterface;


  constructor(
    private formBuilder: FormBuilder,
    private destroyRef: DestroyRef,
    private userService: UserService,
    private loadingService: LoadingService
  ) {
    this.currentUser = this.userService.currentUser;
    this.standardCard = {
      title: 'Confirmar Usuario',
      description: `Ingresa el código de confirmación que te enviamos a tu correo electrónico <b >${this.currentUser.email}</b>.`,	
    }

    this.formGroup =  this.formBuilder.group({  
      code: ['', [Validators.required, Validators.minLength(8)]]
    });
  }
  ngOnInit(): void { 
    if (this.currentUser.verified) {
      this.standardCard.message = 'verifiedUser';
    }
  }

  verifyUser(): void {
    this.loadingService.show();
    const request: UserVerifyRequestInterface = {
      username: this.currentUser.username,
      confirmationCode: this.formGroup.get('code')?.value,
    }
    this.userService.verifyUserRequest(request).then((response) => {
      if (response.code == 1) {
        this.formGroup.get('code')?.setErrors({invalid: true});
      }
      else if (response.code == 0) {
        this.currentUser.verified = true;
        this.userService.saveUserStorage(this.currentUser);
        this.standardCard.message = 'verifiedUser';
      }
    }
    ).catch((error) => {
      console.log('Error al verificar usuario', error);
    })
    .finally(
      () => {
        this.loadingService.hide();
      }
    )

  }
 

}
