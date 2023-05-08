import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AdminUser } from '../models/adminUser-model';

@Injectable({
  providedIn: 'root'
})
export class AdminUsersService {
  
  constructor(private http: HttpClient){}
  
  private baseUrl: string = environment.baseUrl;
  
  getAdminUsers() {
    return this.http.get<AdminUser[]>(`${ this.baseUrl }/admin_admin_users/list_admin_users`)
  }
  
  getAdminUserByUsername(username: string) {
    return this.http.get<AdminUser>(`${ this.baseUrl }/admin_admin_users/get_admin_user/${username}`)
  }

  deletedAdminUser(_id: string) {
    this.http.delete<{message: string}>(`${this.baseUrl}/admin_admin_users/delete_admin_user/${_id}`).subscribe((jsonData) => {
      console.log(jsonData);
    })
  }

}
