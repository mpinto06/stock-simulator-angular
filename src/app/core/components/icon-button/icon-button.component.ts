import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, type OnInit } from '@angular/core';
import { IconButtonInterface } from './interface/icon-button.interface';
import { AppUtilService } from '../../services/app-util.service';

@Component({
  selector: 'stock-icon-button',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './icon-button.component.html',
  styleUrl: './icon-button.component.scss',
})
export class IconButtonComponent {
  
  @Input() button!: IconButtonInterface;

  @Output() onClicked = new EventEmitter<void>();


  /* variables */
  icons: any;
  iconSource: String;
  constructor(
    private appUtils: AppUtilService
  ) {
    this.icons = this.appUtils.icons;
    this.iconSource = this.icons[this.button.iconPathName + '_active']
  }

}
