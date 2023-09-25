import { Component, OnInit,EventEmitter,Output,Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { createTipoItemAtributo } from 'src/app/shared/models/models';
import { TipoItemService } from 'src/app/pages/tipo-item-list/tipo-item-service/tipo-item.service';
import { RegisterTipoItemComponent } from '../register-tipo-item.component';
import { MessageService } from 'primeng/api';
import { LoadingService } from 'src/app/shared/services/loading-service/loading.service';
import { UpdateTipoItemValorServiceService } from '../../update-tipo-item/services/update-tipo-item-valor-service/update-tipo-item-valor-service.service';
import { tipoItemValor } from 'src/app/shared/interfaces/tipoItemValor';
import { UpdateTipoItemAtributoServiceService } from '../../update-tipo-item/services/update-tipo-item-atributo-service/update-tipo-item-atributo-service.service';
import { finalize, first } from 'rxjs';
import { environment } from 'src/environments/environment.development';

interface Grupos{
  descricao: string;
}

@Component({
  selector: 'app-atributo-container',
  templateUrl: './atributo-container.component.html',
  styleUrls: ['./atributo-container.component.scss']
})
export class AtributoContainerComponent implements OnInit {
  createConfirmation: boolean = false;
  createConfirmationValue: boolean = false;
  isAble: boolean = true;

  @Output() variavelEvent = new EventEmitter<boolean>();

  @Output() removerIndice: EventEmitter<number> = new EventEmitter<number>;

  callConfirmDialog(){
    this.createConfirmation = !this.createConfirmation
  }

  addAtributoDisabled = false;

  constructor(
    private tipoItem: TipoItemService,
    private formBuilder: FormBuilder,
    private registerTipoItemComponent: RegisterTipoItemComponent,
    private messageService: MessageService,
    private loadingService: LoadingService,
    private updateTipoItemValorServiceService: UpdateTipoItemValorServiceService,
    private updateTipoItemAtributoServiceService: UpdateTipoItemAtributoServiceService,

  ){}

  @Input() atributo: any

  currentAtributoId: string | null = null
  currentValueId: any
  currentValuePosition: any

  valueOption: any

  isValorVisible(event: any){
    this.valueOption = event
  }

  //ADIÇÃO DE VALORES
  valores: any = [];

  adicionarValor(){
    this.valores.push({});
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

  deleteAtributo(){
    this.removerIndice.emit();
    this.updateTipoItemAtributoServiceService.deleteTipoItemAtributo(
      `${environment.BASE_URL}/tipoItemAtributo/${this.currentAtributoId}`).subscribe(
        res => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: "Atributo Deletado" })
        }
    )
    this.createConfirmation = !this.createConfirmation
  }

  ngOnInit(): void {
    this.createTipoItemAtributoForm(new createTipoItemAtributo())

    this.variavelEvent.emit(this.isAble);
  }

  callConfirmValueDialog(i: any, id: string | undefined){
    this.currentValueId = id
    this.currentValuePosition = i
    this.createConfirmationValue = !this.createConfirmationValue
  }

  closeConfirmValueDialog(){
    this.createConfirmationValue = !this.createConfirmationValue
  }

    //TIPO ITEM VALOR (CREATE/UPDATE)
    public submitUpdateTipoItemValor(){
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
              tipo_item_atributo_id: this.currentAtributoId!
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
          const objetosComId = this.valores.filter((valor: any) => valor.hasOwnProperty('id'));
          this.valores = objetosComId
          res.forEach((valor: any) => this.valores.push(valor))
        },
        error: (err) => err
      })
    }

  //TIPO ITEM ATRIBUTO
  options: string[] = ['sim', 'não', 'opcional'];

  registerTipoItemAtributoForm!: FormGroup;
  public createTipoItemAtributoForm(register: createTipoItemAtributo){
    this.registerTipoItemAtributoForm = this.formBuilder.group({
      descricao: [register.descricao, [Validators.required]],
      selecionavel: [register.selecionavel, [Validators.required]],
      unidade: [register.unidade, [Validators.required]],
      sigla: [register.sigla, [Validators.required]],
      tipo_item_id: this.registerTipoItemComponent.current_tipo_item_id
    })
  }

  public submitAtributo(){
    // this.registerTipoItemAtributoForm.get("tipo_item_id")?.setValue(this.current_tipo_item_id)
    if(this.currentAtributoId){
      if(this.registerTipoItemAtributoForm.valid){
        this.loadingService.present();
        this.updateTipoItemAtributoServiceService.updateTipoItemAtributo(
          this.currentAtributoId!, {
            descricao: this.registerTipoItemAtributoForm.value.descricao,
            selecionavel: this.registerTipoItemAtributoForm.value.selecionavel,
            unidade: this.registerTipoItemAtributoForm.value.unidade,
            sigla: this.registerTipoItemAtributoForm.value.sigla
          }
          ).pipe(first(), finalize(()=> {this.loadingService.dismiss()})).subscribe({
          next: (res: any) => {
            this.currentAtributoId = res.id
  
            this.submitUpdateTipoItemValor()

            this.messageService.add({ severity: 'success', summary: 'Success', detail: "Atributo e valor(es) Atualizados"})
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error })
          }
        })
      } else {
        this.tipoItem.createTipoItemAtributo({
          descricao: this.registerTipoItemAtributoForm.value.descricao,
          selecionavel: this.registerTipoItemAtributoForm.value.selecionavel,
          unidade: this.registerTipoItemAtributoForm.value.unidade,
          sigla: this.registerTipoItemAtributoForm.value.sigla,
          excluido: false,
          tipo_item_id: this.registerTipoItemComponent.current_tipo_item_id!,
        }).subscribe(
          res => {
            this.currentAtributoId = res.id
            this.submitUpdateTipoItemValor()
            this.variavelEvent.emit(this.isAble);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: "Atributo e valor(es) Cadastrado" })
            this.loadingService.dismiss();
          }
        )
      }
    } else if(this.registerTipoItemAtributoForm.valid){
      this.loadingService.present();
      this.tipoItem.createTipoItemAtributo({
        descricao: this.registerTipoItemAtributoForm.value.descricao,
        selecionavel: this.registerTipoItemAtributoForm.value.selecionavel,
        unidade: this.registerTipoItemAtributoForm.value.unidade,
        sigla: this.registerTipoItemAtributoForm.value.sigla,
        excluido: false,
        tipo_item_id: this.registerTipoItemComponent.current_tipo_item_id!,
      }).subscribe({
        next: (res) => {
          this.currentAtributoId = res.id
          this.submitUpdateTipoItemValor()
          this.isAble = false;
          this.variavelEvent.emit(this.isAble);
          this.createTipoItemAtributoForm(res)
          this.messageService.add({ severity: 'success', summary: 'Success', detail: "Atributo e valor(es) Cadastrado" })
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Dados Inválidos" })
        },
        complete: () => {
          this.loadingService.dismiss();
        },
      })
    }else{
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Dados Inválidos" })
    }
  }

}
