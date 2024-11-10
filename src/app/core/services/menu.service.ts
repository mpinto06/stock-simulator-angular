import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  
  private openMenuSubject$: BehaviorSubject<boolean> = new BehaviorSubject(true)
  
  toggle() {
    this.openMenuSubject$.next(!this.openMenuSubject$.getValue());
  }

  close() {
    this.openMenuSubject$.next(false);
  }

  open() {
    this.openMenuSubject$.next(true);
  }

  get openMenu(): boolean {
    return this.openMenuSubject$.getValue()
  }

  get openMenuObservable$(): Observable<boolean> {
    return this.openMenuSubject$.asObservable();
  }

}
