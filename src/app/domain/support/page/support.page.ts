import { Component, type OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { UserResponseInterface } from '../../../core/data/interface/response/user-response.interface';
import { CommonModule } from '@angular/common';
import { UserSupportComponent } from '../components/user-support/user-support.component';
import { CustomModalComponent } from '../../../core/components/custom-modal/custom-modal.component';
import { ConfirmDeleteModalComponent } from '../../../core/components/confirm-delete-modal/confirm-delete-modal.component';
import { NotificationService } from '../../../core/services/notification.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ConfirmDeleteModalInterface, CustomModalInterface } from '../../../core/data/interface/confirm-delete-modal.interface';
import { SupportFormRequestInterface } from '../../../core/data/interface/request/support-form-request.interface';
import { SupportFormService } from '../../../core/services/support-form.service';
import { SupportFormResponseInterface } from '../../../core/data/interface/response/support-form-response.interface';
import { LoadingService } from '../../../core/services/loading.service';
import { SupportDataService } from '../service/support-data.service';

@Component({
  selector: 'stock-support',
  standalone: true,
  imports: [
    CommonModule,
    UserSupportComponent,
    CustomModalComponent,
    ConfirmDeleteModalComponent,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  templateUrl: './support.page.html',
  styleUrl: './support.page.scss',
})
export class SupportPage implements OnInit {

  currentUser: UserResponseInterface;
  customModal: CustomModalInterface;
  deleteModal: ConfirmDeleteModalInterface;

  loaded: boolean = false;
  supportFormsData: SupportFormResponseInterface[] = [];

  textField: FormControl = new FormControl('');

  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private supportService: SupportFormService,
    private loadingService: LoadingService,
    private supportDataService: SupportDataService
  ) {
    this.currentUser = this.userService.currentUser;
    this.customModal = {
      title: 'Formulario de Soporte',
      description: 'Por favor, proporciona la mayor cantidad de detalles posible de su inconveniente. '
    }

    if (this.currentUser.admin) {
      this.deleteModal = {
        title: '¿Deseas cerrar el ticket de soporte?',
        description: "Por favor, asegúrese de que el problema ha sido solucionado adecuadamente.",
        deleteText: "Confirmar"
      }
    }
    else {
      this.deleteModal = {
        title: '¿Deseas cerrar el ticket de soporte?',
        description: "Si el problema persiste, por favor espere a que nuestro equipo lo solucione. Le notificaremos por correo electrónico cuando esté resuelto.",
        deleteText: "Confirmar"
      }
    }

  }
  ngOnInit(): void {
    this.setData();
  }

  createForm(): void {
    this.notificationService.openCustomModal();
  }

  setData(): void {
    this.loaded = false;
    this.loadingService.show();
    this.supportService.getSupportForms(this.currentUser.username)
    .then( (response) => {
      this.supportFormsData = response;
      console.log(this.supportFormsData);
      this.loaded = true;
    })
    .finally(() => {
      this.loadingService.hide();
    })
  }

  submitForm(): void {
    this.closeModal();
    const request: SupportFormRequestInterface = {
      textMessage: this.textField.value,
      username: this.currentUser.username
    }
    this.supportService.createSupportForm(request)
    .then(( response) => {
      if (response?.code == 0) {
        this.setData();
      }
    })
  }

  closeModal(): void {
    this.notificationService.closeCustomModal();
    this.notificationService.closeDeleteModal();
  }

  get formIds(): number[] {
    return this.supportDataService.formIds
  }

  confirmModal():void {
    this.notificationService.openDeleteModal();
  }

  removeFormService(): void {
    this.notificationService.closeDeleteModal();
    let promiseAll: Promise<any>[] = [];
    let ids = this.supportDataService.formIds;
    ids.forEach(id => promiseAll.push(this.supportService.removeForm(id)));
    this.loadingService.show()
    Promise.all(promiseAll)
    .then((responses) => {
      if (responses.every(response=> response.code == 0)) {
        this.setData();
      }
    })
    .finally(( ) => {
      this.loadingService.hide();
    })
  }


}
