import { Component, OnInit, ViewChild } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { AdminUsersService } from '../services/admin-users.service';
import { AdminUser } from '../models/adminUser-model';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { GlobalConstants } from 'src/app/common/global-constants';
import { NgForm } from '@angular/forms';
import dayjs from 'dayjs';
import { Location } from '@angular/common'
import { Avatar } from '../models/avatar-model';

@Component({
  selector: 'app-new-admin-user',
  templateUrl: './new-admin-user.component.html',
  providers: [ConfirmationService, MessageService]
})
export class NewAdminUserComponent implements OnInit {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private adminUsersService: AdminUsersService,
    private location: Location,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  @ViewChild('newAdminUserForm', {static: true}) newAdminUserForm !: NgForm;
  uploadUrl: string;
  adminUser: AdminUser;
  username: string;
  maxDate: Date;
  minDate: Date;
  items: MenuItem[];
  sexs = GlobalConstants.SEXS;
  date_birth: Date;
  newPassword: string;
  avatar: Avatar;
  uploading: boolean;

  ngOnInit(): void {
    this.minDate = dayjs().subtract(100, 'year').toDate();
    this.maxDate = dayjs().subtract(18, 'year').toDate();
    this.date_birth = dayjs(this.maxDate).toDate();
    if(this.activatedRoute.snapshot.url.join('/') !== 'agregar') {
      this.activatedRoute.params.pipe(switchMap( ({ username }) => this.adminUsersService.getAdminUserByUsername(username)))
        .subscribe( adminUser => {
          this.adminUser = adminUser;
          this.date_birth = dayjs(adminUser.date_birth).toDate();
          this.items = [
            {label: 'Usuarios'},
            {label: `${ adminUser.name + ' ' + adminUser.last_name }`}
          ];
        });
    } else {
      this.adminUser = new AdminUser('', '', '', '', new Avatar('', '', ''), '', '', new Date(), '');
    }
  };

  generateUsername() {
    this.adminUser.username = this.adminUser.name[0].toUpperCase() + this.adminUser.last_name.toLowerCase();
  }

  getRandomAvatarName(username: string) {
    return GlobalConstants.getRandomName(username);
  }
  
  addAvatar(newAvatar: any) {
    GlobalConstants.generateRandomSuffix();
    if(this.avatar.ik_id) {
      this.adminUsersService.deleteAvatar(this.avatar.ik_id);
    }
    this.avatar = newAvatar;
    this.uploading = false;
  }

  save() {
    if(this.adminUser._id) {
      this.confirmationService.confirm({
        header: "Confirmación",
        message: `¿Está seguro que desea editar el usuario ${this.adminUser.username}?`,
        accept: () => {
          this.adminUsersService.updateAdminUser(this.adminUser);
          this.messageService.add({severity:'success', summary: 'Exitoso', detail: 'Usuario editado 📝'});
          setTimeout(() => {
            this.location.back()
          }, 1220);
        }
      });
    } else {
      this.adminUser.date_birth = this.date_birth;
      this.adminUser.password = this.newPassword;
      this.adminUsersService.addNewAdminUser(this.adminUser);
      this.messageService.add({severity:'success', summary: 'Exitoso', detail: 'Usuario creado 🎉', life: 3250});
      setTimeout(() => {
        this.router.navigate([`/usuarios/ver/${this.adminUser.username}`]);
      }, 1220);
    }
  }

  back() {
    this.location.back()
  }

}
