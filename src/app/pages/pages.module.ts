import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { PropriedadesComponent } from './propriedades/propriedades.component';
import { TipoItemListComponent } from './tipo-item-list/tipo-item-list.component';
import { PagesRoutingModule } from './pages-routing.module';
import { SharedModule } from '../shared/shared.module';
import { RegisterTipoItemComponent } from './register-tipo-item/register-tipo-item.component';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { UpdateTipoItemComponent } from './update-tipo-item/update-tipo-item.component';
import { AtributoContainerComponent } from './register-tipo-item/atributo-container/atributo-container.component';
import { UpdateAtributoContainerComponent } from './update-tipo-item/update-atributo-container/update-atributo-container.component';
import { TipoItemContainerComponent } from './tipo-item-list/tipo-item-container/tipo-item-container.component';
import { PropriedadeContainerComponent } from './propriedades/propriedade-container/propriedade-container.component';
import { DialogModule } from 'primeng/dialog';
import { ProprietarioComponent } from './proprietario/proprietario.component';
import { UserComponent } from './user/user.component';
import { ProprietarioContainerComponent } from './proprietario/proprietario-container/proprietario-container.component';
import { ToastModule } from 'primeng/toast';
import { InputMaskModule } from 'primeng/inputmask';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { UserContainerComponent } from './user/user-container/user-container.component';
import { BlockLoadingComponent } from '../shared/block-loading/block-loading.component';
import { CheckboxModule } from 'primeng/checkbox';
import { EdificioComponent } from './edificio/edificio.component';
import { EdificioContainerComponent } from './edificio/edificio-container/edificio-container.component';
import { TabViewModule } from 'primeng/tabview';
import { CompartimentoComponent } from './edificio/edificio-container/compartimento/compartimento.component';
import { QuadroComponent } from './edificio/edificio-container/quadro/quadro.component';
import { ItemComponent } from './edificio/edificio-container/item/item.component';
import { TabEdificioComponent } from './edificio/edificio-container/edificio/tab-edificio.component';

@NgModule({
  declarations: [
    LoginComponent,
    PropriedadesComponent,
    PropriedadeContainerComponent,
    TipoItemListComponent,
    TipoItemContainerComponent,
    RegisterTipoItemComponent,
    AtributoContainerComponent,
    UpdateTipoItemComponent,
    UpdateAtributoContainerComponent,
    ProprietarioComponent,
    UserComponent,
    ProprietarioContainerComponent,
    UserContainerComponent,
    TabEdificioComponent,
    EdificioComponent,
    EdificioContainerComponent,
    CompartimentoComponent,
    QuadroComponent,
    ItemComponent,
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
    DropdownModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    MessagesModule,
    ToastModule,
    InputMaskModule,
    SlickCarouselModule,
    BlockLoadingComponent,
    CheckboxModule,
    TabViewModule
  ],
  providers: [
    MessageService,
  ],
})
export class PagesModule { }
