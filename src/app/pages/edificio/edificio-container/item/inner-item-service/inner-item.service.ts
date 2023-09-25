import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class InnerItemService {

  constructor(
    private http: HttpClient,
  ) { }

  public getTipoItem(): Observable<any>{
    return this.http.get<any>(`${environment.BASE_URL}/tipoItem`)
  }

  public getTipoItemById(tipo_item_id: string): Observable<any>{
    return this.http.get<any>(`${environment.BASE_URL}/tipoItem/${tipo_item_id}`)
  }

  public getItens(propertyId: string): Observable<any>{
    return this.http.get<any>(`${environment.BASE_URL}/itens/propriedade/all/${propertyId}`)
  }

  public getGroups(){
    return this.http.get<any>(`${environment.BASE_URL}/grupoItem`)
  }

  public getByGroup(group_id:string){
    return this.http.get<any>(`${environment.BASE_URL}/tipoItem/group/${group_id}`)
  }

  public getById(id:string){
    return this.http.get<any>(`${environment.BASE_URL}/tipoItem/${id}`)
  }

  public addItem(data:any){
    return this.http.post<any>(`${environment.BASE_URL}/itens`, data)
  }

  public ItemUpdate(id:string, data:any): Observable<any>{
    return this.http.patch<any>(`${environment.BASE_URL}/itens/${id}`, data)
  }

  public ItemValueUpdate(data: any): Observable<any>{
    return this.http.patch<any>(`${environment.BASE_URL}/itemAtributo/edit-values`, data)
  }

  public getByRow(row:string){
    return this.http.get<any>(`${environment.BASE_URL}/tipoItem/filter/${row}`)
  }

  public getByItem(itemId:string){
    return this.http.get<any>(`${environment.BASE_URL}/tipoItem/filter/item/${itemId}`)
  }

  public getItemById(item_id: string){
    return this.http.get<any>(`${environment.BASE_URL}/itens/filter/${item_id}`)
  }
  
}
