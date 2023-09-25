import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { createEdificio } from 'src/app/shared/models/models';
import { LoadingService } from 'src/app/shared/services/loading-service/loading.service';
import { finalize, first } from 'rxjs';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { AnexoService } from 'src/app/shared/services/anexo-service/anexo.service';
import { InnerEdificioService } from './inner-edificio-service/inner-edificio.service';

@Component({
  selector: 'app-edificio-tab',
  templateUrl: './tab-edificio.component.html',
  styleUrls: ['./tab-edificio.component.scss']
})
export class TabEdificioComponent implements OnInit {
  public createVisible: boolean = false
  public detailVisable: boolean = false;
  public createConfirmation: boolean = false;
  public createOrEdit: boolean = false;


  public slideConfig = {"slidesToShow": 3, "slidesToScroll": 3};

  public edificios: any
  public setEdificios: any

  public previewSrc: any[] = [];
  public previewDocuments: any[] = [];
  public previewDocumentsToUpload: any[] = [];
  public detailImg: any | undefined;
  public imagens: any[] | undefined;

  constructor(
    private innerEdificioService: InnerEdificioService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private messageService: MessageService,
    private anexoService: AnexoService,
    private http: HttpClient,
  ){}

  ngOnInit(): void {
    this.listarEdificios()
    this.createEdificioForm(new createEdificio())
  }

  public currentEdificio_id: any
  openEdificioToUpdate(edf_id: string, data: any){
    this.createOrEdit = true
    this.currentEdificio_id = edf_id
    this.createVisible = true

    this.anexoService.getAnexosById(edf_id).subscribe(
      res => {
        this.imagens = res
      }
  )

    this.createEdificioForm(data)
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
    this.currentEdificio_id = ""
    this.edificioForm.reset()
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
    formData.append("ref", "Edificio");

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

  edificioForm!: FormGroup
  public createEdificioForm(register: createEdificio){
    this.edificioForm = this.formBuilder.group({
      nome: [register.nome, [Validators.required]],
      descricao: [register.descricao, [Validators.required]],
      largura: [register.largura, [Validators.required]],
      comprimento: [register.comprimento, [Validators.required]],
      pavimento: [register.pavimento, [Validators.required]],
      subsolo: [register.subsolo, [Validators.required]],
      propriedade_id: this.activatedRoute.snapshot.params['prop_id']
    })
  }

  submitEdificioForm(){
    this.edificioForm.get("propriedade_id")?.setValue(this.activatedRoute.snapshot.params['prop_id'])
    if(this.currentEdificio_id){
      if(this.edificioForm.valid){
        this.loadingService.present(); 
        this.innerEdificioService.updateBulding(
          this.currentEdificio_id, {
            nome: this.edificioForm.value.nome,
            descricao: this.edificioForm.value.descricao,
            largura: this.edificioForm.value.largura,
            comprimento: this.edificioForm.value.comprimento,
            pavimento: this.edificioForm.value.pavimento,
            subsolo: this.edificioForm.value.subsolo
          }
        ).pipe(first(), finalize(()=> {this.loadingService.dismiss()})).subscribe({
          next: (res) =>{
            this.uploadPropriedadeFile(res.id)
            this.previewSrc = [];
            this.listarEdificios()
            this.createVisible = false
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Edificio Atualizado' });
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error })
          }
        })
    }else{
      this.innerEdificioService.createBuilding(
        this.edificioForm.value
      ).subscribe(
        res => {
          this.uploadPropriedadeFile(res.id)
          this.previewSrc = [];
          this.listarEdificios()
          this.createVisible = false
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Edificio Criado' });
          this.loadingService.dismiss();
        }
      )
    }
    }else if(this.edificioForm.valid){
      this.loadingService.present();
      this.innerEdificioService.createBuilding(
        this.edificioForm.value
      ).subscribe({
        next: (res: any) =>{
          this.listarEdificios()
          this.uploadPropriedadeFile(res.id)
          this.createVisible = false
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Edificio Criado' });
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error })
        },
        complete: () => {
          this.loadingService.dismiss();
        },
      })
    }else{
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Dados Inválidos" })
    }
  }

  listarEdificios(){
    this.innerEdificioService.getEdificio(this.activatedRoute.snapshot.params['prop_id']).subscribe(
      res =>{
        this.setEdificios = res
        this.edificios = this.setEdificios
      }
    )
  }

  public search(value: string){
    const filter = this.setEdificios.filter((res: any) =>{
      return !res.nome.toLowerCase().indexOf(value.toLowerCase());
    })
    this.edificios = filter;
  }

}
