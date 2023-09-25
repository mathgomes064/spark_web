import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class TipoItemService {

  constructor(
    private http: HttpClient,
  ) { }

  public createGrupo(payload: {descricao: string, excluido: boolean, grupo_id: string | null}){
    return this.http.post<any>(`${environment.BASE_URL}/grupoItem`, payload)
  }

  public getGrupos(): Observable<any>{
    return this.http.get<any>(`${environment.BASE_URL}/grupoItem`)
  }

  public createTipoItem(payload: {descricao: string, linha: string, excluido: boolean, grupo_id: string | null}): Observable<any>{
    return this.http.post<any>(`${environment.BASE_URL}/tipoItem`, payload)
  }

  public createTipoItemAtributo(payload: {descricao: string, selecionavel:string, unidade: string, sigla:string, excluido: boolean, tipo_item_id: string}): Observable<any>{
    return this.http.post(`${environment.BASE_URL}/tipoItemAtributo`, payload)
  }

  public getItemAtributo(): Observable<any>{
    return this.http.get<any>(`${environment.BASE_URL}/tipoItem`)
  }

   public createTipoItemValor(payload: {valor: number, excluido: boolean, tipo_item_atributo_id: string}): Observable<any>{
    return this.http.post(`${environment.BASE_URL}/tipoItemValor`, payload)
  }

  public createManyTipoItemValor(payload: Array<{valor: string, excluido: boolean, tipo_item_atributo_id: string}>): Observable<any>{
    return this.http.post(`${environment.BASE_URL}/tipoItemValor/many_values`, payload)
  }
}
