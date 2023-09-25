import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { createUser, updateUser } from 'src/app/shared/models/models';
import { UserService } from '../services/user-service/user.service';
import { MessageService } from 'primeng/api';
import { PermissionService } from '../services/permission-service/permission.service';
import { LoadingService } from 'src/app/shared/services/loading-service/loading.service';
import { finalize, first } from 'rxjs';

@Component({
  selector: 'app-user-container',
  templateUrl: './user-container.component.html',
  styleUrls: ['./user-container.component.scss']
})
export class UserContainerComponent implements OnInit {
  createVisible: boolean = false;
  updateVisible: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private messageService: MessageService,
    private permissionService: PermissionService,
    private loadingService: LoadingService,
  ){
  }

  currentMobileViewPermissions = [
    {
        visualizar: true,
    },
];

  public usuario = {
    visualizar: false,
    editar: false,
    adicionar: false,
    deletar: false,
    tabela: 'usuario'
  };

  public proprietario = {
    visualizar: true,
    editar: false,
    adicionar: false,
    deletar: false,
    tabela: 'proprietario'
  };

  public propriedade = {
    visualizar: true,
    editar: false,
    adicionar: false,
    deletar: false,
    tabela: 'propriedade'
  };

  public tipo_item = {
    visualizar: false,
    editar: false,
    adicionar: false,
    deletar: false,
    tabela: 'tipo-item'
  };

  public edificio = {
    visualizar: true,
    editar: false,
    adicionar: false,
    deletar: false,
    tabela: 'edificio'
  };

  public compartimento = {
    visualizar: true,
    editar: false,
    adicionar: false,
    deletar: false,
    tabela: 'compartimento'
  };

  public quadros = {
    visualizar: true,
    editar: false,
    adicionar: false,
    deletar: false,
    tabela: 'quadros'
  };

  public itens = {
    visualizar: true,
    editar: false,
    adicionar: false,
    deletar: false,
    tabela: 'itens'
  };

  getPermissionValues(id: string){
    const valores = [
      {
        visualizar: this.usuario.visualizar,
        editar: this.usuario.editar,
        adicionar: this.usuario.adicionar,
        deletar: this.usuario.deletar,
        tabela: this.usuario.tabela,
        user_id: id
      },
      {
        visualizar: this.proprietario.visualizar,
        editar: this.proprietario.editar,
        adicionar: this.proprietario.adicionar,
        deletar: this.proprietario.deletar,
        tabela: this.proprietario.tabela,
        user_id: id
      },
      {
        visualizar: this.propriedade.visualizar,
        editar: this.propriedade.editar,
        adicionar: this.propriedade.adicionar,
        deletar: this.propriedade.deletar,
        tabela: this.propriedade.tabela,
        user_id: id
      },
      {
        visualizar: this.tipo_item.visualizar,
        editar: this.tipo_item.editar,
        adicionar: this.tipo_item.adicionar,
        deletar: this.tipo_item.deletar,
        tabela: this.tipo_item.tabela,
        user_id: id
      },
      {
        visualizar: this.edificio.visualizar,
        editar: this.edificio.editar,
        adicionar: this.edificio.adicionar,
        deletar: this.edificio.deletar,
        tabela: this.edificio.tabela,
        user_id: id
      },
      {
        visualizar: this.compartimento.visualizar,
        editar: this.compartimento.editar,
        adicionar: this.compartimento.adicionar,
        deletar: this.compartimento.deletar,
        tabela: this.compartimento.tabela,
        user_id: id
      },
      {
        visualizar: this.quadros.visualizar,
        editar: this.quadros.editar,
        adicionar: this.quadros.adicionar,
        deletar: this.quadros.deletar,
        tabela: this.quadros.tabela,
        user_id: id
      },
      {
        visualizar: this.itens.visualizar,
        editar: this.itens.editar,
        adicionar: this.itens.adicionar,
        deletar: this.itens.deletar,
        tabela: this.itens.tabela,
        user_id: id
      },
    ];

    this.permissionService.registerPermissions(valores).subscribe(
      res => res
    )
  }

  public getUsers: any
  public setUsers: any

  public userToUpdate: string | undefined;
  public currentUserPermissions: any[] = []

  showUpdateModal(user: any){
    this.userService.getUsers().subscribe(
      res => {
        let selectedUser = res.find((selected: any) => selected.id == user.id)
        this.currentUserPermissions = selectedUser.permission
      },
    )
    this.userToUpdate = user.id
    this.createUpdateUserForm(user)
    this.updateVisible = !this.updateVisible
  }

  showCreateModal(){
    this.createVisible = !this.createVisible
  }

  ngOnInit(): void {
    this.getAllUsers()
    this.createUserForm(new createUser())
    this.createUpdateUserForm(new updateUser())

  }

  getAllUsers(){
    this.userService.getUsers().subscribe(
      res => {
        this.setUsers = res
        this.getUsers = this.setUsers
      },
    )
  }

  registerUserForm!: FormGroup
  public createUserForm(register: createUser){
    this.registerUserForm = this.formBuilder.group({
      name: [register.name, [Validators.required]],
      telefone: [register.telefone, [Validators.required]],
      email: [register.email, [Validators.required, Validators.email]],
      cpf: [register.cpf, [Validators.required]],
    })
  }

  registerUpdateUserForm!: FormGroup
  public createUpdateUserForm(register: updateUser){
    this.registerUpdateUserForm = this.formBuilder.group({
      name: [register.name, [Validators.required]],
      telefone: [register.telefone, [Validators.required]],
      email: [register.email, [Validators.required, Validators.email]],
      cpf: [register.cpf, [Validators.required]],
    })
  }

  public submitRegisterUserForm(){
    if(this.registerUserForm.valid){
      this.loadingService.present();
      this.userService.registerUser({
        name: this.registerUserForm.value.name,
        telefone: this.registerUserForm.value.telefone,
        email: this.registerUserForm.value.email,
        cpf: this.registerUserForm.value.cpf,
      }).pipe(first(), finalize(()=> {this.loadingService.dismiss()})).subscribe({
        next: (res) => {
          this.getPermissionValues(res.id)
          this.getUsers.push(res)
          this.registerUserForm.reset()
          this.createVisible = !this.createVisible
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Usuário Cadastrado' });
          this.getAllUsers()
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message })
        }
      })
    }else{
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Dados Inválidos" })
    }
  }

  public submitUpdateUserForm(){
    if(this.registerUpdateUserForm.valid){
      this.loadingService.present();
      this.userService.updateUser(this.userToUpdate!, {
          name: this.registerUpdateUserForm.value.name,
          telefone: this.registerUpdateUserForm.value.telefone,
          email: this.registerUpdateUserForm.value.email,
          cpf: this.registerUpdateUserForm.value.cpf,
        }).pipe(first(), finalize(()=> {this.loadingService.dismiss()})).subscribe({
        next: (res: any) => {
          this.permissionService.updatePermissions(this.currentUserPermissions).subscribe(
            res =>{
            }
          )
          this.getAllUsers()
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Usuário Atualizado'});
          this.registerUpdateUserForm.reset()
          this.updateVisible = !this.updateVisible;
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
    const filter = this.setUsers.filter((res: any) =>{
      return !res.name.toLowerCase().indexOf(value.toLowerCase());
    })
    this.getUsers = filter;
  }

}
