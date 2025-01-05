import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  
  private openMenuSubject$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  private openSidebarSubject$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  
  toggle() {
    this.openMenuSubject$.next(!this.openMenuSubject$.getValue());
  }

  close() {
    this.openMenuSubject$.next(false);
  }

  open() {
    this.openMenuSubject$.next(true);
  }

  toggleSidebar() {
    this.openSidebarSubject$.next(!this.openSidebarSubject$.getValue());
  }

  closeSidebar() {
    this.openSidebarSubject$.next(false);
  }

  openSidebar() {
    this.openSidebarSubject$.next(true);
  }

  get isMenuOpen(): boolean {
    return this.openMenuSubject$.getValue()
  }

  get openMenuObservable$(): Observable<boolean> {
    return this.openMenuSubject$.asObservable();
  }

  get isSidebarOpen(): boolean {
    return this.openSidebarSubject$.getValue()
  }

  get openSidebarObservable$(): Observable<boolean> {
    return this.openSidebarSubject$.asObservable();
  }

}
