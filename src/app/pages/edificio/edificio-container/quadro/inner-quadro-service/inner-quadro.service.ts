import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class InnerQuadroService {

  constructor(
    private http: HttpClient,
  ) { }

  public getQuadros(propertyId: string): Observable<any>{
    return this.http.get<any>(`${environment.BASE_URL}/quadro/compartimento/edificio/propriedade/${propertyId}`)
  }

  public getQuadrosByCompartimentoId(comp_id: string): Observable<any>{
    return this.http.get<any>(`${environment.BASE_URL}/compartimentos/${comp_id}`)
  }

  public getDpsTipo(){
    return this.http.get<any>(`${environment.BASE_URL}/dps_tipo`)
  }

  public createDpsTipo(data: any){
    return this.http.post<any>(`${environment.BASE_URL}/dps_tipo`, data)
  }

  public createQuadro(data:any){
    return this.http.post(`${environment.BASE_URL}/quadro`, data)
  }

  public updateQuadro(quadro_id: string, payload: any){
    return this.http.patch(`${environment.BASE_URL}/quadro/${quadro_id}`, payload)
  }

  public getQuadroWithGroup(quadro_id:string){
    return this.http.get<any>(`${environment.BASE_URL}/quadro/filter/dps/${quadro_id}`)
  }

}
