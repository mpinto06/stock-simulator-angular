import { Injectable } from '@angular/core';
import JSON_ICONS from "../data/json/icons.json";
import JSON_URL from "../data/json/url.json";
import JSON_ICON_BUTTONS from "../data/json/icon-button.json";
@Injectable({
  providedIn: 'root'
})
export class AppUtilService {

  icons: any = JSON_ICONS;
  urls: any = JSON_URL;
  iconButtons: any = JSON_ICON_BUTTONS;
  apiUrl = "http://localhost:8080/api";

}
