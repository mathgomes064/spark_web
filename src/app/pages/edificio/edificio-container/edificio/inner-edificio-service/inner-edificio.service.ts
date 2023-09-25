import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class InnerEdificioService {

  constructor(
    private http: HttpClient,
  ) { }

  public createBuilding(data: any): Observable<any> {
    return this.http.post<any>(`${environment.BASE_URL}/edificio`, data); // Adicionando o corpo da requisição (data) aqui
  }

  public updateBulding(id_building:string, data: any,): Observable<any> {
    return this.http.patch<any>(`${environment.BASE_URL}/edificio/${id_building}`, data); // Adicionando o corpo da requisição (data) aqui
  }

  public getEdificio(propertyId:string): Observable<any>{
    return this.http.get<any>(`${environment.BASE_URL}/edificio/${propertyId}`)
  }

  public getEdificioById(propertyId:string, edf_id: string): Observable<any>{
    return this.http.get<any>(`${environment.BASE_URL}/edificio/${propertyId}/${edf_id}`)
  }

  public getBuilding(propertyId:string): Observable<any>{
    return this.http.get<any>(`${environment.BASE_URL}/edificio/${propertyId}`)
  }
}
