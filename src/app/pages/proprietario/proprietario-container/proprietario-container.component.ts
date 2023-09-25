import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { createProprietario, updateProprietario } from 'src/app/shared/models/models';
import { ProprietarioService } from '../proprietario-service/proprietario.service';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { AnexoService } from 'src/app/shared/services/anexo-service/anexo.service';
import { LoadingService } from 'src/app/shared/services/loading-service/loading.service';
import { finalize, first } from 'rxjs';

@Component({
  selector: 'app-proprietario-container',
  templateUrl: './proprietario-container.component.html',
  styleUrls: ['./proprietario-container.component.scss']
})
export class ProprietarioContainerComponent implements OnInit {
  private setCurrentProprietarios: any
  public getCurrentProprietarios: any

  createVisible: boolean = false;
  updateVisible: boolean = false;
  detailVisable: boolean = false;
  createConfirmation: boolean = false;

  slideConfig = {"slidesToShow": 3, "slidesToScroll": 3};

  showCreateModal(){
    this.createVisible = !this.createVisible
  }

  removePreview(){
    this.previewSrc = []
    this.registerProprietarioForm.reset()
  }

  public proprietarioIdToUpdate: string | undefined;

  detailImg: any | undefined;
  options: string[] = ["Pessoa Física", "Pessoa Jurídica"];
  previewSrc: any[] = [];
  previewDocuments: any[] = [];
  previewDocumentsToUpload: any[] = [];
  documents: any[] = [];

  showUpdateModal(proprietario: any, id: string | undefined){
    this.updateVisible = !this.updateVisible
    this.proprietarioIdToUpdate = id;
    this.selectedOption = proprietario.tipo_pessoa
    this.anexoService.getAnexosById(id!).subscribe(
      res =>{
        this.documents = res
      }
    )
    this.createUpdateProprietarioForm(proprietario)
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
    this.showDetailDocument(linkUrl);
  }

  showDetailImage(imagem_atual:any){
    this.detailVisable = !this.detailVisable
    this.detailImg = imagem_atual
  }

  selectedOption: string = this.options[0];

  constructor(
    private formBuilder: FormBuilder,
    private proprietarioService: ProprietarioService,
    private messageService: MessageService,
    private http: HttpClient,
    private anexoService: AnexoService,
    private loadingService: LoadingService,
  ){}

  onOptionChange(): void {
    console.log(this.selectedOption);
  }

  ngOnInit(): void {
    this.getAllProprietarios()
    this.createProprietarioForm(new createProprietario())
    this.createUpdateProprietarioForm(new updateProprietario())
  }

  getAllProprietarios(){
    this.proprietarioService.getProprietarios().subscribe(
      res =>{
        this.setCurrentProprietarios = res
        this.getCurrentProprietarios = this.setCurrentProprietarios
      }
    )
  }

  removeFromPreview(index: number){
    this.previewSrc.splice(index, 1);
    this.previewDocuments.splice(index, 1);
    this.previewDocumentsToUpload.splice(index, 1);
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
          setTimeout(() => {
            this.messageService.clear();
          }, 3000);
      },
    })
    this.documents.splice(this.currentPosition, 1)
    this.createConfirmation = !this.createConfirmation
  }

  registerProprietarioForm!: FormGroup
  public createProprietarioForm(register: createProprietario){
    this.registerProprietarioForm = this.formBuilder.group({
      nome: [register.nome, [Validators.required]],
      cpf_cnpj: [register.cpf_cnpj, [Validators.required]],
      email: [register.email, [Validators.required, Validators.email]],
      celular: [register.celular, [Validators.required]],
    })
  }

  registerUpdateProprietarioForm!: FormGroup
  public createUpdateProprietarioForm(register: updateProprietario){
    this.registerUpdateProprietarioForm = this.formBuilder.group({
      nome: [register.nome, [Validators.required]],
      cpf_cnpj: [register.cpf_cnpj, [Validators.required]],
      email: [register.email, [Validators.required, Validators.email]],
      celular: [register.celular, [Validators.required]],
    })
  }

  @ViewChild("fileInput", {static: false}) fileInput!: ElementRef;

  handleFileInput(fileEvent: any){
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

      let i=0

      reader.readAsDataURL(files[i])

      reader.onload = ((e: any)=>{
        this.previewSrc.push({nome: files[i].name, type: files[i].type, url: e.target.result})
      })

      reader.onloadend = () => {
        i++
        if(i < files.length)
          reader.readAsDataURL(files[i])
      }
  }

  uploadProprietarioFile(id: string) {
    if (this.previewDocumentsToUpload.length === 0) {
      console.log("Nenhuma imagem selecionada.");
      return;
    }

    const formData = new FormData();

    formData.append("id_ref", id);
    formData.append("ref", "Proprietario");

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

  public submitRegisterProprietarioForm(){
    if(this.registerProprietarioForm.valid){
      this.loadingService.present();
      this.proprietarioService.registerProprietario({
        tipo_pessoa: this.selectedOption,
        nome: this.registerProprietarioForm.value.nome,
        cpf_cnpj: this.registerProprietarioForm.value.cpf_cnpj,
        email:this.registerProprietarioForm.value.email,
        celular: this.registerProprietarioForm.value.celular,
      }).pipe(first(), finalize(()=> {this.loadingService.dismiss()})).subscribe({
        next: (res) => {
          this.uploadProprietarioFile(res.id)
          this.getCurrentProprietarios.push(res)
          this.registerProprietarioForm.reset()
          this.createVisible = !this.createVisible
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Proprietario Cadastrado'});
          this.previewSrc = [];
          this.getAllProprietarios();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message })
        }
      })
    }else{
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Dados Inválidos" })
    }
  }

  public submitUpdateProprietarioForm(){
    if(this.registerUpdateProprietarioForm.valid){
      this.loadingService.present();
      this.proprietarioService.updateProprietario({
        tipo_pessoa: this.selectedOption,
        nome: this.registerUpdateProprietarioForm.value.nome,
        cpf_cnpj: this.registerUpdateProprietarioForm.value.cpf_cnpj,
        email:this.registerUpdateProprietarioForm.value.email,
        celular: this.registerUpdateProprietarioForm.value.celular,
      }, this.proprietarioIdToUpdate!).pipe(first(), finalize(()=> {this.loadingService.dismiss()})).subscribe({
        next: (res: any) => {
          this.uploadProprietarioFile(res.id)
          this.registerUpdateProprietarioForm.reset()
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Proprietario Editado' });
          this.updateVisible = !this.updateVisible;
          this.previewSrc = [];
          this.getAllProprietarios()
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message })
        }
      })
    }else{
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Dados Inválidos" })
    }
  }

  @Output() public emmitSearch: EventEmitter<string> = new EventEmitter

  public search(value: string){
    const filter = this.setCurrentProprietarios.filter((res: any) =>{
      return !res.nome.toLowerCase().indexOf(value.toLowerCase());
    })
    this.getCurrentProprietarios = filter;
  }
}
