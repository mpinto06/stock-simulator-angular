import { CommonModule } from '@angular/common';
import { Component, DestroyRef, EventEmitter, Input, Output, type OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {  CustomModalInterface } from '../../data/interface/confirm-delete-modal.interface';

@Component({
  selector: 'stock-custom-modal',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './custom-modal.component.html',
  styleUrl: './custom-modal.component.scss',
})
export class CustomModalComponent implements OnInit {

    @Input() modalData!: CustomModalInterface;
    show = this.notificationService.isOpenCustomModal;
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
      this.notificationService.closeCustomModal();
    }
  
    confirmEvent(): void {
      this.confirm.emit();
      this.close();
    }
  
    subscribeEvent(): void {
      this.notificationService.customModalObservable$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.show = value;
      })
    }

}
