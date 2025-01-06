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
import { DataFlowService } from '../../../core/services/data-flow.service';
import { Router } from '@angular/router';
import { ConfirmDeleteModalComponent } from '../../../core/components/confirm-delete-modal/confirm-delete-modal.component';
import { ConfirmDeleteModalInterface } from '../../../core/data/interface/confirm-delete-modal.interface';
import { NotificationService } from '../../../core/services/notification.service';
import { OwnStockResponseInterface } from '../../../core/data/interface/response/own-stock-response.interface';
import { StockService } from '../../../core/services/stock.service';

@Component({
  selector: 'stock-edit',
  standalone: true,
  imports: [
    CommonModule,
    StandardCardComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    ConfirmDeleteModalComponent
  ],
  templateUrl: './edit.page.html',
  styleUrl: './edit.page.scss',
})
export class EditPage implements OnInit {

  standardCard: StandardCardInterface;
  formGroup: FormGroup;
  editUser: UserResponseInterface;
  formChanged: boolean = false;
  modalData: ConfirmDeleteModalInterface;
  ownedStocks: OwnStockResponseInterface[] = [];

  constructor(
      private formBuilder: FormBuilder,
      private destroyRef: DestroyRef,
      private userService: UserService,
      private loadingService: LoadingService,
      private validatorService: ValidatorService,
      private dataFlowService: DataFlowService,
      private router: Router,
      private notificationService: NotificationService,
      private stockService: StockService,
    ) {
      let modalDescription: string;
      if (this.userService.currentUser.admin && this.dataFlowService.selectedUser) {
        this.editUser = this.dataFlowService.selectedUser;
        modalDescription = `Al pulsar 'Eliminar', se borarrá permamente el usuario ${this.editUser.username} de Stock Simulator. `;
      }
      else{
        this.editUser = this.userService.currentUser;
        modalDescription = `Al pulsar 'Eliminar', se borarrá permamente el usuario ${this.editUser.username} de Stock Simulator y se cerrará la sesión. `;
        if (this.editUser.admin) {
          this.router.navigate(['/summary']).catch();
        }
      }
     
      this.standardCard = {
        title: 'Editar Usuario',
        description: `Edite los campos que desea cambiar.`,	
      }

      this.modalData = {
        title: "¿Estás seguro?",
        deleteText: "Confirmar",
        description: modalDescription
      }
  
      this.formGroup =  this.formBuilder.group({  
        firstName: [this.editUser.firstName, Validators.required],
        lastName: [this.editUser.lastName, Validators.required],
        username: [this.editUser.username, Validators.required],
        email: [this.editUser.email, [Validators.required, Validators.email]],
        password: ['', this.validatorService.editPasswordValidator()],
      });


    }


  ngOnInit(): void { 
    this.subscribeEvents();
    if (this.editUser.admin) {
      this.standardCard.message = "adminUser";
    }
    this.getData();
  }


  subscribeEvents(): void {
    this.formGroup.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(( ) => {
        if (this.firstNameControl?.value !== this.editUser.firstName ||
          this.lastNameControl?.value !== this.editUser.lastName ||
          this.usernameControl?.value !== this.editUser.username ||
          this.emailControl?.value !== this.editUser.email ||
          this.passwordControl?.value !== '') {
            this.formChanged = true;
        }
        else {
          this.formChanged = false;
        }
      });
  }

  editUserProfile(): void {
    const userRequest: UserEditRequestInterface = {
      firstName: this.firstNameControl?.value,
      lastName: this.lastNameControl?.value,
      username: this.usernameControl?.value != this.editUser.username ? this.usernameControl?.value : null,
      oldUsername: this.editUser.username,
      email: this.emailControl?.value != this.editUser.email ? this.emailControl?.value : null,
      password: this.passwordControl?.value != '' ? this.passwordControl?.value : null,
    }
    this.loadingService.show();
    this.userService.editUserRequest(userRequest).then((response) => {
      if (response.code == 0) {
        if (!this.userService.currentUser.admin) {
          this.editUser.firstName = userRequest.firstName;
          this.editUser.lastName = userRequest.lastName;
          this.editUser.username = userRequest.username != null ? userRequest.username : this.editUser.username;
          this.editUser.email = userRequest.email != null ? userRequest.email : this.editUser.email;
          this.userService.saveUserStorage(this.editUser);
        }
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

  getData(): void{
    this.loadingService.show();
    this.stockService.getOwnStocksRequest(this.editUser.username)
    .then(( response) => {
      this.ownedStocks = response;
      this.loadingService.hide();
    })
  }

  removeUserModal(): void {
    this.notificationService.openDeleteModal()
  }

  removeUserService(): void {
    this.loadingService.show();
    this.userService.deleteUserRequest(this.editUser.username)
    .then( ( response) => {
      if (response?.code == 0) {
        if (this.userService.currentUser.admin) {
          this.dataFlowService.cleanData()
          this.standardCard.message = "deletedUser";
        }
        else {
          this.userService.logoutUser();
        }
      }
    })
    .finally(() => {
      this.loadingService.hide();
    })
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
