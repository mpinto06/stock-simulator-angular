import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  isShown = false;
  @Output() showEvent: EventEmitter<boolean> = new EventEmitter();

  hide() {
    setTimeout(() => {
      this.isShown = false;
      this.showEvent.emit(this.isShown);
    }, 1000);
  }

  /**
   * Muestra el loader y actualiza el flag de solicitud en curso
   *
   * @memberof LoadingService
   */
  show() {
    this.isShown = true;
    this.showEvent.emit(this.isShown);
  }

}
