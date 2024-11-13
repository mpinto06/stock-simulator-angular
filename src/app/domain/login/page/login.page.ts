import { CommonModule } from '@angular/common';
import { Component, DestroyRef, type OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { StorageService } from '../../../core/services/storage.service';
import { ValidatorService } from '../../../core/services/validator.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoadingService } from '../../../core/services/loading.service';
import { UserLoginRequestInterface } from '../../../core/data/interface/request/user-login-request.interface';
import { UserResponseInterface } from '../../../core/data/interface/response/user-response.interface';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'stock-login',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
})
export class LoginPage implements OnInit {

  form: FormGroup;
  validForm: boolean = false

  constructor(
    private formBuilder: FormBuilder,
    private validatorService: ValidatorService,
    private destroyRef: DestroyRef,
    private loadingService: LoadingService,
    private userService: UserService
  ) {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, this.validatorService.passwordValidator()]]
    })
  }
  ngOnInit(): void {
    this.subscribeEvents()
  }

  subscribeEvents(): void {
    this.form.statusChanges
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(() => {
      this.validForm = this.form.valid;
    })
  }

  loginUser(): void {
    if (this.validForm) {
      this.loadingService.show()
      const userRequest: UserLoginRequestInterface = {
        username: this.form.get('username')?.value,
        password: this.form.get('password')?.value,
        
      }
      this.userService.loginUserRequest(userRequest).then((response) => {
        if (response.code == 0) {
          console.log(response)
          const user: UserResponseInterface = {
            firstName: response.firstName,
            lastName: response.lastName,
            username: response.username,
            email: response.email,
            verified: response.verified,
          }
          this.userService.loginUser(user);
        }
        else if (response.code == 1) {
          this.form.get('password')?.setErrors({'incorrectPassword': true});
        }
        else if (response.code == 2) {
          this.form.get('username')?.setErrors({'userNotFound': true});

        }
      })
      .finally( () => {
        this.loadingService.hide();
      })
    }
  }

}
