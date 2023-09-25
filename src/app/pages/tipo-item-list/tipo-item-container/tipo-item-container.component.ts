import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TipoItemService } from 'src/app/pages/tipo-item-list/tipo-item-service/tipo-item.service';

@Component({
  selector: 'app-tipo-item-container',
  templateUrl: './tipo-item-container.component.html',
  styleUrls: ['./tipo-item-container.component.scss']
})
export class TipoItemContainerComponent implements OnInit {
  public setTipoItens: any
  public getTipoItens: any

  constructor(
    private tipo_item: TipoItemService,
  ) {}

  ngOnInit() {
    this.tipo_item.getItemAtributo().subscribe(
      res => {
        this.setTipoItens = res
        this.getTipoItens = this.setTipoItens
      }
    )
  }

  @Output() public emmitSearch: EventEmitter<string> = new EventEmitter

  public search(value: string){
    const filter = this.setTipoItens.filter((res: any) =>{
      return !res.descricao.toLowerCase().indexOf(value.toLowerCase());
    })
    this.getTipoItens = filter;
  }

  public flatAtributo(tipoItem: any){
    const tipoItemValor = tipoItem.tipoItemAtributo.flatMap((item:any) => item)
    let currentTipoItemAtributo: any = []
    tipoItemValor.forEach((valor: any) => {
      if(valor.excluido == false){
        currentTipoItemAtributo.push(valor)
      }
    });
    
    let selecionados = []

    for(let i = 0; i < currentTipoItemAtributo.length; i++){
      selecionados.push(currentTipoItemAtributo[i].descricao.trim())
    }

    if(selecionados.length <= 3){
      return selecionados.join(', ').split(" , ")
    }else{
      let result = selecionados.slice(0, 3).join(', ')
      result += ', ...'; 
      return result.split(" , ")
    }
  }

  public flatAtributoValues(tipoItem: any){
    const tipoItemAtributo = tipoItem.tipoItemAtributo.flatMap((item:any) => item)
    
    let availablesAtributos: any = []
    tipoItemAtributo.forEach((valor: any) => {
      if(valor.excluido == false){
        availablesAtributos.push(valor)
      }
    })

    const tipoItemValor = availablesAtributos.flatMap((item:any) => item.tipoItemValor)
    
    let currentTipoItemValor: any = []
    tipoItemValor.forEach((valor: any) => {
      if(valor.excluido == false){
        currentTipoItemValor.push(valor)
      }
    });

    let selecionados = []

    for(let i = 0; i < currentTipoItemValor.length; i++){
      selecionados.push(currentTipoItemValor[i].valor)
    }

    if(selecionados.length <= 3){
      return selecionados.join(', ').split(" , ")
    }else{
      let result = selecionados.slice(0, 3).join(', ')
      result += ', ...'; 
      return result.split(" , ")
    }
  }
}
