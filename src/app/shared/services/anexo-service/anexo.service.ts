import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AnexoService {

  constructor(
    private http: HttpClient,
  ) { }

  public registerAnexo(payload: {
    nome: string,
    tipo: string,
    excluido: boolean,
    comparitmento_id: null,
    edificio_id: null,
    propriedade_id: string
    }[]): Observable<any>{
    const token = localStorage.getItem("access_token")
    return this.http.post(`${environment.BASE_URL}/edificio/anexos`, payload, {
      headers: {
        "Authorization": token!
      }
    })
  }

  public getAnexos(): Observable<any>{
    const token = localStorage.getItem("access_token")
    return this.http.get(`${environment.BASE_URL}/edificio/anexos`, {
      headers: {
        "Authorization": token!
      }
    })
  }

  public getAnexosById(id: string): Observable<any>{
    const token = localStorage.getItem("access_token")
    return this.http.get(`${environment.BASE_URL}/edificio/anexos/${id}`, {
      headers: {
        "Authorization": token!
      }
    })
  }

  public softDeleteAnexos(id: string): Observable<any>{
    const token = localStorage.getItem("access_token")
    return this.http.delete(`${environment.BASE_URL}/edificio/anexos/sd/${id}`, {
      headers: {
        "Authorization": token!
      }
    })
  }
}
