import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tipoItemValor } from 'src/app/shared/interfaces/tipoItemValor';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UpdateTipoItemValorServiceService {

  constructor(
    private http: HttpClient,
  ) { }

  public updateTipoItemValor(id: string, payload: {valor: number}){
    return this.http.patch(`${environment.BASE_URL}/tipoItemValor/${id}`, payload)
  }

  public updateManyTipoItemValor(payload: tipoItemValor[]){
    return this.http.patch(`${environment.BASE_URL}/tipoItemValor`, payload)
  }

  public deleteTipoItemValor(url: string){
    return this.http.delete<any>(url)
  }
}
