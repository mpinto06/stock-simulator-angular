import { CommonModule } from '@angular/common';
import { Component, DestroyRef, type OnInit } from '@angular/core';
import { StandardCardComponent } from '../../../core/components/standard-card/standard-card.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { CapitalCaseDirective } from '../../../core/directives/capital-case.directive';
import { OnlyNumberDirective } from '../../../core/directives/only-number.directive';
import { StandardCardInterface } from '../../../core/data/interface/standard-card.interface';
import { Router } from '@angular/router';
import { DataFlowService } from '../../../core/services/data-flow.service';
import { LoadingService } from '../../../core/services/loading.service';
import { StockService } from '../../../core/services/stock.service';
import { UserService } from '../../../core/services/user.service';
import { ValidatorService } from '../../../core/services/validator.service';
import { OwnStockResponseInterface } from '../../../core/data/interface/response/own-stock-response.interface';
import { UserResponseInterface } from '../../../core/data/interface/response/user-response.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StockInterface } from '../../../core/data/interface/stock.interface';
import { StockEODResponseInterface } from '../../../core/data/interface/response/stock-eod-response.interface';
import { StockResponseInterface } from '../../../core/data/interface/response/stock-response.interface';
import { TransferStockRequestInterface } from '../../../core/data/interface/request/transfer-stock-request.interface';

@Component({
  selector: 'stock-transfer',
  standalone: true,
  imports: [
    CommonModule,
    StandardCardComponent,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    OnlyNumberDirective,
    CapitalCaseDirective
  ],
  templateUrl: './transfer.page.html',
  styleUrl: './transfer.page.scss',
})
export class TransferPage implements OnInit {

  formGroup: FormGroup;
  standardCard: StandardCardInterface;
  ownedStocksString: string[] = [];
  ownedStocks: OwnStockResponseInterface[] = [];
  availablestocks: StockResponseInterface[] = [];
  currentUser: UserResponseInterface;
  availableUsers: UserResponseInterface[] = [];
  usernames: string[] = [];

  stockAmount: number = 0;
  close: number = 0;
  total: number = 0;
  quantity: number = 0;
  stock: StockInterface | null = null;

  ngOnInit(): void {
    this.subscribeEvents();
    if (!this.userService.currentUser.verified) {
      this.standardCard.message = "notVerifiedUser";
    }
    else if (this.userService.currentUser.admin) {
      this.standardCard.message = "adminUser";
    }
    else {
      this.setData();
    }
  }

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private validatorService: ValidatorService,
    private stockService: StockService,
    private destroyRef: DestroyRef,
    private dataFlowService: DataFlowService,
    private loadingService: LoadingService,
    private userService: UserService
  ) {
    this.availablestocks = this.stockService.getStockAvailable();
    this.currentUser = this.userService.currentUser;
    this.standardCard = {
      'title': 'Transferencia de Acciones',
      'description': 'Transfiere tus acciones con otros usuarios de <b class="green" >Stock Simulator</b>.'
    }

    this.formGroup = this.formBuilder.group({
      ticker: ['', [Validators.required, this.validatorService.containsStockValidator(this.ownedStocksString)]],
      receptor: ['', [Validators.required, this.validatorService.containsUserValidator(this.usernames, this.currentUser.username)]],
      amount: ['', [Validators.required, this.validatorService.greaterThanZeroValidator()]]   
    })
  }

  subscribeEvents(): void {
      this.formGroup.get('ticker')?.statusChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe( () => {
        let selectedStock = this.ownedStocks.find(( stock) => stock.ticker == this.formGroup.get('ticker')?.value.toUpperCase())
        this.stockAmount = selectedStock?.quantity ? selectedStock.quantity : 0;
      })
  
      this.formGroup.get('amount')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe( () => {
        const amountSelected = Number(this.formGroup.get('amount')?.value);
        console.log(amountSelected);
        if (this.stockAmount < amountSelected) {
          this.formGroup.get('amount')?.setErrors({'notEnoughStocks': true})
        }
      })
    }


  setData():void {
    this.loadingService.show()
    this.stockService.getOwnStocksRequest(this.currentUser.username)
    .then((response) => {
      if (response?.length > 0) {
        this.ownedStocks = response;
        for (let stock of this.ownedStocks) {
          this.ownedStocksString.push(stock.ticker);
        }
      }
      else {
        this.standardCard.message = 'withoutStock';
      }
    })

    this.userService.getAllUsersRequest()
    .then(( response) => {
      this.availableUsers = response;
      for (let user of this.availableUsers) {
        this.usernames.push(user.username);
      }
      this.loadingService.hide();
    })

    if (this.dataFlowService.selectedTicker != '' ) {
      this.formGroup.get('ticker')?.setValue(this.dataFlowService.selectedTicker);
      this.dataFlowService.cleanData();
    }  
  }

  redirectToSummary() {
    this.router.navigate(['/summary']).catch();
  }

  getStockDetails(stepper: MatStepper): void {
    this.formGroup.get('ticker')?.setValue(this.formGroup.get('ticker')?.value.toUpperCase());
    if (this.stockService.getStock(this.formGroup.get('ticker')?.value) != null) {
      this.stock = this.stockService.getStock(this.formGroup.get('ticker')?.value);
      this.close = this.stock.stockEODList[0].close;
      this.total = this.close * Number(this.formGroup.get('amount')?.value as string);
      this.quantity = Number(this.formGroup.get('amount')?.value as string);
      stepper.next();
    }
    else {
      const stockDetailList: StockEODResponseInterface[] = [];
          const validStock =  this.ownedStocks.find(stock => stock.ticker == this.formGroup.get('ticker')?.value);
          console.log(validStock);
          const stockResponse = this.availablestocks.find(stock => validStock?.ticker == stock.ticker);          
          if (stockResponse) {
            this.loadingService.show();
            let detail: StockEODResponseInterface;
            this.stockService.getStockEODRequest(this.formGroup.get('ticker')?.value)
            .then((response) => {
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
              this.stock = this.stockService.getStock(this.formGroup.get('ticker')?.value);
              this.close = this.stock.stockEODList[0].close;
              this.quantity = Number(this.formGroup.get('amount')?.value as string);
              this.total = this.close * this.quantity;
              stepper.next();
          }).finally( () => {
            this.loadingService.hide();
          })
        }
    }
  }

  transferStock(stepper: MatStepper): void {
    this.loadingService.show()
    const request: TransferStockRequestInterface = {
      ticker: this.formGroup.get('ticker')?.value,
      receptorUsername: this.formGroup.get('receptor')?.value,
      quantity: this.quantity,
      amount: this.total,
      name: this.stock?.name as string,
      issuerUsername: this.currentUser.username,
    };
    this.stockService.transferStock(request)
      .then((response) => {
        if (response.code == 0) {
          stepper.next();
        }
      })
      .catch((error) => {
        console.error('Error transferring stock:', error);
      })
      .finally(( ) => {
        this.loadingService.hide();
      });
    }

}
