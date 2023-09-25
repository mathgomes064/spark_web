import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(
    private http: HttpClient,
  ) { }

  public registerPermissions(payload: any): Observable<any>{
    return this.http.post(`${environment.BASE_URL}/permissions`, payload)
  }

  public updatePermissions(payload: any): Observable<any>{
    return this.http.patch(`${environment.BASE_URL}/permissions`, payload)
  }
  
}
