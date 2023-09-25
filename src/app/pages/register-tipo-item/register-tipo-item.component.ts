import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { createGrupo, createTipoItem, createTipoItemAtributo } from 'src/app/shared/models/models';
import { TipoItemService } from 'src/app/pages/tipo-item-list/tipo-item-service/tipo-item.service';
import { MessageService } from 'primeng/api';
import { LoadingService } from 'src/app/shared/services/loading-service/loading.service';
import { finalize, first } from 'rxjs';
import { NonNullAssert } from '@angular/compiler';
import { AtributoContainerComponent } from './atributo-container/atributo-container.component';
import { UpdateTipoItemServiceService } from '../update-tipo-item/services/update-tipo-item-service/update-tipo-item-service.service';
import { environment } from 'src/environments/environment.development';
import { UpdateTipoItemAtributoServiceService } from '../update-tipo-item/services/update-tipo-item-atributo-service/update-tipo-item-atributo-service.service';

interface Grupos{
  id: string,
  descricao: string;
}
interface Linha{
  descricao: string;
}
@Component({
  selector: 'app-register-tipo-item',
  templateUrl: './register-tipo-item.component.html',
  styleUrls: ['./register-tipo-item.component.scss']
})
export class RegisterTipoItemComponent implements OnInit{
  createGrupo: boolean = false;

  constructor(
    private tipoItem: TipoItemService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private loadingService: LoadingService,
    private updateTipoItemServiceService: UpdateTipoItemServiceService,
    private updateTipoItemAtributoService: UpdateTipoItemAtributoServiceService,
  ){
    
  }
  
  variavelRecebida: boolean = true;

  receberVariavel(event:any) {
    this.variavelRecebida = event;
  }
  
  showCreateModal(){
    this.createGrupo = !this.createGrupo
  }

  //ADIÇAO DE ATRIBUTOS
  atributos: any[] = []

  adicionarAtributo(){
    this.atributos.push({})
    this.variavelRecebida = true
  }

  softRemoveAtributo(index: number){
    this.atributos.splice(index, 1)
    this.variavelRecebida = false
  }

  grupos: Grupos[] = [];
  linha: Linha[] = [
    {descricao: "Branca"},
    {descricao: "Azul"},
    {descricao: "Verde"},
    {descricao: "Marron"}
  ];

  ngOnInit(): void {
    console.log(this.grupos)
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

    this.createTipoItemForm(new createTipoItem())
    this.createGrupoForm(new createGrupo())
  }

  //TIPO ITEM (CREATE / UPDATE)
  registerTipoItemForm!: FormGroup;
  public createTipoItemForm(register: createTipoItem){
    this.registerTipoItemForm = this.formBuilder.group({
      descricao: [register.descricao, [Validators.required]],
      linha: [register.linha, [Validators.required]],
      excluido: false,
      grupo_id: [register.grupo_id, [Validators.required]]
    })
  }

  //CRIAÇÃO TIPO ITEM
  public current_tipo_item_id :string | null = null
  public submitTipoItemForm(){
    if(this.current_tipo_item_id){
      if(this.registerTipoItemForm.valid){
        this.loadingService.present();
        this.updateTipoItemServiceService.updateTipoItem(
          this.current_tipo_item_id!, {
            descricao: this.registerTipoItemForm.value.descricao,
            linha: this.registerTipoItemForm.value.linha.descricao,
            grupo_id: this.registerTipoItemForm.value.grupo_id.id
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
    } else if(this.registerTipoItemForm.valid){
      this.loadingService.present();
      this.tipoItem.createTipoItem({
        descricao: this.registerTipoItemForm.value.descricao,
        linha: this.registerTipoItemForm.value.linha.descricao,
        excluido: false,
        grupo_id: this.registerTipoItemForm.value.grupo_id.id,
      }).pipe(first(), finalize(()=> {this.loadingService.dismiss()})).subscribe({
        next: (res) => {
          this.updateTipoItemServiceService.getTipoItemWithGroupById(`${environment.BASE_URL}/tipoItem/gr/${res.id}`).subscribe(
            res =>{
              this.createTipoItemForm(res)
            }
          )
          this.current_tipo_item_id = res.id
          this.atributos.push({})
          this.messageService.add({ severity: 'success', summary: 'Success', detail: "Tipo Item Cadastrado" })
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
      this.createGrupo = !this.createGrupo
      this.registerTipoItemForm.controls['grupo_id'].setValue(null);
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
  public submitGrupoForm() {
    if (this.registerGrupoForm.value.descricao !== "") {
      this.loadingService.present();
      const grupoId = this.registerGrupoForm.value.grupo_id?.id || "";
  
      this.tipoItem.createGrupo({
        descricao: this.registerGrupoForm.value.descricao,
        excluido: this.registerGrupoForm.value.excluido,
        grupo_id: grupoId
      }).pipe(
        first(),
        finalize(() => {
          this.loadingService.dismiss();
        })
      ).subscribe({
        next: (res) => {
          let item = this.grupos.pop();
          this.grupos.push(res);
          this.grupos.push(item!);
          this.registerGrupoForm.reset();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: "Grupo Cadastrado" });
          this.createGrupo = !this.createGrupo;
          this.registerGrupoForm.patchValue({ excluido: false });
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Dados Inválidos" });
        }
      });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Dados Inválidos" });
    }
  }
  
}
