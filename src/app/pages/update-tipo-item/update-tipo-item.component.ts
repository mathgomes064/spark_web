import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { createGrupo, createTipoItem } from 'src/app/shared/models/models';
import { TipoItemService } from 'src/app/pages/tipo-item-list/tipo-item-service/tipo-item.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { UpdateTipoItemServiceService } from './services/update-tipo-item-service/update-tipo-item-service.service';
import { environment } from 'src/environments/environment.development';
import { UpdateTipoItemAtributoServiceService } from './services/update-tipo-item-atributo-service/update-tipo-item-atributo-service.service';
import { LoadingService } from 'src/app/shared/services/loading-service/loading.service';
import { finalize, first } from 'rxjs';

interface Grupos{
  id: string,
  descricao: string;
}

interface Linha{
  descricao: string;
}

@Component({
  selector: 'app-update-tipo-item',
  templateUrl: './update-tipo-item.component.html',
  styleUrls: ['./update-tipo-item.component.scss']
})
export class UpdateTipoItemComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private updateTipoItemServiceService: UpdateTipoItemServiceService,
    private updateTipoItemAtributoService: UpdateTipoItemAtributoServiceService,
    private loadingService: LoadingService,
    private tipoItem: TipoItemService,
  ){}

  variavelRecebida: boolean = false;

  receberVariavel(event:any) {
    this.variavelRecebida = event;
  }

  createVisible: boolean = false;

  //ADIÇAO DE ATRIBUTOS
  atributos: any[] = []

  adicionarAtributo(){
    this.atributos.push({})
    this.variavelRecebida = !this.variavelRecebida
  }

  removerAtributo(index: number, id: string){
    this.updateTipoItemAtributoService.deleteTipoItemAtributo(
      `${environment.BASE_URL}/tipoItemAtributo/${id}`).subscribe(
        res => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: "Atributo Deletado" })
        }
    )
    let arrayDeObjetos: any = this.atributos.filter(objeto => objeto.id !== id);

    this.atributos = arrayDeObjetos
  }

  grupos: Grupos[] = [];
  linha: Linha[] = [
    {descricao: "Branca"},
    {descricao: "Azul"},
    {descricao: "Verde"},
    {descricao: "Marron"}
  ];

  public tipoItemIdToUpdate: any
  ngOnInit(): void {
    this.tipoItem.getGrupos().subscribe(
      res => {
        res.forEach((objeto: any) => {
          const { id, descricao } = objeto;
          this.grupos.push({ id, descricao });
        });
        this.grupos.push({
          id: "-1",
          descricao: "Adicionar Grupo"  
        })
      }
    )

    this.createUpdateTipoItemForm(new createTipoItem())
    this.createGrupoForm(new createGrupo())


    this.tipoItemIdToUpdate = this.activatedRoute.snapshot.params['tipo_item_id']

    this.updateTipoItemServiceService.getTipoItemWithGroupById(`${environment.BASE_URL}/tipoItem/gr/${this.tipoItemIdToUpdate}`).subscribe(
      res =>{
        this.createUpdateTipoItemForm(res)
      }
    )

    this.updateTipoItemServiceService.getTipoItemById(`${environment.BASE_URL}/tipoItem/${this.tipoItemIdToUpdate}`).subscribe(
      res => {

        let availableAtributos = res.tipoItemAtributo.filter((atributo: any) => atributo.excluido === false)
        if(availableAtributos.length !== 0){
          this.atributos = availableAtributos
        }else{
          this.atributos = [{}]
        }
      }
    )
  }

  returnGrupo_id(){
    this.updateTipoItemServiceService.getTipoItemWithGroupById(`${environment.BASE_URL}/tipoItem/gr/${this.tipoItemIdToUpdate}`).subscribe(
      res =>{
        this.createUpdateTipoItemForm(res)
      }
    )
  }

  //TIPO ITEM 
  updateTipoItemForm!: FormGroup;
  public createUpdateTipoItemForm(register: createTipoItem){
    this.updateTipoItemForm = this.formBuilder.group({
      descricao: [register.descricao, [Validators.required]],
      linha: [register.linha, [Validators.required]],
      grupo_id: [register.grupo_id, [Validators.required]]
    })
  }

  //EDIÇÃO DE TIPO ITEM
  public current_tipo_item_id: string | null = null
  public submitTipoItemForm(){
    if(this.updateTipoItemForm.valid){
      this.loadingService.present();
      this.updateTipoItemServiceService.updateTipoItem(this.tipoItemIdToUpdate, {
        descricao: this.updateTipoItemForm.value.descricao,
        linha: this.updateTipoItemForm.value.linha.descricao,
        grupo_id: this.updateTipoItemForm.value.grupo_id.id
      }
      ).pipe(first(), finalize(()=> {this.loadingService.dismiss()})).subscribe({
        next: (res: any) => {
          this.current_tipo_item_id = res.id
          this.messageService.add({ severity: 'success', summary: 'Success', detail: "Tipo Item Atualizado" })
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error })
        }
      })
    }else{
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Dados Inválidos" })
    }
  }


  getGrupo(grupo_id: any){
    if(grupo_id.id == "-1"){
      this.createVisible = !this.createVisible
      this.updateTipoItemForm.controls['grupo_id'].setValue(null);
    }
  }

  //GRUPO
  registerGrupoForm!: FormGroup;
  public createGrupoForm(register: createGrupo){
    this.registerGrupoForm = this.formBuilder.group({
      descricao: [register.descricao, [Validators.required]],
      excluido: false,
      grupo_id: [register.grupo_id, [Validators.required]]
    })
  }

  //CRIAÇÃO DE GRUPOS
  public submitGrupoForm(){
    if(this.registerGrupoForm.value.descricao !== ""){
     this.loadingService.present();
     this.tipoItem.createGrupo(
       this.registerGrupoForm.value
     ).pipe(first(), finalize(()=> {this.loadingService.dismiss()})).subscribe({
       next: (res) =>{
         let item = this.grupos.pop()
         this.grupos.push(res)
         this.grupos.push(item!)
         this.registerGrupoForm.reset()
         this.messageService.add({ severity: 'success', summary: 'Success', detail: "Grupo Cadastrado" })
         this.createVisible = !this.createVisible
         this.registerGrupoForm.patchValue({ excluido: false });
       },
       error: (err) => {
         this.messageService.add({ severity: 'error', summary: 'Error', detail: "Dados Inválidos"})
       }
     })
    }else{
     this.messageService.add({ severity: 'error', summary: 'Error', detail: "Dados Inválidos"})
    }
   }
}
