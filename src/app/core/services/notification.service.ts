import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private userLoggedSubject$: BehaviorSubject<boolean> = new BehaviorSubject(false)
  private confirmDeleteModalSubject$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private customModalSubject$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  login() {
    this.userLoggedSubject$.next(true);
  }

  logout() {
    this.userLoggedSubject$.next(false);
  }

  get userLoggedObservable$(): Observable<boolean> {
    return this.userLoggedSubject$.asObservable();
  }

  get userLogged(): boolean {
    return this.userLoggedSubject$.getValue();
  }

  openDeleteModal() {
    this.confirmDeleteModalSubject$.next(true);
  }

  closeDeleteModal() {
    this.confirmDeleteModalSubject$.next(false);
  }

  openCustomModal() {
    this.customModalSubject$.next(true);
  }

  closeCustomModal() {
    this.customModalSubject$.next(false);
  }

  get confirmDeleteModalObservable$(): Observable<boolean> {
    return this.confirmDeleteModalSubject$.asObservable();
  }

  get customModalObservable$(): Observable<boolean> {
    return this.customModalSubject$.asObservable();
  }

  get isOpenDeleteModal(): boolean {
    return this.confirmDeleteModalSubject$.getValue();
  }

  get isOpenCustomModal(): boolean {
    return this.customModalSubject$.getValue();
  }
}
