import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EdificioService } from '../../edificio-service/edificio.service';
import { ActivatedRoute } from '@angular/router';
import { InnerEdificioService } from '../edificio/inner-edificio-service/inner-edificio.service';
import { InnerCompartimentoService } from '../compartimento/inner-compartimento-service/inner-compartimento.service';
import { InnerQuadroService } from './inner-quadro-service/inner-quadro.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { createDPS, createQuadro } from 'src/app/shared/models/models';
import { AnexoService } from 'src/app/shared/services/anexo-service/anexo.service';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from 'src/app/shared/services/loading-service/loading.service';
import { finalize, first } from 'rxjs';

interface Linha{
  descricao: string;
}

interface Dps{
  id: string,
  classe: string;
  corrente?: string;
  tensao?: string;
}
@Component({
  selector: 'app-quadro',
  templateUrl: './quadro.component.html',
  styleUrls: ['./quadro.component.scss']
})

export class QuadroComponent implements OnInit {
  public createConfirmation: boolean = false;
  public createVisible: boolean = false
  public createOrEdit: boolean = false;
  public detailVisable: boolean = false;
  public createDPS: boolean = false;

  public previewSrc: any[] = [];
  public imagens: any[] | undefined;
  public detailImg: any | undefined;
  public previewDocuments: any[] = [];
  public previewDocumentsToUpload: any[] = [];
  public currentCompartimento_id: any

  public tipo_dps: Dps[] = []

  public slideConfig = {"slidesToShow": 3, "slidesToScroll": 3};

  public edificios: any

  public compartimentos: any

  public quadros: any

  public itens: any

  public edificiosToFilter: Array<any> = [];

  public edificiosToRegister: Array<any> = [];

  public compartimentosToRegister: Array<any> = [];

  public currentEdificioId: any

  public currentQuadroId: any

  public compartimentosToFilter: Array<any> = [];

  constructor(
    private innerEdificioService: InnerEdificioService,
    private innerCompartimentoService: InnerCompartimentoService,
    private activatedRoute: ActivatedRoute,
    private innerQuadroService: InnerQuadroService,
    private formBuilder: FormBuilder,
    private anexoService: AnexoService,
    private messageService: MessageService,
    private http: HttpClient,
    private loadingService: LoadingService,
  ){}

  ngOnInit(): void {
    this.listarEdificios()
    this.listarCompartimentos()
    this.listarQuadros()
    this.listDpsTipo()

    this.createQuadroForm(new createQuadro())
    this.createDPSFormFunction(new createDPS())

  }

  getDps(dps_id: any){
    if(dps_id == "-1"){
      this.createDPS = !this.createDPS
    }
  }

  openQuadroToUpdate(quadro_id: string | undefined) {
    this.createOrEdit = true
    this.createVisible = true;
    this.currentQuadroId = quadro_id;

    this.innerQuadroService.getQuadroWithGroup(quadro_id!).subscribe({
      next: (res) => {
        console.log(res)
        this.createQuadroForm(res);
      }
    })
    
    this.anexoService.getAnexosById(quadro_id!).subscribe(
        res => {
          this.imagens = res;
        }
    );

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

  showDetailDocument(url: string){
    window.open(url)
  }

  currentImage: any
  currentPosition: any

  showCreateConfirmation(image: any, i: any){
    this.currentImage = image;
    this.currentPosition = i;
    this.createConfirmation = !this.createConfirmation
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
    this.currentQuadroId = ""
    this.quadroForm.reset()
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
  formData.append("ref", "Quadro");

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

  quadroForm!: FormGroup
  public createQuadroForm(register: createQuadro){
    this.quadroForm = this.formBuilder.group({
      quadro_descricao: [register.quadro_descricao, [Validators.required]],
      tipo_qgbt: [register.tipo_qgbt, [Validators.required]],
      tamanho_qgbt: [register.tamanho_qgbt, [Validators.required]],
      quantidade_circuito: [register.quantidade_circuito, [Validators.required]],
      monofasico: [register.monofasico, [Validators.required]],
      bifasico: [register.bifasico, [Validators.required]],
      trifasico: [register.trifasico, [Validators.required]],
      disjuntor_principal: [register.disjuntor_principal, [Validators.required]],
      polos: [register.polos, [Validators.required]],
      possui_dps: [register.possui_dps, [Validators.required]],
      quantidade_dps: [register.quantidade_dps, [Validators.required]],
      compartimento_id: this.activatedRoute.snapshot.params['compart_id'],
      dps_tipo_id: [register.dps_tipo_id, [Validators.required]]
    })
  }

  createDPSForm!: FormGroup;
  public createDPSFormFunction(register: createDPS){
    this.createDPSForm = this.formBuilder.group({
      classe: [register.classe, [Validators.required]],
      corrente: [register.corrente, [Validators.required]],
      tensao: [register.tensao, [Validators.required]],
    })
  }

  submitQuadroForm(){
    if(this.currentQuadroId){
      if(this.quadroForm.valid){
        this.loadingService.present(); 
        this.innerQuadroService.updateQuadro(
          this.currentQuadroId, {
            quadro_descricao: this.quadroForm.value.quadro_descricao,
            tipo_qgbt:this.quadroForm.value.tipo_qgbt,
            tamanho_qgbt: this.quadroForm.value.tamanho_qgbt,
            quantidade_circuito: this.quadroForm.value.quantidade_circuito,
            monofasico:this.quadroForm.value.monofasico,
            bifasico: this.quadroForm.value.bifasico,
            trifasico: this.quadroForm.value.trifasico,
            disjuntor_principal: this.quadroForm.value.disjuntor_principal,
            polos: this.quadroForm.value.polos,
            possui_dps: this.quadroForm.value.possui_dps,
            quantidade_dps: this.quadroForm.value.quantidade_dps,
            dps_tipo_id: this.quadroForm.value.dps_tipo_id.id,
          }
        ).pipe(first(), finalize(()=> {this.loadingService.dismiss()})).subscribe({
          next: (res: any) =>{
            this.uploadPropriedadeFile(res.id)
            this.listarQuadros()
            this.compartimentosToFilter.splice(0, this.compartimentosToFilter.length)
            this.previewSrc = [];
            this.createVisible = false
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Quadro Atualizado' });
          },
          error: (err) =>{
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Dados Inválidos' })
          }
        })
      }else{
        this.innerQuadroService.createQuadro(
          this.quadroForm.value
        ).subscribe(
          (res: any) =>{
            this.uploadPropriedadeFile(res.id)
            this.listarQuadros()
            this.loadingService.dismiss();
            this.createVisible = false
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Quadro Criado' });
          }
        )
      }
    }else if(this.quadroForm.valid){
      this.loadingService.present();
      this.innerQuadroService.createQuadro(
        this.quadroForm.value
      ).subscribe({
        next: (res: any) => {
          this.uploadPropriedadeFile(res.id)
          this.listarQuadros(),
          this.compartimentosToFilter.splice(0, this.compartimentosToFilter.length)
          this.createVisible = false
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Quadro Criado' });
        },
        error: (err) =>{
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

  onSubmitDPS(){
    if(this.createDPSForm.valid){
      this.loadingService.present(); 
      this.innerQuadroService.createDpsTipo({
        ...this.createDPSForm.value
      }).pipe(first(), finalize(()=> {this.loadingService.dismiss()})).subscribe({
        next: async (res: any) => {
          let item = this.tipo_dps.pop()
          this.tipo_dps.push(res)
          this.tipo_dps.push(item!)
          this.createDPSForm.reset();
          this.createDPS = !this.createDPS
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'DPS Cadastrado' });
        },
        error: async(err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Dados Invalidos" })
        }
      })
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Dados Invalidos" })
    }
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
        res.forEach((objeto: any) => {
          const { id, nome } = objeto;
          this.edificiosToRegister.push({ id, nome });
        });

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

  listDpsTipo(){
    this.innerQuadroService.getDpsTipo().subscribe(
      res => {
        res.forEach((objeto: any) => {
          const { id, classe, corrente, tensao } = objeto;
          this.tipo_dps.push({ id, classe, corrente, tensao });
        });
        this.tipo_dps.push({
          id: "-1",
          classe: "Adicionar Tipo de DPS"  
        })
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

  throwCompartimentosToSelect(edf_id: string){
    this.innerEdificioService.getEdificioById(this.activatedRoute.snapshot.params['prop_id'], edf_id).subscribe(
      res =>{
        this.compartimentosToRegister.splice(0, this.compartimentosToRegister.length);

        res.compartimento.forEach((objeto: any) => {
          const { id, descricao } = objeto;
          this.compartimentosToRegister.push({ id, descricao });
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

  tipo_qgbt: Linha[] = [
    {descricao: "Sobrepor"},
    {descricao: "Embutido"},
  ];

  tamanho_qgbt: Linha[] = [
    {descricao: "2 circuitos"},
    {descricao: "4 circuitos"},
    {descricao: "6 circuitos"},
    {descricao: "8 circuitos"},
    {descricao: "10 circuitos"},
    {descricao: "12 circuitos"},
    {descricao: "16 circuitos"},
    {descricao: "20 circuitos"},
  ]

  disjuntor_principal: Linha[] = [
    {descricao: "16 A"},
    {descricao: "20 A"},
    {descricao: "32 A"},
    {descricao: "40 A"},
    {descricao: "50 A"},
    {descricao: "63 A"},
    {descricao: "80 A"},
    {descricao: "90 A"},
    {descricao: "100 A"},
    {descricao: "125 A"},
    {descricao: "150 A"},
    {descricao: "160 A"},
    {descricao: "200 A"},
  ]

  polos: Linha[] = [
    {descricao: "Monopolar"},
    {descricao: "Bipolar"},
    {descricao: "Tripolar"},
  ];

  possui_dps: Linha[] = [
    {descricao: "Sim"},
    {descricao: "Não"},
  ];

}
