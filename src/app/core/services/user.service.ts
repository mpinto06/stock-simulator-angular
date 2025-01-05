import { Injectable } from '@angular/core';
import { AppUtilService } from './app-util.service';
import { firstValueFrom } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserResponseInterface } from '../data/interface/response/user-response.interface';
import { UserEditRequestInterface, UserRegisterRequestInterface } from '../data/interface/request/user-register-request.interface';
import { UserLoginRequestInterface } from '../data/interface/request/user-login-request.interface';
import { StorageService } from './storage.service';
import { NotificationService } from './notification.service';
import { Router } from '@angular/router';
import { UserVerifyRequestInterface } from '../data/interface/request/user-verify-request';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  headers: HttpHeaders;
  constructor(
    private appUtil: AppUtilService,
    private http: HttpClient,
    private storageService: StorageService,
    private notificationService: NotificationService,
    private router: Router
  ) { 
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });
  }  
  
  registerUserRequest(request: UserRegisterRequestInterface): Promise<any> {
    const url = `${this.appUtil.apiUrl}${this.appUtil.urls.registerUser}`;
    const headers = this.headers;
    return firstValueFrom(this.http.post(url, request, {headers} ));
  }
  
  loginUserRequest(request: UserLoginRequestInterface): Promise<any> {
    const url = `${this.appUtil.apiUrl}${this.appUtil.urls.loginUser}`;
    const headers = this.headers;
    return firstValueFrom(this.http.post(url, request, {headers} ));
  }

  verifyUserRequest(request: UserVerifyRequestInterface): Promise<any> {
    const url = `${this.appUtil.apiUrl}${this.appUtil.urls.verifyUser}`;
    const headers = this.headers;
    return firstValueFrom(this.http.post(url, request, {headers} ));
  }

  editUserRequest(request: UserEditRequestInterface): Promise<any> {
    const url = `${this.appUtil.apiUrl}${this.appUtil.urls.verifyUser}`;
    const headers = this.headers;
    return firstValueFrom(this.http.post(url, request, {headers} ));
  }

  loginUser(user: UserResponseInterface): void {
    this.saveUserStorage(user);
    this.notificationService.login();
    this.router.navigate(['/summary']).catch();
  }

  logoutUser(): void {
    this.removeUserStorage();
    this.notificationService.logout();
    this.router.navigate(['/home']).catch();
  }

  saveUserStorage(user: UserResponseInterface): void {
    this.storageService.setItem('currentUser', user);
  }

  removeUserStorage(): void {
    this.storageService.clear();
  }

  get currentUser(): UserResponseInterface {
    return this.storageService.getItem('currentUser') as UserResponseInterface;
  }



}
