import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SupportDataService {

  public formIds: number[] = [];

  pushId(id: number) {
    this.formIds.push(id)
  }

  removeId(id: number) {
    this.formIds = this.formIds.filter(value => value != id);
  }

  clean() {
    this.formIds = [];
  }
}
