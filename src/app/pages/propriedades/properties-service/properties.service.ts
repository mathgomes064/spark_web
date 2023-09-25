import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PropertiesService {

  constructor(
    private http: HttpClient,
  ) { }

  public registerProperties(payload: {nome: string, numero: string, logradouro: string, bairro: string, cidade: string, estado: string, complemento: string, cep: string, proprietario: string}): Observable<any>{
    return this.http.post(`${environment.BASE_URL}/propriedade`, payload)
  }

  public getProperties(): Observable<any>{
      return this.http.get<any>(`${environment.BASE_URL}/propriedade`)
  }

  public getPropriedadeById(url: string): Observable<any>{
      return this.http.get<any>(url)
  }

  public updatePropriedade(id:string, payload: {nome: string, numero: string, logradouro: string, bairro: string, cidade: string, estado: string, complemento: string, cep: string, proprietario: string}){
    return this.http.patch(`${environment.BASE_URL}/propriedade/${id}`, payload)
  }
}
