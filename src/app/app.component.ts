import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { getSpanishPaginatorIntl } from './core/data/paginator/custom-paginator';
import { MatPaginatorIntl } from '@angular/material/paginator';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  providers: [
    { provide: MatPaginatorIntl, useValue: getSpanishPaginatorIntl()}
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'stock_simulatorNG';
}
