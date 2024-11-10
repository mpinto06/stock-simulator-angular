import { Injectable } from '@angular/core';
import JSON_ICONS from "../data/json/icons.json";

@Injectable({
  providedIn: 'root'
})
export class AppUtilService {

  icons: any = JSON_ICONS;

}
