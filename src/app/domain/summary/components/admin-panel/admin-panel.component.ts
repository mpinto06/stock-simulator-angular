import { CommonModule } from '@angular/common';
import { Component, ViewChild, type OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { IconButtonComponent } from '../../../../core/components/icon-button/icon-button.component';
import { UserService } from '../../../../core/services/user.service';
import { UserResponseInterface } from '../../../../core/data/interface/response/user-response.interface';
import { StockResponseInterface } from '../../../../core/data/interface/response/stock-response.interface';
import { TransactionResponseInterface } from '../../../../core/data/interface/response/transaction-response.interface';
import { LoadingService } from '../../../../core/services/loading.service';
import { StockService } from '../../../../core/services/stock.service';
import { AppUtilService } from '../../../../core/services/app-util.service';
import { IconButtonInterface } from '../../../../core/components/icon-button/interface/icon-button.interface';
import { StockEODResponseInterface } from '../../../../core/data/interface/response/stock-eod-response.interface';
import { StockDetailComponent } from '../stock-detail/stock-detail.component';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { DataFlowService } from '../../../../core/services/data-flow.service';
import { Router } from '@angular/router';
import { OwnStockResponseInterface } from '../../../../core/data/interface/response/own-stock-response.interface';

@Component({
  selector: 'stock-admin-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    IconButtonComponent,
    StockDetailComponent,
    MatCheckboxModule
  ],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss',
})
export class AdminPanelComponent implements OnInit {

  availableStocksColumns: string[] = ['ticker', 'name', 'description', 'detail'];
  userColumns: string[] = ['firstName', 'lastName', 'username', 'email', 'verified', 'select'];
  transactionColumns: string[] = ['ticker', 'amount', 'quantity', 'type', 'date'];
  ownedStocksColumns: string[] = ['ticker', 'name', 'quantity', 'detail'];
    
  availableStocksDataSource = new MatTableDataSource<StockResponseInterface>([]);
  userDataSource = new MatTableDataSource<UserResponseInterface>([]);
  transactionDataSource = new MatTableDataSource<TransactionResponseInterface>([]);
  ownedStockDataSource = new MatTableDataSource<OwnStockResponseInterface>([]);

  selectedTicker: string = '';
  selectedUser: UserResponseInterface | undefined | null;
  viewDetail: boolean = false;


  @ViewChild('availablePaginator') availablePaginator!: MatPaginator;
  @ViewChild('userPaginator') userPaginator!: MatPaginator;
  @ViewChild('transactionPaginator') transactionPaginator!: MatPaginator;

  editIcon: IconButtonInterface;
  eyeIcon: IconButtonInterface;


  constructor(
    private userService: UserService,
    private loadingService: LoadingService,
    private stockService: StockService,
    private appUtils: AppUtilService,
    private dataFlowService: DataFlowService,
    private router: Router
  ) {
    this.eyeIcon = this.appUtils.iconButtons.eyeIcon;
    this.editIcon = this.appUtils.iconButtons.editIcon;
  }

  ngOnInit(): void { 
    this.getAllDataSources();
  }

  ngAfterViewInit() {
    this.availableStocksDataSource.paginator = this.availablePaginator;
    this.userDataSource.paginator = this.userPaginator;
    this.transactionDataSource.paginator = this.transactionPaginator;
  }


  get currentUser(): UserResponseInterface {
    return this.userService.currentUser;
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
    this.userService.getAllUsersRequest()
    .then( (response) => {
      this.userDataSource.data = response;
    })
  }

  applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.availableStocksDataSource.filter = filterValue.trim().toLowerCase();
      this.userDataSource.filter = filterValue.trim().toLowerCase();
      this.transactionDataSource.filter = filterValue.trim().toLowerCase();
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

    formattedVerified(verified: boolean): string {
      return verified ? 'Sí' : 'No';
    }

    selectUser(event: MatCheckboxChange) {
      if (event.checked) {
        event.checked = false;
        this.selectedUser = this.userDataSource.data.find(user => user.username == event.source.value);
        if (this.selectedUser) {
          this.stockService.getTransactionsRequest(this.selectedUser.username)
          .then( (response) => {
            this.transactionDataSource.data = response;
            console.log(response);
          })

          this.stockService.getOwnStocksRequest(this.selectedUser.username)
          .then( (response) => {
            this.ownedStockDataSource.data = response;
            console.log(this.ownedStockDataSource)
          })
        }
      }
      else {
        this.selectedUser = null;
      }
    }

    editUser():void {
      if (this.selectedUser) {
        this.dataFlowService.preloadSelectedUsername(this.selectedUser)
        this.router.navigate(['/edit']).catch();
      }
    }

    get userInitials(): string {
      if (this.selectedUser) {
        return this.selectedUser.firstName.charAt(0) + this.selectedUser.lastName.charAt(0);
      }
      return "";
    }
  
    get userFullName(): string {
      if (this.selectedUser) {
        return this.selectedUser.firstName + " " + this.selectedUser.lastName;
      }
      return "";
    }



}
