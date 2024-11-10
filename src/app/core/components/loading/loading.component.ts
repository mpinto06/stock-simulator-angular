import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoadingService } from '../../services/loading.service';
import { NotificationService } from '../../services/notification.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'stock-loading',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
})
export class LoadingComponent { 
  show = false;
  hasError = false;

  constructor(
    private loadingService: LoadingService,
  ) {
    this.loadingService.showEvent
      .pipe(takeUntilDestroyed())
      .subscribe(isShown => {
        this.show = isShown;
      });
  }
}
