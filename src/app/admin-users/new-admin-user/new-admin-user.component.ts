import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Location } from '@angular/common'

import { AdminUsersService } from '../services/admin-users.service';
import { AdminUser } from '../models/adminUser-model';
import { GlobalConstants } from 'src/app/common/global-constants';
import { Avatar } from '../models/avatar-model';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { switchMap } from 'rxjs';
import dayjs from 'dayjs';

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
  error = false;
  avatar: Avatar;
  uploading: boolean;

  ngOnInit(): void {
    this.minDate = dayjs().subtract(100, 'year').toDate();
    this.maxDate = dayjs().subtract(18, 'year').toDate();
    this.date_birth = dayjs(this.maxDate).toDate();
    if(this.activatedRoute.snapshot.url.join('/') !== 'agregar') {
      this.activatedRoute.params.pipe(switchMap( ({ username }) => this.adminUsersService.getAdminUserByUsername(username)))
        .subscribe({
          next: (adminUser) => {
            this.adminUser = adminUser;
            this.date_birth = dayjs(adminUser.date_birth).toDate();
            this.items = [
              {label: 'Usuarios'},
              {label: `${ adminUser.name + ' ' + adminUser.last_name }`}
            ];
          },
          error: (err) => {
            this.error = true;
          }
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

  validateName() {
    return this.newAdminUserForm.controls['name']?.invalid && this.newAdminUserForm.controls['name']?.touched;
  }

  validateLastName() {
    return this.newAdminUserForm.controls['last_name']?.invalid && this.newAdminUserForm.controls['last_name']?.touched;
  }

  validateEmail() {
    return this.newAdminUserForm.controls['email']?.invalid && this.newAdminUserForm.controls['email']?.touched;
  }

  validatePassword() {
    return this.newAdminUserForm.controls['password']?.invalid && this.newAdminUserForm.controls['password']?.touched;
  }

  saveAdminUser() {
    this.adminUser.password = this.newPassword;
    if(this.adminUser._id) {
      this.confirmationService.confirm({
        header: "Confirmación",
        message: `¿Está seguro que desea editar el usuario ${this.adminUser.username}?`,
        accept: () => {
          this.adminUsersService.updateAdminUser(this.adminUser).subscribe({
            next: () => {
              this.messageService.add({severity:'success', summary: 'Exitoso', detail: 'Usuario editado 📝', life: 3250});
              setTimeout(() => {
                this.location.back()
              }, 1220);
            },
            error: (err) => {
              this.messageService.add({severity:'error', summary: 'Rechazado', detail: 'El usuario no fue editado 🙁', life: 3250});
            }
          });
        }
      });
    } else {
      this.adminUser.date_birth = this.date_birth;
      this.adminUsersService.addNewAdminUser(this.adminUser).subscribe({
        next: (adminUser) => {
          this.messageService.add({severity:'success', summary: 'Exitoso', detail: 'Usuario creado 🎉', life: 3250});
          setTimeout(() => {
            this.router.navigate([`/usuarios/ver/${adminUser.username}`]);
          }, 1220);
        },
        error: (err) => {
          this.messageService.add({severity:'error', summary: 'Rechazado', detail: 'Ya existe un usuario con ese correo 🙁', life: 3250});
        }
      });
    }
  }

  back() {
    this.location.back()
  }

}
