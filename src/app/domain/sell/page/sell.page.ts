import { CommonModule } from '@angular/common';
import { Component, DestroyRef, type OnInit } from '@angular/core';
import { EmailValidator, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { StandardCardComponent } from '../../../core/components/standard-card/standard-card.component';
import { CapitalCaseDirective } from '../../../core/directives/capital-case.directive';
import { OnlyNumberDirective } from '../../../core/directives/only-number.directive';
import { UserService } from '../../../core/services/user.service';
import { Router } from '@angular/router';
import { DataFlowService } from '../../../core/services/data-flow.service';
import { LoadingService } from '../../../core/services/loading.service';
import { StockService } from '../../../core/services/stock.service';
import { ValidatorService } from '../../../core/services/validator.service';
import { StandardCardInterface } from '../../../core/data/interface/standard-card.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OwnStockResponseInterface } from '../../../core/data/interface/response/own-stock-response.interface';
import { StockInterface } from '../../../core/data/interface/stock.interface';
import { StockEODResponseInterface } from '../../../core/data/interface/response/stock-eod-response.interface';
import { StockResponseInterface } from '../../../core/data/interface/response/stock-response.interface';
import { SellStockRequestInterface } from '../../../core/data/interface/request/sell-stock-request.interface';

@Component({
  selector: 'stock-sell',
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
  templateUrl: './sell.page.html',
  styleUrl: './sell.page.scss',
})
export class SellPage implements OnInit {

  standardCard: StandardCardInterface;
  formGroup: FormGroup;
  formValid: boolean;
  ownedStocks: OwnStockResponseInterface[] = [];
  tickerList: string[] = [];
  stockAmount: number = 0;
  stock: StockInterface | null = null;
  availablestocks: StockResponseInterface[] = [];
  close: number = 0;
  total: number = 0;
  quantity: number = 0;

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
    this.formGroup = this.formBuilder.group({
      ticker: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      amount: ['', [Validators.required, this.validatorService.greaterThanZeroValidator()]],
    });

    this.formValid = this.formGroup.valid;

    this.standardCard = {
      'title': 'Venta de Acciones',
      'description': 'Vende tus acciones y obten ganancias en <b class="green" >Stock Simulator</b>.'
    }
  }
  ngOnInit(): void {
    this.subscribeEvents();
    this.setData();
   }

  redirectToSummary() {
    this.router.navigate(['/summary']).catch();
  }

  subscribeEvents(): void {
    this.formGroup.statusChanges
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(() => {
      console.log(this.formGroup.get('email'))
      this.formValid = this.formGroup.valid;
    })

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
      if (this.stockAmount < amountSelected) {
        console.log(this.stockAmount)
        console.log(amountSelected)
        this.formGroup.get('amount')?.setErrors({'notEnoughStocks': true})
      }
    })
  }


  setData():void {
    this.loadingService.show();
    this.stockService.getOwnStocksRequest()
    .then( (response) => {
      this.loadingService.hide();
      this.ownedStocks = response;
      this.ownedStocks.forEach( ( stock: OwnStockResponseInterface) => {
        this.tickerList.push(stock.ticker)
      })
      this.formGroup.get('ticker')?.setValidators([Validators.required, this.validatorService.containsStockValidator(this.tickerList)])
      if (this.dataFlowService.selectedTicker != '' ) {
        this.formGroup.get('ticker')?.setValue(this.dataFlowService.selectedTicker);
        this.dataFlowService.cleanData();
      }        
    });
  }

  getStockEOD(stepper: MatStepper): void {
    this.formGroup.get('ticker')?.setValue(this.formGroup.get('ticker')?.value.toUpperCase());
    this.stock = this.stockService.getStock(this.formGroup.get('ticker')?.value);
    console.log(this.formGroup.get)
    if (this.stock == null) {
      let detail: StockEODResponseInterface;
      const stockDetailList: StockEODResponseInterface[] = [];
      const stockResponse =  this.availablestocks.find(stock => stock.ticker == this.formGroup.get('ticker')?.value);
      console.log(stockResponse)
      this.loadingService.show()
      this.stockService.getStockEODRequest(this.formGroup.get('ticker')?.value)
      .then(( response) => {
        for (const item of response) {
          detail = {
            'close': item.close,
            'date': item.date,
            'high': item.high,
            'low': item.low,
            'open': item.open,
            'volume': item.volume
          }
        }
        stockDetailList.push(detail);
        if (stockResponse) {
          console.log('aqui??')
          this.stockService.saveStockEOD(stockResponse, stockDetailList);
        }
        this.stock = this.stockService.getStock(this.formGroup.get('ticker')?.value);
        this.quantity = Number(this.formGroup.get('amount')?.value)
        this.close = this.stock.stockEODList[0].close;
        this.total = this.quantity * this.close;
        stepper.next();
      })
      .finally(() => {
        this.loadingService.hide()
      })
    }
    else {
      this.quantity = Number(this.formGroup.get('amount')?.value)
      this.close = this.stock.stockEODList[0].close;
      this.total = this.quantity * this.close;
      stepper.next()
    }
  }

  sellStock(stepper: MatStepper) {
    let request: SellStockRequestInterface = {
      'amount': this.total,
      'name': this.stock?.name as string,
      'quantity': this.quantity,
      'username': this.userService.currentUser.username,
      'ticker': this.stock?.ticker as string,
    }
    this.loadingService.show()
    this.stockService.sellStock(request).then( (response) => {
      if (response.code == 0) {
        stepper.next()
      }
    })
    .finally( () => {
      this.loadingService.hide()
    })
  }
}

