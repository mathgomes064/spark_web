import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UpdateTipoItemAtributoServiceService {

  constructor(
    private http: HttpClient,
  ) { }

  public updateTipoItemAtributo(id: string, payload: {descricao: string, selecionavel: string, unidade: string, sigla: string,  tipo_item_id?: string}){
    return this.http.patch(`${environment.BASE_URL}/tipoItemAtributo/${id}`, payload)
  }

  public deleteTipoItemAtributo(url: string){
    return this.http.delete(url)
  }
}
