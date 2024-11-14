import { CommonModule } from '@angular/common';
import { Component,  DestroyRef,  type OnInit } from '@angular/core';
import { StandardCardComponent } from '../../../core/components/standard-card/standard-card.component';
import { MatButtonModule } from '@angular/material/button';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { StandardCardInterface } from '../../../core/data/interface/standard-card.interface';
import { Router } from '@angular/router';
import { StockEODResponseInterface } from '../../../core/data/interface/response/stock-eod-response.interface';
import { OnlyNumberDirective } from '../../../core/directives/only-number.directive';
import { ValidatorService } from '../../../core/services/validator.service';
import { StockResponseInterface } from '../../../core/data/interface/response/stock-response.interface';
import { StockService } from '../../../core/services/stock.service';
import { CreditCardDateDirective } from '../../../core/directives/credit-card-date.directive';
import { CVCDigitsDirective } from '../../../core/directives/cvc-digits.directive';
import { StockInterface } from '../../../core/data/interface/stock.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CapitalCaseDirective } from '../../../core/directives/capital-case.directive';
import { DataFlowService } from '../../../core/services/data-flow.service';
import { LoadingService } from '../../../core/services/loading.service';
import { BuyStockRequest } from '../../../core/data/interface/request/buy-stock-request.interface';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'stock-buy',
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
    CreditCardDateDirective,
    CVCDigitsDirective,
    CapitalCaseDirective
  ],
  templateUrl: './buy.page.html',
  styleUrl: './buy.page.scss',
})
export class BuyPage implements OnInit {

  isLinear = false;
  formGroup: FormGroup;
  standardCard: StandardCardInterface;
  stock: StockInterface | null = null;
  availablestocks: StockResponseInterface[] = [];
  formValid: boolean = false;
  tickerList: string[] = [];
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
    this.setTickerList();
    this.formGroup = this.formBuilder.group({
      ticker: ['', [Validators.required, this.validatorService.containsStockValidator(this.tickerList)]],
      amount: ['', [Validators.required, this.validatorService.greaterThanZeroValidator()]],
      cardNumber: ['', Validators.required],
      cvc: ['', Validators.required ],
      expirationDate: ['', Validators.required]
    });
    this.standardCard = {
      'title': 'Compra de Acciones',
      'description': 'Adquiere tus acciones y empieza a invertir en <b class="green" >Stock Simulator</b>.'
    }
    this.formValid = this.formGroup.valid;
  }

  
  ngOnInit(): void { 
    if (this.dataFlowService.selectedTicker != '') {
      this.formGroup.get('ticker')?.setValue(this.dataFlowService.selectedTicker);
    }
    this.subscribeEvents();
  }

  subscribeEvents(): void {
    this.formGroup.statusChanges
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(() => {
      console.log(this.formGroup.get('cvc')?.status);
      console.log(this.formGroup.get('ticker')?.status);
      console.log(this.formGroup.get('amount')?.status);
      console.log(this.formGroup.get('cardNumber')?.status);
      console.log(this.formGroup.get('expirationDate')?.status);
      this.formValid = this.formGroup.valid;
    })
  }

  setTickerList() {
    for (const stock of this.availablestocks) {
      this.tickerList.push(stock.ticker)
    }
  }

  redirectToSummary() {
    this.router.navigate(['/summary']).catch();
  }

  verifyVisaCard(stepper: MatStepper) {
    this.loadingService.show()
    this.formGroup.get('ticker')?.setValue(this.formGroup.get('ticker')?.value.toUpperCase());
    this.stockService.verifyVisaCard(this.formGroup.get('cardNumber')?.value)
    .then( (response) => {
      console.log(response)
      if (response.code == 0) {
        if (this.stockService.getStock(this.formGroup.get('ticker')?.value) != null) {
          this.stock = this.stockService.getStock(this.formGroup.get('ticker')?.value);
          this.close = this.stock.stockEODList[0].close;
          this.total = this.close * Number(this.formGroup.get('amount')?.value as string);
          this.quantity = Number(this.formGroup.get('amount')?.value as string);
          stepper.next();
        }
        else {
          this.getStockDetails(stepper);
        }
      }
      else  if (response.code == 1){
        this.formGroup.get('cardNumber')?.setErrors({'invalidCredidCard': true})
      }
    })
    .finally( () => {
      this.loadingService.hide();
    })
  }

  getStockDetails(stepper: MatStepper) {
    const stockDetailList: StockEODResponseInterface[] = [];
    const stockResponse =  this.availablestocks.find(stock => stock.ticker == this.formGroup.get('ticker')?.value)
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
    })}
  }

  buyStock(stepper: MatStepper): void {
    const buyStock: BuyStockRequest = {
      'amount': this.total,
      'name': this.stock?.name as string,
      'quantity': this.quantity,
      'ticker': this.stock?.ticker as string,
      'username': this.userService.currentUser.username
    }
    this.loadingService.show();
    this.stockService.buyStock(buyStock).then((response) => {
      if (response.code == 0) {
        stepper.next();
      }
    })
    .finally( () => {
      this.loadingService.hide();
    })
  }
}



