import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdminUser } from '../models/adminUser-model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {

  private baseUrl: string = environment.baseUrl;
  
  constructor(private http: HttpClient){}
  
  getAdminUsers() {
    return this.http.get<AdminUser[]>(`${this.baseUrl}/admin_admin_users/list_admin_users`);
  }
  
  getAdminUserByUsername(username: string) {
    return this.http.get<AdminUser>(`${this.baseUrl}/admin_admin_users/get_admin_user/${username}`);
  }

  addNewAdminUser(adminUser: AdminUser) {
    return this.http.post<AdminUser>(`${this.baseUrl}/admin_admin_users/post_admin_user/`, adminUser);
  }

  updateAdminUser(adminUser: AdminUser) {
    return this.http.put<AdminUser>(`${this.baseUrl}/admin_admin_users/put_admin_user/`, adminUser);
  }

  deletedAdminUser(_id: string) {
    return this.http.delete<{message: string}>(`${this.baseUrl}/admin_admin_users/delete_admin_user/${_id}`);
  }

}
