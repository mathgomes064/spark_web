import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UpdateTipoItemServiceService {

  constructor(
    private http: HttpClient,
  ) { }

  public getTipoItemById(url: string): Observable<any>{
    return this.http.get<any>(url)
  }

  public getTipoItemWithGroupById(url: string): Observable<any>{
    return this.http.get<any>(url)
  }

  public updateTipoItem(id: string, payload: {descricao: string, linha: string, grupo_id: string}){
    return this.http.patch(`${environment.BASE_URL}/tipoItem/${id}`, payload)
  }



}
