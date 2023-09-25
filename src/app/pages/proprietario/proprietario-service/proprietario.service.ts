import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProprietarioService {

  constructor(
    private http: HttpClient,
  ) { }

  public registerProprietario(payload: {tipo_pessoa: string, nome: string, cpf_cnpj: string, email: string, celular: string}): Observable<any>{
    return this.http.post(`${environment.BASE_URL}/proprietario`, payload)
  }

  public getProprietarios(): Observable<any>{
    return this.http.get<any>(`${environment.BASE_URL}/proprietario`)
  }

  public updateProprietario(payload: {tipo_pessoa: string, nome: string, cpf_cnpj: string, email: string, celular: string}, id: string): Observable<any>{
    return this.http.patch(`${environment.BASE_URL}/proprietario/${id}`, payload)
  }
}
