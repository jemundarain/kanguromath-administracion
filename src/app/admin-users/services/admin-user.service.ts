import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { AdminUser } from '../models/adminUser-model';

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {
  
  constructor(private http: HttpClient){}
  
  private baseUrl: string = environment.baseUrl;
  
  getAdminUsers() {
    return this.http.get<AdminUser[]>(`${ this.baseUrl }/admin_admin_users/list_admin_users`);
  }
  
  getAdminUserByUsername(username: string) {
    return this.http.get<AdminUser>(`${ this.baseUrl }/admin_admin_users/get_admin_user/${username}`);
  }

  addNewAdminUser(adminUser: AdminUser) {
    return this.http.post<AdminUser>(`${ this.baseUrl }/admin_admin_users/post_admin_user/`, adminUser);
  }

  updateAdminUser(adminUser: AdminUser) {
    return this.http.put<AdminUser>(`${ this.baseUrl }/admin_admin_users/put_admin_user/`, adminUser);
  }

  deletedAdminUser(_id: string) {
    return this.http.delete<{message: string}>(`${this.baseUrl}/admin_admin_users/delete_admin_user/${_id}`);
  }

  deleteAvatar(ik_id: string) {
    return this.http.delete<any>(`${this.baseUrl}/admin_uploads/imagekit-delete/${ik_id}`);
  }

}
