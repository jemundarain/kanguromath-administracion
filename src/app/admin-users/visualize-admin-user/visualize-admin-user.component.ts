import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminUsersService } from '../services/admin-users.service';
import { AdminUser } from '../models/adminUser-model';
import { MenuItem } from 'primeng/api';
import { GlobalConstants } from 'src/app/common/global-constants';
import dayjs from 'dayjs';
import { switchMap } from 'rxjs/operators';
import { Location } from '@angular/common'
import { Avatar } from '../models/avatar-model';

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

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap( ({ username }) => this.adminUsersService.getAdminUserByUsername(username))
      )
      .subscribe( adminUser => {
        this.adminUser = adminUser;
        this.date_birth = dayjs(adminUser.date_birth).format('DD/MM/YYYY');;
        this.items = [
          {label: 'Usuarios'},
          {label: `${ adminUser.name + ' ' + adminUser.last_name }`}
        ];
      });
  };

  back() {
    this.location.back()
  }
}
