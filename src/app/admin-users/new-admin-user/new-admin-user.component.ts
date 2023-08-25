import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Location } from '@angular/common'

import { AdminUserService } from '../services/admin-user.service';
import { AdminUser } from '../models/adminUser-model';
import { GlobalConstants } from 'src/app/common/global-constants';
import { Avatar } from '../models/avatar-model';
import { TestService } from 'src/app/tests/services/test.service';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Observable, switchMap } from 'rxjs';
import dayjs from 'dayjs';

@Component({
  selector: 'app-new-admin-user',
  templateUrl: './new-admin-user.component.html',
  providers: [ConfirmationService, MessageService]
})
export class NewAdminUserComponent implements OnInit {

  @ViewChild('newAdminUserForm', {static: true}) newAdminUserForm !: NgForm;
  uploadUrl: string;
  adminUser: AdminUser = new AdminUser('', '', '', '', new Avatar('', '', ''), '', '', new Date, '');
  username: string;
  maxDate: Date;
  minDate: Date;
  items: MenuItem[];
  sexs = GlobalConstants.SEXS;
  date_birth: Date;
  newPassword: string;
  error = false;
  uploading: boolean;
  auxAvatar: Avatar;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private adminUserService: AdminUserService,
    private location: Location,
    private messageService: MessageService,
    private testService: TestService,
  ) {
    this.newPassword = '';
  }

  ngOnInit() {
    GlobalConstants.generateRandomSuffix();
    this.minDate = dayjs().subtract(100, 'year').toDate();
    this.maxDate = dayjs().subtract(18, 'year').toDate();
    this.date_birth = dayjs(this.maxDate).toDate();
    if(this.activatedRoute.snapshot.url.join('/') !== 'agregar') {
      this.activatedRoute.params.pipe(switchMap( ({ username }) => this.adminUserService.getAdminUserByUsername(username)))
        .subscribe({
          next: (adminUser) => {
            this.adminUser = adminUser;
            this.auxAvatar = this.adminUser.avatar;
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
    if(this.adminUser.avatar.ik_id) {
      this.testService.deleteImage(this.adminUser.avatar.ik_id).subscribe({
        next: () => {
          this.adminUser.avatar = newAvatar;
          this.uploading = false;
        },
        error: () => { }
      });
    } else {
      this.adminUser.avatar = newAvatar;
      this.uploading = false;
    }
  }

  validateName() {
    return this.newAdminUserForm.controls['name']?.invalid && this.newAdminUserForm.controls['name']?.touched;
  }

  validateLastName() {
    return this.newAdminUserForm.controls['last_name']?.invalid && this.newAdminUserForm.controls['last_name']?.touched;
  }

  validateSex() {
    return this.newAdminUserForm.form.value.sex === '';
  }

  validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (this.newAdminUserForm.controls['email']?.invalid && this.newAdminUserForm.controls['email']?.touched) || (this.newAdminUserForm.controls['email']?.touched && !emailRegex.test(this.newAdminUserForm.form.value.email));
  }

  validatePassword() {
    return this.newPassword.length<8 && this.newAdminUserForm.controls['password']?.touched;
  }

  validateNewAdminUserForm() {
    if(this.activatedRoute.snapshot.url.join('/') !== 'agregar') {
      return this.validateName() || this.validateLastName() || this.validateSex() || this.validateEmail();
    }
    return this.validateName() || this.validateLastName() || this.validateSex() || this.validateEmail() || this.newPassword.length<8;
  }

  saveAdminUser() {
    this.adminUser.password = this.newPassword;
    if(this.adminUser._id) {
      this.adminUserService.updateAdminUser(this.adminUser).subscribe({
        next: () => {
          localStorage.setItem('user', JSON.stringify(this.adminUser));
          this.messageService.add({severity:'success', summary: 'Exitoso', detail: 'Usuario editado 📝', life: 3250});
          setTimeout(() => {
            window.location.reload();
          }, 1220);
        },
        error: (err) => {
          this.messageService.add({severity:'error', summary: 'Rechazado', detail: 'El usuario no fue editado 🙁', life: 3250});
        }
      });
    } else {
      this.adminUser.date_birth = this.date_birth;
      this.adminUserService.addNewAdminUser(this.adminUser).subscribe({
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

  exitConfirmation(): Observable<boolean> {
    return new Observable((observer) => {
      this.testService.getListFiles('usuarios').subscribe({
        next: (res) => {
          for(const avatar of res) {
            if((avatar.name.split('-')[0] === this.adminUser.username) && (this.auxAvatar.url !== avatar.url)) {
              this.testService.deleteImage(this.adminUser.avatar.ik_id).subscribe();
            }
          }
          observer.next(true);
          observer.complete();
        },
        error: (err) => { }
      });
    });
  }

  back() {
    this.location.back()
  }

}
