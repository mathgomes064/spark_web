import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { createPropriedade, updatePropriedade } from 'src/app/shared/models/models';
import { PropertiesService } from 'src/app/pages/propriedades/properties-service/properties.service';
import { environment } from 'src/environments/environment.development';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { AnexoService } from 'src/app/shared/services/anexo-service/anexo.service';
import { LoadingService } from 'src/app/shared/services/loading-service/loading.service';
import { ProprietarioService } from '../../proprietario/proprietario-service/proprietario.service';
import { finalize, first } from 'rxjs';

interface Grupos{
  id: string,
  nome: string;
}

@Component({
  selector: 'app-propriedade-container',
  templateUrl: './propriedade-container.component.html',
  styleUrls: ['./propriedade-container.component.scss']
})
export class PropriedadeContainerComponent implements OnInit {
  createVisible: boolean = false;
  updateVisable: boolean = false;
  detailVisable: boolean = false;
  createConfirmation: boolean = false;

  slideConfig = {"slidesToShow": 3, "slidesToScroll": 3};

  showCreateModal(){
    this.createVisible = !this.createVisible
  }

  showUpdateModal(propriedade: any, id: string | undefined){
    this.updateVisable = !this.updateVisable
    this.propriedadeIdToUpdate = id
  
    this.anexoService.getAnexosById(id!).subscribe(
        res => {
          this.imagens = res
        }
    )
    this.createUpdatePropriedadeForm(propriedade)
  }

  public propriedadeIdToUpdate: string | undefined

  detailImg: any | undefined;
  previewSrc: any[] = [];
  previewDocuments: any[] = [];
  previewDocumentsToUpload: any[] = [];
  imagens: any[] | undefined;

  constructor(
    private properties: PropertiesService,
    private proprietarios: ProprietarioService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private http: HttpClient,
    private anexoService: AnexoService,
    private loadingService: LoadingService,
  ) {}

  private setPropriedades: any
  public getPropriedades: any

  grupos: Grupos[] = [];

  ngOnInit(){
    this.proprietarios.getProprietarios().subscribe(
      res =>{
        res.forEach((objeto: any) => {
          const { id, nome } = objeto;
          this.grupos.push({ id, nome });
        });
      }
    )
    this.getAllProperties()
    this.createPropriedadeForm(new createPropriedade())
    this.createUpdatePropriedadeForm(new updatePropriedade())
  }
  
  getAllProperties() {
    this.properties.getProperties().subscribe(
      res =>{
        this.setPropriedades = res
        this.getPropriedades = this.setPropriedades
      }
    )
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
    this.previewSrc = []
    this.registerPropriedadeForm.reset()
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
    formData.append("ref", "Propriedade");

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

  registerPropriedadeForm!: FormGroup
  public createPropriedadeForm(register: createPropriedade){
    this.registerPropriedadeForm = this.formBuilder.group({
      nome: [register.nome, [Validators.required]],
      numero: [register.numero, [Validators.required]],
      logradouro: [register.logradouro, [Validators.required]],
      bairro: [register.bairro, [Validators.required]],
      cidade: [register.cidade, [Validators.required]],
      estado: [register.estado, [Validators.required]],
      complemento: [register.complemento, [Validators.required]],
      cep: [register.cep, [Validators.required]],
      proprietario: [register.proprietario, [Validators.required]],
    })
  }

  public currentePropertyId: any
  public submitRegisterPropriedadeForm(){
    if(this.registerPropriedadeForm.valid){
      this.loadingService.present(); 
      this.properties.registerProperties({
        nome: this.registerPropriedadeForm.value.nome,
        numero: this.registerPropriedadeForm.value.numero,
        logradouro: this.registerPropriedadeForm.value.logradouro,
        bairro: this.registerPropriedadeForm.value.bairro,
        cidade: this.registerPropriedadeForm.value.cidade,
        estado: this.registerPropriedadeForm.value.estado,
        complemento: this.registerPropriedadeForm.value.complemento,
        cep: this.registerPropriedadeForm.value.cep,
        proprietario: this.registerPropriedadeForm.value.proprietario.id,
      }).pipe(first(), finalize(()=> {this.loadingService.dismiss()})).subscribe({
        next: (res) => {
          this.currentePropertyId = res.id
          this.uploadPropriedadeFile(res.id)
          this.getPropriedades.push(res)
          this.registerPropriedadeForm.reset()
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Propriedade Cadastrada' });
          this.createVisible = !this.createVisible
          this.previewSrc = [];
          this.getAllProperties();
        },
        error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error })
        }
      })
    }else{
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Dados Inválidos" })
    }
  }

  updatePropriedadeForm!: FormGroup
  public createUpdatePropriedadeForm(register: updatePropriedade){
    this.updatePropriedadeForm = this.formBuilder.group({
      nome: [register.nome, [Validators.required]],
      numero: [register.numero, [Validators.required]],
      logradouro: [register.logradouro, [Validators.required]],
      bairro: [register.bairro, [Validators.required]],
      cidade: [register.cidade, [Validators.required]],
      estado: [register.estado, [Validators.required]],
      complemento: [register.complemento, [Validators.required]],
      cep: [register.cep, [Validators.required]],
      proprietario: [register.proprietario, [Validators.required]],
    })
  }

  public submitUpdatePropriedadeForm(){
    if(this.updatePropriedadeForm.valid){
      this.loadingService.present();
      this.properties.updatePropriedade(this.propriedadeIdToUpdate!, {
        nome: this.updatePropriedadeForm.value.nome,
        numero: this.updatePropriedadeForm.value.numero,
        logradouro: this.updatePropriedadeForm.value.logradouro,
        bairro: this.updatePropriedadeForm.value.bairro,
        cidade: this.updatePropriedadeForm.value.cidade,
        estado: this.updatePropriedadeForm.value.estado,
        complemento: this.updatePropriedadeForm.value.complemento,
        cep: this.updatePropriedadeForm.value.cep,
        proprietario: this.updatePropriedadeForm.value.proprietario.id,
      }).pipe(first(), finalize(()=> {this.loadingService.dismiss()})).subscribe({
        next: (res: any) => {
          this.uploadPropriedadeFile(res.id)
          this.updatePropriedadeForm.reset();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Propriedade Editada' });
          this.updateVisable = !this.updateVisable;
          this.previewSrc = [];
          this.getAllProperties();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error });
        }
      })
    }else{
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Dados Inválidos" });
    }
  }

  public search(value: string){
    const filter = this.setPropriedades.filter((res: any) =>{
      return !res.nome.toLowerCase().indexOf(value.toLowerCase());
    })
    this.getPropriedades = filter;
  }
}

