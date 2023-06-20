import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common'

import { AdminUsersService } from '../services/admin-users.service';
import { AdminUser } from '../models/adminUser-model';
import { Avatar } from '../models/avatar-model';

import dayjs from 'dayjs';
import { switchMap } from 'rxjs/operators';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-visualize-admin-user',
  templateUrl: './visualize-admin-user.component.html'
})
export class VisualizeAdminUserComponent implements OnInit {
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private adminUsersService :AdminUsersService,
    private location: Location
  ) { }

  uploadUrl: string;
  adminUser = new AdminUser('', '', '', '', new Avatar('', '', ''), '', '', new Date(), '');
  items: MenuItem[];
  date_birth: string;
  newPassword: string;
  error = false;

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(switchMap( ({ username }) => this.adminUsersService.getAdminUserByUsername(username)))
      .subscribe({
        next: (adminUser) => {
          this.adminUser = adminUser;
          this.date_birth = dayjs(adminUser.date_birth).format('DD/MM/YYYY');
          this.items = [
            {label: 'Usuarios'},
            {label: `${ adminUser.name + ' ' + adminUser.last_name }`}
          ];
        },
        error: (err) => {
          this.error = true;
        }
      });
  };

  back() {
    this.location.back()
  }
}
