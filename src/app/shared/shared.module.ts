import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { HeaderComponent } from './header/header.component';
import { PagesRoutingModule } from '../pages/pages-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { RouterModule } from '@angular/router';
import { TelefonePipe } from './pipe/telefone/telefone.pipe';
import { CpfCnpjPipe } from './pipe/cpf-cnpj/cpf-cnpj.pipe';
@NgModule({
  declarations: [
    HeaderComponent,
    CpfCnpjPipe,
    TelefonePipe,
  ],
  exports: [
    HeaderComponent,
    CpfCnpjPipe,
    TelefonePipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    PagesRoutingModule,
    InputTextModule,
    FormsModule,
    ButtonModule,
    ReactiveFormsModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class SharedModule { }
