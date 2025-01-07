import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppUtilService } from './app-util.service';
import { SupportFormRequestInterface } from '../data/interface/request/support-form-request.interface';
import { firstValueFrom } from 'rxjs';
import { SupportFormResponseInterface } from '../data/interface/response/support-form-response.interface';

@Injectable({
  providedIn: 'root'
})
export class SupportFormService {
  headers: HttpHeaders;

  constructor(
    private appUtil: AppUtilService,
    private http: HttpClient,
  ) {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });
  }

  createSupportForm(request: SupportFormRequestInterface): Promise<any> {
    const url = `${this.appUtil.apiUrl}${this.appUtil.urls.createForm}`;
    return firstValueFrom(this.http.post(url, request, { headers: this.headers }));
  }

  getSupportForms(username: string): Promise<SupportFormResponseInterface[]> {
    const url = `${this.appUtil.apiUrl}${this.appUtil.urls.allForms}?username=${username}`;
    return firstValueFrom(this.http.get<SupportFormResponseInterface[]>(url, { headers: this.headers }));
  }

  removeForm(id: number): Promise<any> {
    const url = `${this.appUtil.apiUrl}${this.appUtil.urls.removeForm}?id=${id}`;
    return firstValueFrom(this.http.post<any[]>(url, { headers: this.headers }));
  }

  

}
