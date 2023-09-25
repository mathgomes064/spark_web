import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class InnerCompartimentoService {

  constructor(
    private http: HttpClient,
  ) { }

  public getCompartimentosByProperty(prop_id: string): Observable<any>{
    return this.http.get<any>(`${environment.BASE_URL}/compartimentos/edificio/propriedade/${prop_id}`)
  }

  public getCompartimentosByEdf(edf_id: string): Observable<any>{
    return this.http.get<any>(`${environment.BASE_URL}/compartimentos/edificio/propriedade/filter/${edf_id}`)
  }

  public editCompartimentos(compart_id: string, data: any): Observable<any>{
    return this.http.patch<any>(`${environment.BASE_URL}/compartimentos/${compart_id}`, data)
  }

  public createCompartimentos(data: any): Observable<any>{
    return this.http.post<any>(`${environment.BASE_URL}/compartimentos`, data)
  }

}
