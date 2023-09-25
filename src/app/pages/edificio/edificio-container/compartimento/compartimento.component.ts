import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { createComparitmento } from 'src/app/shared/models/models';
import { LoadingService } from 'src/app/shared/services/loading-service/loading.service';
import { MessageService } from 'primeng/api';
import { AnexoService } from 'src/app/shared/services/anexo-service/anexo.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { InnerEdificioService } from '../edificio/inner-edificio-service/inner-edificio.service';
import { InnerCompartimentoService } from './inner-compartimento-service/inner-compartimento.service';
import { finalize, first } from 'rxjs';


@Component({
  selector: 'app-compartimento',
  templateUrl: './compartimento.component.html',
  styleUrls: ['./compartimento.component.scss']
})
export class CompartimentoComponent implements OnInit {
  public createVisible: boolean = false
  public detailVisable: boolean = false;
  public createConfirmation: boolean = false;
  public createOrEdit: boolean = false;

  public slideConfig = {"slidesToShow": 3, "slidesToScroll": 3};

  public setEdificios: any

  public previewSrc: any[] = [];
  public previewDocuments: any[] = [];
  public previewDocumentsToUpload: any[] = [];
  public detailImg: any | undefined;
  public imagens: any[] | undefined;

  // public edificios: any
  public compartimentos: any
  public edificiosToFilter: Array<any> = [];
  public currentCompartimento_id: any

  constructor(
    private innerEdificioService: InnerEdificioService,
    private innerCompartimentoService: InnerCompartimentoService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private messageService: MessageService,
    private anexoService: AnexoService,
    private http: HttpClient,
  ){}

  ngOnInit(): void {
    this.listarEdificios()
    this.listarCompartimentos()
    this.createCompartimentoForm(new createComparitmento())
  }

  openCompartimentoToUpdate(compartimento: any, comp_id: string | undefined) {
    this.createOrEdit = true
    this.createVisible = true;
    this.currentCompartimento_id = comp_id;
    
    this.anexoService.getAnexosById(comp_id!).subscribe(
        res => {
          this.imagens = res;
        }
    );

    this.createCompartimentoForm(compartimento);
  }
  
  showDetailDocument(url: string){
    window.open(url)
  }

  async base64ToBlob(url: string,): Promise<Blob> {
    const response = await fetch(url);
    const blob = await response.blob();
    return blob;
  }

  async showHardDetailDocument(url: string){
    const blob = await this.base64ToBlob(url)
    const linkUrl = URL.createObjectURL(blob);
    this.showDetailDocument(linkUrl)
  }

  showDetailImage(imagem_atual:any){
    this.detailVisable = !this.detailVisable
    this.detailImg = imagem_atual
  }

  removeFromPreview(index: number){
    this.previewSrc.splice(index, 1)
    this.previewDocuments.splice(index, 1)
    this.previewDocumentsToUpload.splice(index, 1)
  }

  removePreview(){
    this.imagens = []
    this.previewSrc = []
    this.createVisible = false
    this.createOrEdit = false
    this.currentCompartimento_id = ""
    this.compartimentoForm.reset()
  }

  currentImage: any
  currentPosition: any

  showCreateConfirmation(image: any, i: any){
    this.currentImage = image;
    this.currentPosition = i;
    this.createConfirmation = !this.createConfirmation
  }

  cancelCreateConfirmation(){
    this.createConfirmation = !this.createConfirmation
  }

  softDeleteImage(){
    this.anexoService.softDeleteAnexos(this.currentImage.id).subscribe({
      next: (value) => {
        this.currentImage.excluido = true
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Imagem Deletada' });
      },
    })
    this.imagens!.splice(this.currentPosition, 1);
    this.createConfirmation = !this.createConfirmation
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
    formData.append("ref", "Compartimento");

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

  compartimentoForm!: FormGroup
  public createCompartimentoForm(register: createComparitmento){
    this.compartimentoForm = this.formBuilder.group({
      descricao: [register.descricao, [Validators.required]],
      largura: [register.largura, [Validators.required]],
      comprimento: [register.comprimento, [Validators.required]],
      andar_compartimento: [register.andar_compartimento, [Validators.required]],
      edificio: [register.edificio, [Validators.required]],
    })
  }

  submitCompartimentoForm(){
    if(this.currentCompartimento_id){
      if(this.compartimentoForm.valid){
        this.loadingService.present(); 
        this.innerCompartimentoService.editCompartimentos(
          this.currentCompartimento_id, {
              descricao: this.compartimentoForm.value.descricao,
              largura: this.compartimentoForm.value.largura,
              comprimento: this.compartimentoForm.value.comprimento,
              andar_compartimento: this.compartimentoForm.value.andar_compartimento,
              edificio: this.compartimentoForm.value.edificio.id
            }
          ).pipe(first(), finalize(()=> {this.loadingService.dismiss()})).subscribe({
          next: (res) =>{
            this.uploadPropriedadeFile(res.id)
            this.previewSrc = [];
            this.createVisible = false
            this.listarCompartimentos()
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Compartimento Atualizado' });
          },
          error: (err) =>{
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error })
          }
        })
      }else{
        this.innerCompartimentoService.createCompartimentos({
          descricao: this.compartimentoForm.value.descricao,
          largura: this.compartimentoForm.value.largura,
          comprimento: this.compartimentoForm.value.comprimento,
          andar_compartimento: this.compartimentoForm.value.andar_compartimento,
          edificio: this.compartimentoForm.value.edificio.id
        }).subscribe(
          res => {
            this.uploadPropriedadeFile(res.id)
            this.listarCompartimentos()
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Compartimento Criado' });
            this.loadingService.dismiss();
          }
        )
      }
    }else if(this.compartimentoForm.valid){
      this.loadingService.present();
      this.innerCompartimentoService.createCompartimentos({
        descricao: this.compartimentoForm.value.descricao,
        largura: this.compartimentoForm.value.largura,
        comprimento: this.compartimentoForm.value.comprimento,
        andar_compartimento: this.compartimentoForm.value.andar_compartimento,
        edificio: this.compartimentoForm.value.edificio.id
      }).subscribe({
        next: (res: any) => {
          this.uploadPropriedadeFile(res.id)
          this.createVisible = false
          this.listarCompartimentos()
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Compartimento Criado' });
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Dados Inválidos" })
        },
        complete: () =>{
          this.loadingService.dismiss();
        }
      })
    }else{
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Dados Inválidos" })
    }
  }


  public edfParaAtualizar: any = []

  listarEdificios(){
    this.innerEdificioService.getEdificio(this.activatedRoute.snapshot.params['prop_id']).subscribe(
      res =>{
        res.forEach((objeto: any) => {
          const { id, nome } = objeto;
          this.edificiosToFilter.push({ id, nome });
          this.edfParaAtualizar.push({id, nome})
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

  intersection: any = []

  filtrarCompartimentosByEdificioId(edf_id: string){
    edf_id == "-1"? this.listarCompartimentos() : 

    this.innerCompartimentoService.getCompartimentosByEdf(edf_id).subscribe(
      res =>{
        this.compartimentos = res
      }
    )

  }


}
