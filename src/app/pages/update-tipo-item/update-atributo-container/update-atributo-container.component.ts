import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { createTipoItemAtributo } from 'src/app/shared/models/models';
import { MessageService } from 'primeng/api';
import { UpdateTipoItemComponent } from '../update-tipo-item.component';
import { UpdateTipoItemAtributoServiceService } from '../services/update-tipo-item-atributo-service/update-tipo-item-atributo-service.service';
import { UpdateTipoItemValorServiceService } from '../services/update-tipo-item-valor-service/update-tipo-item-valor-service.service';
import { environment } from 'src/environments/environment.development';
import { TipoItemService } from '../../tipo-item-list/tipo-item-service/tipo-item.service';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from 'src/app/shared/services/loading-service/loading.service';
import { finalize, first } from 'rxjs';


@Component({
  selector: 'app-update-atributo-container',
  templateUrl: './update-atributo-container.component.html',
  styleUrls: ['./update-atributo-container.component.scss']
})
export class UpdateAtributoContainerComponent implements OnInit {
  createConfirmation: boolean = false;
  createConfirmationValue: boolean = false;

  isAble: boolean = false;

  @Output() variavelEvent = new EventEmitter<boolean>();

  @Output() removerIndice: EventEmitter<number> = new EventEmitter<number>;


  callConfirmDialog(){
    this.createConfirmation = !this.createConfirmation
  }

  currentValueId: any
  currentValuePosition: any

  callConfirmValueDialog(i: any, id: string | undefined){
    this.currentValueId = id
    this.currentValuePosition = i
    this.createConfirmationValue = !this.createConfirmationValue
  }

  closeConfirmValueDialog(){
    this.createConfirmationValue = !this.createConfirmationValue
  }


  constructor(
    private tipoItem: TipoItemService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private updateTipoItemComponent: UpdateTipoItemComponent,
    private messageService: MessageService,
    private updateTipoItemAtributoServiceService: UpdateTipoItemAtributoServiceService,
    private updateTipoItemValorServiceService: UpdateTipoItemValorServiceService,
    private loadingService: LoadingService,
  ){}

  valueOption: string = "";

  isValorVisible(event: any){
    this.valueOption = event
  }

  @Input() atributo: any

  //ADICIONAR ATRIBUTO
  addAtributo(){
    this.updateTipoItemComponent.adicionarAtributo()
  }

  //ADIÇÃO DE VALORES
  valores: any = [];

  adicionarValor(){
    this.valores.push({});
  }

  deleteAtributo(){
    this.removerIndice.emit();
    this.createConfirmation = !this.createConfirmation
  }

  removerValor(){
    this.valores.splice(this.currentValuePosition, 1)
    this.updateTipoItemValorServiceService.deleteTipoItemValor(`${environment.BASE_URL}/tipoItemValor/${this.currentValueId}`).subscribe(
      res => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Valor Deletado"})
      }
    )
    this.createConfirmationValue = !this.createConfirmationValue
  }

  public tipoItemIdToUpdate: any
  public tipoItemAtributos: any

  ngOnInit(): void {
    if(this.atributo){
      this.valueOption = this.atributo.selecionavel
    }

    this.createUpdateTipoItemAtributoForm(new createTipoItemAtributo())
    if(this.atributo.excluido !== true){
      this.createUpdateTipoItemAtributoForm(this.atributo)
      if(this.atributo.tipoItemValor){
        this.atributo.tipoItemValor.forEach((valor: any) => {
          if(valor.excluido == false){
            this.valores.push(valor)
          }
          console.log(this.valores)
        })
      }
    }
  }
  
  //TIPO ITEM VALOR
  public submitTipoItemValor(){
    let itensToUpdate: any = []
    const itensToCreate: { valor: string; excluido: boolean; tipo_item_atributo_id: string; }[] = [];
    
    const realValues = this.valores.filter((valor: any) => Object.keys(valor).length !== 0);

    realValues.forEach((objeto: any) =>{
      if(objeto.id !== undefined){
        itensToUpdate.push(objeto)

      }else{
        let createArray: any = []
        createArray.push(objeto)
        
        let valuesToCreate = createArray.map((valores: any) => valores.valor)

        valuesToCreate.forEach( (valor: string | undefined) => {
          let tipoValor: { valor: string; excluido: boolean; tipo_item_atributo_id: string; } = {
            valor: valor!,
            excluido: false,
            tipo_item_atributo_id: this.current_tipo_item_atributo_id!
          }
          itensToCreate.push(tipoValor)
        })
      }
    })
    this.updateTipoItemValorServiceService.updateManyTipoItemValor(
      itensToUpdate
    ).subscribe({
      next: (res) => res,
      error: (err) => err
    })

    this.tipoItem.createManyTipoItemValor(
      itensToCreate
    ).subscribe({
      next: (res) => {
        res.forEach((valor: any) => this.valores.push(valor))
        const objetosComId = this.valores.filter((valor: any) => valor.hasOwnProperty('id'));
        this.valores = objetosComId
      },
      error: (err) => err
    })
  }

  //TIPO ITEM ATRIBUTO
  options: string[] = ['sim', 'não', 'opcional'];

  registerTipoItemAtributoForm!: FormGroup;
  public createUpdateTipoItemAtributoForm(register: createTipoItemAtributo){
    this.registerTipoItemAtributoForm = this.formBuilder.group({
      descricao: [register.descricao, [Validators.required]],
      selecionavel: [register.selecionavel, [Validators.required]],
      unidade: [register.unidade, [Validators.required]],
      sigla: [register.sigla, [Validators.required]],
    })
  }

  public current_tipo_item_atributo_id: string|null = null
  public submitAtributo(){
    // this.registerTipoItemAtributoForm.get("tipo_item_id")?.setValue(this.current_tipo_item_id)
    if(this.registerTipoItemAtributoForm.valid){
      this.loadingService.present();
      if(this.atributo.id !== undefined){
          this.updateTipoItemAtributoServiceService.updateTipoItemAtributo(
          this.atributo.id,
          this.registerTipoItemAtributoForm.value
          ).pipe(first(), finalize(()=> {this.loadingService.dismiss()})).subscribe({
          next: (res: any) => {
            if(res.selecionavel == "não"){
              res.tipoItemValor.forEach((valor: any) => {
                this.updateTipoItemValorServiceService.deleteTipoItemValor(`${environment.BASE_URL}/tipoItemValor/${valor.id}`).subscribe(
                  res => {
                  }
                  )
                })
                this.valores = []
                this.messageService.add({ severity: 'success', summary: 'Success', detail: "Valor(es) Deletado"})
            }
          
            this.current_tipo_item_atributo_id = res.id
            
            this.submitTipoItemValor()

            this.messageService.add({ severity: 'success', summary: 'Success', detail: "Atributo e valor(es) Atualizados"})
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error })
          }
        })
      }else{
        this.tipoItem.createTipoItemAtributo({
          descricao: this.registerTipoItemAtributoForm.value.descricao,
          selecionavel: this.registerTipoItemAtributoForm.value.selecionavel,
          unidade: this.registerTipoItemAtributoForm.value.unidade,
          sigla: this.registerTipoItemAtributoForm.value.sigla,
          excluido: this.registerTipoItemAtributoForm.value.excluido,
          tipo_item_id: this.activatedRoute.snapshot.params['tipo_item_id']
        }).subscribe(
          res => {
            this.current_tipo_item_atributo_id = res.id

            this.atributo = res;

            this.submitTipoItemValor()

            this.current_tipo_item_atributo_id = res.id
            this.variavelEvent.emit(this.isAble);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: "Atributo e valor(es) Cadastrado" })
            this.loadingService.dismiss();
          }
        )
      }
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Dados Inválidos" })
    }
  }

}
