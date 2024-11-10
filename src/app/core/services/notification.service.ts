import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private userLoggedSubject$: BehaviorSubject<boolean> = new BehaviorSubject(false)

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
}
