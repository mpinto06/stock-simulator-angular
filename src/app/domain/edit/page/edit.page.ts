import { CommonModule } from '@angular/common';
import { Component, DestroyRef, type OnInit } from '@angular/core';
import { StandardCardComponent } from '../../../core/components/standard-card/standard-card.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserResponseInterface } from '../../../core/data/interface/response/user-response.interface';
import { StandardCardInterface } from '../../../core/data/interface/standard-card.interface';
import { LoadingService } from '../../../core/services/loading.service';
import { UserService } from '../../../core/services/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ValidatorService } from '../../../core/services/validator.service';
import { UserEditRequestInterface } from '../../../core/data/interface/request/user-register-request.interface';

@Component({
  selector: 'stock-edit',
  standalone: true,
  imports: [
    CommonModule,
    StandardCardComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './edit.page.html',
  styleUrl: './edit.page.scss',
})
export class EditPage implements OnInit {

  standardCard: StandardCardInterface;
  formGroup: FormGroup;
  currentUser: UserResponseInterface;
  formChanged: boolean = false;

  constructor(
      private formBuilder: FormBuilder,
      private destroyRef: DestroyRef,
      private userService: UserService,
      private loadingService: LoadingService,
      private validatorService: ValidatorService,
    ) {
      this.currentUser = this.userService.currentUser;
      this.standardCard = {
        title: 'Editar Usuario',
        description: `Edite los campos que desea cambiar.`,	
      }
  
      this.formGroup =  this.formBuilder.group({  
        firstName: [this.currentUser.firstName, Validators.required],
        lastName: [this.currentUser.lastName, Validators.required],
        username: [this.currentUser.username, Validators.required],
        email: [this.currentUser.email, [Validators.required, Validators.email]],
        password: ['', this.validatorService.editPasswordValidator()],
      });
    }


  ngOnInit(): void { 
    this.subscribeEvents();
  }


  subscribeEvents(): void {
    this.formGroup.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(( ) => {
        if (this.firstNameControl?.value !== this.currentUser.firstName ||
          this.lastNameControl?.value !== this.currentUser.lastName ||
          this.usernameControl?.value !== this.currentUser.username ||
          this.emailControl?.value !== this.currentUser.email ||
          this.passwordControl?.value !== '') {
            this.formChanged = true;
        }
        else {
          this.formChanged = false;
        }
      });
  }

  editUser(): void {
    const userRequest: UserEditRequestInterface = {
      firstName: this.firstNameControl?.value,
      lastName: this.lastNameControl?.value,
      username: this.usernameControl?.value != this.currentUser.username ? this.usernameControl?.value : null,
      oldUsername: this.currentUser.username,
      email: this.emailControl?.value != this.currentUser.email ? this.emailControl?.value : null,
      password: this.passwordControl?.value != '' ? this.passwordControl?.value : null,
    }
    this.loadingService.show();
    this.userService.editUserRequest(userRequest).then((response) => {
      if (response.code == 0) {
        this.currentUser.firstName = userRequest.firstName;
        this.currentUser.lastName = userRequest.lastName;
        this.currentUser.username = userRequest.username != null ? userRequest.username : this.currentUser.username;
        this.currentUser.email = userRequest.email != null ? userRequest.email : this.currentUser.email;
        this.userService.saveUserStorage(this.currentUser);
        this.standardCard.message = 'editSuccess';
      }
      else if (response.code == 1) {
        this.formGroup.get('username')?.setErrors({'usernameTaken': true});
      }
      else if (response.code == 2) {
        this.formGroup.get('email')?.setErrors({'emailTaken': true});
      }
    }
    ).finally(
      () => {
        this.loadingService.hide();
      }
    )
  }

  get passwordControl() {
    return this.formGroup.get('password');
  }

  get emailControl() {
    return this.formGroup.get('email');
  }

  get usernameControl() {
    return this.formGroup.get('username');
  }

  get lastNameControl() {
    return this.formGroup.get('lastName');
  }

  get firstNameControl() {
    return this.formGroup.get('firstName');
  }

}
