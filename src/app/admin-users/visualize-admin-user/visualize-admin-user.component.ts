import { Component, OnInit, ViewChild } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { AdminUsersService } from '../services/admin-users.service';
import { AdminUser } from '../models/adminUser-model';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { GlobalConstants } from 'src/app/common/global-constants';
import { RadioOption } from 'src/app/common/radio-option.interface';
import { NgForm } from '@angular/forms';
import dayjs from 'dayjs';

@Component({
  selector: 'app-visualize-admin-user',
  templateUrl: './visualize-admin-user.component.html'
})
export class VisualizeAdminUserComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private AdminUsersService :AdminUsersService
  ) { }

  uploadUrl: string;
  adminUser: AdminUser;
  maxDate: Date;
  minDate: Date;
  items: MenuItem[];
  sexs = GlobalConstants.SEXS;
  date_birth: Date;
  @ViewChild('editAdminUserForm', {static: true}) editAdminUserForm !: NgForm;

  ngOnInit(): void {
    this.minDate = dayjs().subtract(100, 'year').toDate();
    this.maxDate = dayjs().subtract(18, 'year').toDate();
    this.activatedRoute.params
      .pipe(
        switchMap( ({ username }) => this.AdminUsersService.getAdminUserByUsername(username))
      )
      .subscribe( adminUser => {
        this.adminUser = adminUser;
        this.date_birth = dayjs(adminUser.date_birth).toDate();
        this.items = [
          {label: 'Usuarios'},
          {label: `${ adminUser.name + ' ' + adminUser.last_name }`}
        ];
      });
  };

  onBasicUpload(ev: any) {    
    console.log("ESTOY EN onBasicUpload -> EVENTO ", ev)
  }

  back() {
    
  }

}
