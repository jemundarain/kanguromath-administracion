import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Location } from '@angular/common'

import { AdminUsersService } from '../services/admin-users.service';
import { AdminUser } from '../models/adminUser-model';
import { GlobalConstants } from 'src/app/common/global-constants';
import { Avatar } from '../models/avatar-model';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Observable, of, switchMap } from 'rxjs';
import dayjs from 'dayjs';
import { AuthService } from '../../auth/services/auth-service';
import { Auth } from 'src/app/auth/auth-model';
import { TestService } from 'src/app/tests/services/test.service';

@Component({
  selector: 'app-new-admin-user',
  templateUrl: './new-admin-user.component.html',
  providers: [ConfirmationService, MessageService]
})
export class NewAdminUserComponent implements OnInit {

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
  uploading: boolean;
  auxAvatar: Avatar;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private adminUsersService: AdminUsersService,
    private location: Location,
    private messageService: MessageService,
    private testService: TestService,
  ) { }

  ngOnInit(): void {
    GlobalConstants.generateRandomSuffix();
    this.minDate = dayjs().subtract(100, 'year').toDate();
    this.maxDate = dayjs().subtract(18, 'year').toDate();
    this.date_birth = dayjs(this.maxDate).toDate();
    if(this.activatedRoute.snapshot.url.join('/') !== 'agregar') {
      this.activatedRoute.params.pipe(switchMap( ({ username }) => this.adminUsersService.getAdminUserByUsername(username)))
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
      this.adminUsersService.deleteAvatar(this.adminUser.avatar.ik_id);
    }
    this.adminUser.avatar = newAvatar;
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
      this.adminUsersService.updateAdminUser(this.adminUser).subscribe({
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

  exitConfirmation(): Observable<boolean> {
    return new Observable((observer) => {
      this.testService.getListFiles('usuarios').subscribe({
        next: (res) => {
          for(const avatar of res) {
            if((avatar.name.split('-')[0] === this.adminUser.username) && (this.auxAvatar.url !== avatar.url)) {
              this.adminUsersService.deleteAvatar(this.adminUser.avatar.ik_id);
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
