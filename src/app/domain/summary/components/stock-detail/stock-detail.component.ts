import { CommonModule, formatDate } from '@angular/common';
import { Component, EventEmitter, Input, Output, type OnInit } from '@angular/core';
import { StockService } from '../../../../core/services/stock.service';
import { ChartModule } from 'primeng/chart';
import { StockEODResponseInterface } from '../../../../core/data/interface/response/stock-eod-response.interface';
import { StockInterface } from '../../../../core/data/interface/stock.interface';

@Component({
  selector: 'stock-detail',
  standalone: true,
  imports: [
    CommonModule,
    ChartModule
  ],
  templateUrl: './stock-detail.component.html',
  styleUrl: './stock-detail.component.scss',
})
export class StockDetailComponent implements OnInit {

  @Input() ticker!: string;
  @Output() backMenu: EventEmitter<void> = new EventEmitter();
  basicData: any;
  stock!: StockInterface;
  dates: string[] = [];
  closedValues: number[] = [];
  openValues: number[] = [];
  options: any;
  difference: number = 0;
  percentage: number = 0;
  lastClose: number = 0;
  lastOpen: number = 0;
  closeDate: string = '';

  constructor( private stockService: StockService) {
  }
  
  ngOnInit() {
    this.stock = this.stockService.getStock(this.ticker);
    this.setData()
    this.basicData = {
        labels: this.dates,
        datasets: [
            {
                label: 'Cierre',
                data: this.closedValues,
                borderWidth: 1,
                borderColor: '#50C878'
            },
            {
              label: 'Apertura',
              data: this.openValues,
              borderWidth: 1,
              borderColor: '#87CEEB'
          }
        ]
    };

    this.options = {
      plugins: {
        legend: {
          labels: {
            color: '#f2f2f4',
            font: {
              size: '14px'
            }
          },
        },
      },
      scales: {
        x: {
            ticks: {
                color: '#f2f2f4',
                font: {
                    weight: 500
                }
            },
            grid: {
                color: '#3b3e4d',
                drawBorder: false
            }
        },
        y: {
            ticks: {
                color: '#f2f2f4'
            },
            grid: {
                color: '#3b3e4d',
                drawBorder: false
            }
        }
    }
    }

  }

  setData(): void {
    for (const detail of this.stock.stockEODList) {
      this.dates.push(detail.date.slice(0,10));
      this.closedValues.push(detail.close);
      this.openValues.push(detail.open);
    }
    this.lastClose = this.stock.stockEODList.slice(-1)[0].close;
    console.log(this.stock.stockEODList.slice(-1)[0]);
    this.lastOpen = this.stock.stockEODList.slice(-1)[0].open;
    this.difference = this.lastClose - this.lastOpen;
    this.closeDate = this.stock.stockEODList.slice(-1)[0].date
  }

  get formattedDifference(): string {
    let sign = this.difference > 0 ? '+' : ''; 
    this.percentage = Math.abs(((this.lastClose - this.lastOpen) / this.lastOpen) * 100);
    return `${sign + this.difference.toFixed(2)} (${this.percentage.toFixed(2)}%)`
  }

  get formatDateToAMPM(): string {
    console.log(this.closeDate);
    return formatDate(this.closeDate, 'dd/MM/yyyy hh:mm:ss aa', 'en', 'GMT').toLowerCase();
  }
  
}
