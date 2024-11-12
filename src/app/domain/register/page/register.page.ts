import { CommonModule } from '@angular/common';
import { Component, DestroyRef, type OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ValidatorService } from '../../../core/services/validator.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoadingService } from '../../../core/services/loading.service';
import { UserService } from '../../../core/services/user.service';
import { UserRegisterRequestInterface } from '../../../core/data/interface/request/user-register-request.interface';
import { UserResponseInterface } from '../../../core/data/interface/response/user-response.interface';

@Component({
  selector: 'stock-register',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './register.page.html',
  styleUrl: './register.page.scss',
})
export class RegisterPage implements OnInit {
  form: FormGroup;
  validForm: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private validatorService: ValidatorService,
    private destroyRef: DestroyRef,
    private loadingService: LoadingService,
    private userService: UserService,
  ) {
    this.form = this.formBuilder.group({
      firstName : ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, this.validatorService.passwordValidator()]]
    })
  }
  ngOnInit(): void {
    this.validForm = this.form.valid;
    this.subscribeEvents();
    console.log(this.userService.currentUser);
  }

  subscribeEvents(): void {
    this.form.statusChanges
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(() => {
      this.validForm = this.form.valid;
    })
  }

  registerUser(): void {
    if (this.validForm) {
      this.loadingService.show()
      const userRequest: UserRegisterRequestInterface = {
        firstName: this.form.get('firstName')?.value,
        lastName: this.form.get('lastName')?.value,
        username: this.form.get('username')?.value,
        password: this.form.get('password')?.value,
        
      }
      this.userService.registerUser(userRequest).then((response) => {
        if (response.code == 0) {
          const user: UserResponseInterface = {
            firstName: response.firstName,
            lastName: response.lastName,
            username: response.username,
            email: response.email,
            verified: response.verified,
          }
          this.userService.saveUser(user);
          console.log(this.userService.currentUser);
        }
        else if (response.code == 1) {
          this.form.get('username')?.setErrors({'usernameTaken': true});
        }
      })
      .finally( () => {
        this.loadingService.hide();
      })
    }
  }
  
}

