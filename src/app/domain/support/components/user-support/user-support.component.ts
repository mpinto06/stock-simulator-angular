import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild, type OnInit } from '@angular/core';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { SupportFormResponseInterface } from '../../../../core/data/interface/response/support-form-response.interface';
import { UserService } from '../../../../core/services/user.service';
import { UserResponseInterface } from '../../../../core/data/interface/response/user-response.interface';
import { SupportDataService } from '../../service/support-data.service';

@Component({
  selector: 'stock-user-support',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule
  ],
  templateUrl: './user-support.component.html',
  styleUrl: './user-support.component.scss',
})
export class UserSupportComponent implements OnInit {

  @Input() supportFormData!: SupportFormResponseInterface[];
  
  supportFormsColumns: string[] = ['id', 'text', 'detail'];
  supportDataSource = new MatTableDataSource<SupportFormResponseInterface>([]);
  currentUser: UserResponseInterface;
  
  @ViewChild('supportPaginator', {static: false}) supportPaginator!: MatPaginator;

  constructor(
    private userService: UserService,
    private supportDataService: SupportDataService
  ) {
    this.currentUser = this.userService.currentUser;
    if (this.currentUser.admin) {
      this.supportFormsColumns =  ['id', 'text', 'username','detail'];
    }
  }
    
  
  ngOnInit(): void { 
    this.supportDataSource.data = this.supportFormData;
    this.supportDataService.clean();;
  }

  ngAfterViewInit(): void {
    this.supportDataSource.paginator = this.supportPaginator;
  }

  checkForms(event: MatCheckboxChange): void {
    let ids = this.supportDataService.formIds;
    let id = Number(event.source.value)
    if (event.checked && !ids.includes(id)) {
      this.supportDataService.pushId(id)
    }
    else if (!event.checked) {
      this.supportDataService.removeId(id);
    }
    console.log(this.supportDataService.formIds)
  }

}
