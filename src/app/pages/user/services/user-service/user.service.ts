import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
  ) { }

  public registerUser(payload: {name: string, telefone: string, email: string, cpf: string}): Observable<any>{
    return this.http.post(`${environment.BASE_URL}/user`, payload)
  }

  public getUsers(): Observable<any>{
    return this.http.get<any>(`${environment.BASE_URL}/user`)
  }

  public updateUser(id:string, payload: {name: string,telefone:string, email: string, cpf: string}){
    return this.http.patch(`${environment.BASE_URL}/user/${id}`, payload)
  }
}
