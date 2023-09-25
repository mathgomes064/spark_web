import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InnerEdificioService } from './edificio/inner-edificio-service/inner-edificio.service';
import { InnerCompartimentoService } from './compartimento/inner-compartimento-service/inner-compartimento.service';
import { InnerQuadroService } from './quadro/inner-quadro-service/inner-quadro.service';
import { InnerItemService } from './item/inner-item-service/inner-item.service';

@Component({
  selector: 'app-edificio-container',
  templateUrl: './edificio-container.component.html',
  styleUrls: ['./edificio-container.component.scss']
})
export class EdificioContainerComponent implements OnInit {
  public edificios: any

  public compartimentos: any

  public quadros: any

  public itens: any

  public edificiosToFilter: Array<any> = [];
  public currentEdificioId: any

  public compartimentosToFilter: Array<any> = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private innerEdificioService: InnerEdificioService,
    private innerCompartimentoService: InnerCompartimentoService,
    private innerQuadroService: InnerQuadroService,
    private innerItemService: InnerItemService
  ){}

  ngOnInit(): void {
    this.listarEdificios()
    this.listarCompartimentos()
    this.listarQuadros()
    this.listarItens()
  }

  listarEdificios(){
    this.innerEdificioService.getEdificio(this.activatedRoute.snapshot.params['prop_id']).subscribe(
      res =>{
        this.edificios = res
        res.forEach((objeto: any) => {
          const { id, nome } = objeto;
          this.edificiosToFilter.push({ id, nome });
        });
        this.edificiosToFilter.push({
          id: "-1",
          nome: "Filtrar Por Edificio"  
        })

      }
    )
  }

  listarCompartimentos(){
    this.innerCompartimentoService.getCompartimentosByProperty(this.activatedRoute.snapshot.params['prop_id']).subscribe(
      res =>{
        this.compartimentos = res
      }
    )
  }

  filtrarCompartimentosByEdificioId(edf_id: string){
    edf_id == "-1"? this.listarCompartimentos() : 

    this.innerEdificioService.getEdificioById(this.activatedRoute.snapshot.params['prop_id'], edf_id).subscribe(
      res =>{
        this.compartimentos = res.compartimento
      }
    )
  }

  listarQuadros(){
    this.innerQuadroService.getQuadros(this.activatedRoute.snapshot.params['prop_id']).subscribe(
      res =>{
        this.quadros = res
      }
    )
  }

  filtrarQuadrosByEdificioId(edf_id: string){
    this.currentEdificioId = edf_id
    edf_id == "-1"?
     (this.listarQuadros(),
     this.compartimentosToFilter.splice(0, this.compartimentosToFilter.length))
     : 

    this.innerEdificioService.getEdificioById(this.activatedRoute.snapshot.params['prop_id'], edf_id).subscribe(
      res =>{
        let filteredQuadros: any = []
        res.compartimento.forEach((comp: any) => comp.quadro.map((res: any) => filteredQuadros.push(res)))
        this.quadros = filteredQuadros

        this.compartimentosToFilter.splice(0, this.compartimentosToFilter.length);

        res.compartimento.forEach((objeto: any) => {
          const { id, descricao } = objeto;
          this.compartimentosToFilter.push({ id, descricao });
        });

        this.compartimentosToFilter.push({
          id: "-1",
          descricao: "Filtrar Por Compartimento"  
        });
      }
    )
  }

  filtrarQuadroPorCompartimento(comp_id: string){
    comp_id == "-1"?
    this.filtrarQuadrosByEdificioId(this.currentEdificioId)
    :

    this.innerQuadroService.getQuadrosByCompartimentoId(comp_id).subscribe(
      res =>{
        this.quadros = res.quadro
      }
    )
  }

  listarItens(){
    this.innerItemService.getItens(this.activatedRoute.snapshot.params['prop_id']).subscribe(
      res =>{
        this.itens = res
      }
    )
  }

  listarItemPorEdificioId(edf_id: string){
    this.currentEdificioId = edf_id
    edf_id == "-1"?
     (this.listarItens(),
     this.compartimentosToFilter.splice(0, this.compartimentosToFilter.length))
     : 

    this.innerEdificioService.getEdificioById(this.activatedRoute.snapshot.params['prop_id'], edf_id).subscribe(
      res =>{
        let filteredItens: any = []
        res.compartimento.forEach((comp: any) => comp.item.map((res: any) => filteredItens.push(res)))
        this.itens = filteredItens

        this.compartimentosToFilter.splice(0, this.compartimentosToFilter.length);

        res.compartimento.forEach((objeto: any) => {
          const { id, descricao } = objeto;
          this.compartimentosToFilter.push({ id, descricao });
        });

        this.compartimentosToFilter.push({
          id: "-1",
          descricao: "Filtrar Por Compartimento"  
        });
      }
    )
  }

  listarItemPorCompartimentoId(comp_id: string){
    comp_id == "-1"?
    this.listarItemPorEdificioId(this.currentEdificioId)
    :

    this.innerQuadroService.getQuadrosByCompartimentoId(comp_id).subscribe(
      res =>{
        this.itens = res.item
      }
    )
  }

}
