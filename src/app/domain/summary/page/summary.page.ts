import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild, type OnInit } from '@angular/core';
import { FormControl, } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { StockResponseInterface } from '../../../core/data/interface/response/stock-response.interface';
import { StockService } from '../../../core/services/stock.service';
import { LoadingService } from '../../../core/services/loading.service';
import { IconButtonInterface } from '../../../core/components/icon-button/interface/icon-button.interface';
import JSON_ICON_BUTTON from '../../../core/data/json/icon-button.json';
import { IconButtonComponent } from '../../../core/components/icon-button/icon-button.component';
import { StockDetailComponent } from "../components/stock-detail/stock-detail.component";
import { StockEODResponseInterface } from '../../../core/data/interface/response/stock-eod-response.interface';
import { Router } from '@angular/router';
import { DataFlowService } from '../../../core/services/data-flow.service';
import { OwnStockResponseInterface } from '../../../core/data/interface/response/own-stock-response.interface';
import { TransactionResponseInterface } from '../../../core/data/interface/response/transaction-response.interface';
import { UserService } from '../../../core/services/user.service';


@Component({
  selector: 'stock-summary',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    IconButtonComponent,
    StockDetailComponent
],
  templateUrl: './summary.page.html',
  styleUrl: './summary.page.scss',
})
export class SummaryPage  implements AfterViewInit, OnInit {
  
  displayedColumns: string[] = ['ticker', 'name', 'description', 'detail'];
  displayedColumns2: string[] = ['ticker', 'name', 'quantity', 'detail'];
  displayedColumns3: string[] = ['ticker', 'amount', 'quantity', 'type', 'date'];
  availableStocksDataSource = new MatTableDataSource<StockResponseInterface>([]);
  adquiredStocksDataSource = new MatTableDataSource<OwnStockResponseInterface>([]);
  transactionsDataSource = new MatTableDataSource<TransactionResponseInterface>([]);
  myControl = new FormControl('initial value');
  selectedTicker: string = '';
  
  buyIcon: IconButtonInterface;
  eyeIcon: IconButtonInterface;
  sellIcon: IconButtonInterface;
  userFirstName: string = '';

  viewDetail: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private stockService: StockService,
    private loadingService: LoadingService,
    private router: Router,
    private dataFlowService: DataFlowService,
    private userService: UserService
  ) {
    this.buyIcon = JSON_ICON_BUTTON.buyIcon;
    this.eyeIcon = JSON_ICON_BUTTON.eyeIcon;
    this.sellIcon = JSON_ICON_BUTTON.sellIcon;
    this.userFirstName = this.userService.currentUser.firstName;
  }

  ngOnInit(): void {
    this.getAllDataSources();
  }

  ngAfterViewInit() {
    this.availableStocksDataSource.paginator = this.paginator;
  }

  getAllDataSources(): void {
    this.loadingService.show();
    this.stockService.getAllStocksRequest()
    .then( (response) => {
      if (response.code == 0) {
        this.availableStocksDataSource.data = response.stockDTOList;
        this.stockService.saveStockAvailable(response.stockDTOList)
      }
      this.loadingService.hide();
    })
    this.stockService.getOwnStocksRequest()
    .then( (response) => {
      this.adquiredStocksDataSource.data = response;
    })

    this.stockService.getBuySellRequest()
    .then( (response) => {
      this.transactionsDataSource.data = response;
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.availableStocksDataSource.filter = filterValue.trim().toLowerCase();
    this.adquiredStocksDataSource.filter = filterValue.trim().toLowerCase();
    this.transactionsDataSource.filter = filterValue.trim().toLowerCase();
  }

  viewStockDetail(stockResponse: StockResponseInterface) {
    const stockDetailList: StockEODResponseInterface[] = [];
    let detail: StockEODResponseInterface;
    this.selectedTicker = stockResponse.ticker;
    if (this.stockService.getStock(stockResponse.ticker) == null) {
      this.loadingService.show();
      this.stockService.getStockEODRequest(stockResponse.ticker)
      .then( (response) => {
        console.log(response)
        for (const item of response) {
          detail = {
            'close': item.close,
            'date': item.date,
            'high': item.high,
            'low': item.low,
            'open': item.open,
            'volume': item.volume
          }
          stockDetailList.push(detail);
        }
        this.stockService.saveStockEOD(stockResponse, stockDetailList); 
        this.viewDetail = true;
      })
      .catch( (error) => {
        console.log(error);
      })
      .finally( () => {
        this.loadingService.hide();
      })
    }
    else {
      this.viewDetail = true;
    }
  } 

  buyStock(stockResponse: StockResponseInterface) {
    if (this.stockService.getStock(stockResponse.ticker) == null) {
      const stockDetailList: StockEODResponseInterface[] = [];
      this.loadingService.show();
      let detail: StockEODResponseInterface;
      this.stockService.getStockEODRequest(stockResponse.ticker)
      .then( (response) => {
        console.log(response)
        for (const item of response) {
          detail = {
            'close': item.close,
            'date': item.date,
            'high': item.high,
            'low': item.low,
            'open': item.open,
            'volume': item.volume
          }
          stockDetailList.push(detail);
        }
        this.stockService.saveStockEOD(stockResponse, stockDetailList);
        this.dataFlowService.preloadTicker(stockResponse.ticker);
        this.router.navigate(['/buy']) 
      })
      .catch( (error) => {
        console.log(error);
      })
      .finally( () => {
        this.loadingService.hide();
      })
    }
    else {
      this.dataFlowService.preloadTicker(stockResponse.ticker);
      this.router.navigate(['/buy'])
    }
  }

  sellStock(stockResponse: StockResponseInterface) {
    this.dataFlowService.preloadTicker(stockResponse.ticker)
    this.router.navigate(['/sell'])
  }

  formattedType(type: string): string {
    switch(type) {
      case 'buy':
        return 'Compra';
      case 'sell':
        return 'Venta';
      default:
        return '';
    }
  }
  
}
