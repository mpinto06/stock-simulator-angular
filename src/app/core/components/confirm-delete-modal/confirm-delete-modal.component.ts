import { CommonModule } from '@angular/common';
import { Component, DestroyRef, EventEmitter, Input, Output, type OnInit } from '@angular/core';
import { ConfirmDeleteModalInterface } from '../../data/interface/confirm-delete-modal.interface';
import { NotificationService } from '../../services/notification.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'stock-confirm-delete-modal',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './confirm-delete-modal.component.html',
  styleUrl: './confirm-delete-modal.component.scss',
})
export class ConfirmDeleteModalComponent implements OnInit {

  @Input() modalData!: ConfirmDeleteModalInterface;
  show = this.notificationService.isOpenDeleteModal;
  @Output() confirm: EventEmitter<void> = new EventEmitter();

  constructor( 
    private notificationService: NotificationService,
    private destroyRef: DestroyRef
  ) {

  }

  ngOnInit(): void { 
    this.subscribeEvent();
  }


  close():void {
    this.notificationService.closeDeleteModal();
  }

  confirmEvent(): void {
    this.confirm.emit();
    this.close();
  }

  subscribeEvent(): void {
    this.notificationService.confirmDeleteModalObservable$
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((value) => {
      this.show = value;
    })
  }


}
