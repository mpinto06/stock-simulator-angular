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
export class IconButtonComponent implements OnInit{
  
  @Input() button!: IconButtonInterface;

  @Output() onClicked = new EventEmitter<void>();


  /* variables */
  icons: any;
  iconSource: string = '';
  constructor(
    private appUtils: AppUtilService
  ) {
  }

  ngOnInit(): void {
    this.icons = this.appUtils.icons;
    console.log(this.button.iconName + '_active')
    this.iconSource = this.icons[this.button.iconName + '_active']
    console.log(this.iconSource)
  }
}
