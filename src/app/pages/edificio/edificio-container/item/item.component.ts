import { createTipoItemAtributo, itemValue } from './../../../../shared/models/models';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InnerEdificioService } from '../edificio/inner-edificio-service/inner-edificio.service';
import { InnerCompartimentoService } from '../compartimento/inner-compartimento-service/inner-compartimento.service';
import { InnerQuadroService } from '../quadro/inner-quadro-service/inner-quadro.service';
import { InnerItemService } from './inner-item-service/inner-item.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { item } from 'src/app/shared/models/models';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { AnexoService } from 'src/app/shared/services/anexo-service/anexo.service';
import { LoadingService } from 'src/app/shared/services/loading-service/loading.service';
import { finalize, first } from 'rxjs';

interface TipoItem{
  id: string;
  descricao: string
}

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit{
  public createVisible: boolean = false;
  public detailVisable: boolean = false;
  public createConfirmation: boolean = false;
  public previewSrc: any[] = [];
  public imagens: any[] | undefined;
  public previewDocuments: any[] = [];
  public previewDocumentsToUpload: any[] = [];
  public detailImg: any | undefined;
  public currentImage: any
  public currentPosition: any
  public currentItemId: any

  public edificios: any

  public compartimentos: any

  public quadros: any

  public itens: any

  public currentEdificioId: any
  
  slideConfig = {"slidesToShow": 3, "slidesToScroll": 3};
  
  public edificiosToFilter: Array<any> = [];
  public compartimentosToFilter: Array<any> = [];

  constructor(
    private innerEdificioService: InnerEdificioService,
    private innerCompartimentoService: InnerCompartimentoService,
    private innerQuadroService: InnerQuadroService,
    private innerItemService: InnerItemService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private http: HttpClient,
    private anexoService: AnexoService,
    private loadingService: LoadingService,
  ){}

  ngOnInit(): void {
    this.listarEdificios()
    this.listarCompartimentos()
    this.listarQuadros()
    this.listarItens()

    this.createItemForm(new item())
  }

  //PEGA O ID E DESCRICAO DO TIPOITEM E JOGA NO DROPDOWN

  public tipoItem: TipoItem[] = []
  openItemToCreate(){
    this.createTipoItemSelection()
    this.createVisible = true;
  }

  createTipoItemSelection(){
    this.innerItemService.getTipoItem().subscribe(
      res =>{
        res.forEach((object: any) => {
          const {id, descricao} = object;
          this.tipoItem.push({id, descricao})
        })
      }
    )
  }

  //FILTRA TIPOITEMATRIBURO DO TIPO ITEM SELECIONADO
  public itemAtributodToRegister: any[] = []
  public itemAtributoToUpdate: any[] = []
  filtrarTipoItemAtributo(tipo_item_id: string){
    if(this.currentItemId){
      this.innerItemService.getTipoItemById(tipo_item_id).subscribe(
        res => {
          this.itemAtributoToUpdate = res.tipoItemAtributo
          this.itemAtributoToUpdate.forEach((item, index)=>{
            item.valor = this.oldItemValor[index].valor
          })
        }
      )      
    }else{
      this.innerItemService.getTipoItemById(tipo_item_id).subscribe(
        res => {
          this.itemAtributodToRegister = res.tipoItemAtributo
        }
      )
    }

  }

  //PEGA O ITEM PARA ATUALIZAÇÃO
  public oldItemValor: any[] = []

  openItemToUpdate(item_id: string){
    this.createTipoItemSelection()
    this.currentItemId = item_id

    this.innerItemService.getItemById(item_id).subscribe(
      res => {
        this.createItemForm(res)
        this.oldItemValor = res.itemAtributos.flatMap((objeto: any) => objeto.itemValor)
        this.filtrarTipoItemAtributo(res.tipo_item_id.id)
      }
    )

    this.anexoService.getAnexosById(item_id!).subscribe(
      res => {
        this.imagens = res;
      }
    );
    this.createVisible = true;
  }

  itemForm!: FormGroup;
  public createItemForm(register: item){
    this.itemForm = this.formBuilder.group({
      compartimentoId: [register.compartimento_id, [Validators.required]],
      tipo_item_id: [register.tipoItem_id, [Validators.required]],
      descricao: [register.descricao, [Validators.required]],
      quantidade: [register.quantidade, [Validators.required]],
    })
  }

  submitItem(){
    const payloadToCreate: any = {
      descricao: this.itemForm.value.descricao,
      quantidade: this.itemForm.value.quantidade,
      compartimentoId: this.itemForm.value.compartimentoId,
      tipo_item_id: this.itemForm.value.tipo_item_id,
      inputs : this.itemAtributodToRegister
    }

    const payloadToUpdate = this.oldItemValor.map((item, index) => ({
      id: item.id,
      valor: this.itemAtributoToUpdate[index].valor
    }));

    if(this.currentItemId){
      if(this.itemForm.value.descricao || this.itemForm.value.quantidade){
        this.loadingService.present(); 
        this.innerItemService.ItemUpdate(
          this.currentItemId, this.itemForm.value
        ).pipe(first(), finalize(()=> {this.loadingService.dismiss()})).subscribe({
          next: (res: any) =>{
            this.listarItens()
            for (let i = payloadToUpdate.length - 1; i >= 0; i--) {
              if (payloadToUpdate[i].valor === undefined) {
                payloadToUpdate.splice(i, 1);
              }
            }
            this.innerItemService.ItemValueUpdate(payloadToUpdate).subscribe(
              res =>{
                this.listarItens()
              }
            )
            this.uploadPropriedadeFile(res.id)
            this.compartimentosToFilter.splice(0, this.compartimentosToFilter.length)
            this.previewSrc = [];
            this.createVisible = false
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Item Atualizado' });
          },
          error: (err) =>{
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Dados Inválidos' })
          }
        })
      }
    }else if(this.itemForm.valid){
      let control = true
      payloadToCreate.inputs.forEach((item: any) => {
        if (!item.hasOwnProperty('valor')) {
          control=control&&false
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Dados Inválidos' })
        }
      });

      if(control){
        this.loadingService.present();
        this.innerItemService.addItem(payloadToCreate).subscribe({
          next: (res: any) =>{
            this.listarItens()
            this.uploadPropriedadeFile(res.id)
            this.compartimentosToFilter.splice(0, this.compartimentosToFilter.length)
            this.previewSrc = [];
            this.createVisible = false
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Item Criado' });
          },
          error: (err) =>{
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Dados Inválidos" })
          },
          complete: () =>{
            this.loadingService.dismiss();
          }
        })
      }
    }else{
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Dados Inválidos" })
    }
  }

  removePreview(){
    this.tipoItem = []
    this.imagens = []
    this.previewSrc = []
    this.itemAtributodToRegister = []
    this.itemForm.reset()
    this.currentItemId = ""
    this.createVisible = false
  }

















































  async base64ToBlob(url: string,): Promise<Blob> {
    const response = await fetch(url);
    const blob = await response.blob();
    return blob;
  }

  removeFromPreview(index: number){
    this.previewSrc.splice(index, 1)
    this.previewDocuments.splice(index, 1)
    this.previewDocumentsToUpload.splice(index, 1)
  }

  showDetailImage(imagem_atual:any){
    this.detailVisable = !this.detailVisable
    this.detailImg = imagem_atual
  }

  async showHardDetailDocument(url: string){
    const blob = await this.base64ToBlob(url)
    const linkUrl = URL.createObjectURL(blob);
    this.showDetailDocument(linkUrl)
  }

  showCreateConfirmation(image: any, i: any){
    this.currentImage = image;
    this.currentPosition = i;
    this.createConfirmation = !this.createConfirmation
  }

  showDetailDocument(url: string){
    window.open(url)
  }

  @ViewChild("fileInput", {static: false}) fileInput!: ElementRef;

  handleFileInput(fileEvent:any){
    let files = fileEvent.target.files as FileList

    const images = this.fileInput.nativeElement.files;
    // this.previewDocuments = [...images];
    this.previewDocuments.push(images);

    let newPreviewDocuments: any = [];

    this.previewDocuments.forEach(function(fileList) {
      for (var i = 0; i < fileList.length; i++) {
        if (fileList.hasOwnProperty(i) && fileList[i] instanceof File) {
          newPreviewDocuments.push(fileList[i]);
        }
      }
    });

    this.previewDocumentsToUpload = newPreviewDocuments

    let reader = new FileReader()

    let i = 0

    reader.readAsDataURL(files[i])

    reader.onload = ((e:any)=>{
      this.previewSrc.push({nome: files[i].name, type: files[i].type, url: e.target.result});
    })

    reader.onloadend = () => {
      i++
      if(i < files.length)
        reader.readAsDataURL(files[i])
    }
}

  uploadPropriedadeFile(id: string) {
    if (this.previewDocumentsToUpload.length === 0) {
      console.log("Nenhuma imagem selecionada.");
      return;
    }

    const formData = new FormData();

    formData.append("id_ref", id);
    formData.append("ref", "Item");

    for (let i = 0; i < this.previewDocumentsToUpload.length; i++) {
      formData.append("files", this.previewDocumentsToUpload[i]);
    }

    this.http.post(`${environment.BASE_URL}/`, formData).subscribe(
      res => {
        this.previewDocumentsToUpload = []
        this.previewDocuments=[]
      }
    );
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

  public flatAtributo(item: any){
    const tipoItemValor = item.itemAtributos.flatMap((item:any) => item)
    let currentTipoItemAtributo: any = []
    tipoItemValor.forEach((valor: any) => {
        currentTipoItemAtributo.push(valor)
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
  
  public flatAtributoValues(item: any){
    const tipoItemAtributo = item.itemAtributos.flatMap((item:any) => item)
    
    let availablesAtributos: any = []
    tipoItemAtributo.forEach((valor: any) => {
        availablesAtributos.push(valor)
    })

    const tipoItemValor = availablesAtributos.flatMap((item:any) => item.itemValor)
    
    let currentTipoItemValor: any = []
    tipoItemValor.forEach((valor: any) => {
        currentTipoItemValor.push(valor)
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
