import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public back_button: any

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _location: Location
  ){}

  userPermissions: any

  isTipoItemRoute = false;

  isPropriedadeRoute = false;

  ngOnInit(): void {
    this.userPermissions = JSON.parse(localStorage.getItem("user_permissions")!)

    this.router.events.subscribe(() => {
      this.isPropriedadeRoute = this.activatedRoute.snapshot.routeConfig!.path === 'propriedades'
        || this.activatedRoute.snapshot.routeConfig!.path === 'edificios/:prop_id'
        || this.activatedRoute.snapshot.routeConfig!.path === 'edificios/:prop_id/register-item'


      this.isTipoItemRoute = this.activatedRoute.snapshot.routeConfig!.path === 'tipo-item-list'
        || this.activatedRoute.snapshot.routeConfig!.path === 'register-tipo-item'
        || this.activatedRoute.snapshot.routeConfig!.path === 'update-tipo-item/:tipo_item_id';
    });

    if(this.activatedRoute.snapshot.routeConfig!["path"] === "register-tipo-item"){
      this.back_button = this.activatedRoute.snapshot.routeConfig!["path"]
    }else if(this.activatedRoute.snapshot.routeConfig!["path"] === "update-tipo-item/:tipo_item_id"){
      this.back_button = this.activatedRoute.snapshot.routeConfig!["path"]
    }else if(this.activatedRoute.snapshot.routeConfig!["path"] === "edificios/:prop_id"){
      this.back_button = this.activatedRoute.snapshot.routeConfig!["path"]
    }else if(this.activatedRoute.snapshot.routeConfig!["path"] === "edificios/:prop_id/register-item"){
      this.back_button = this.activatedRoute.snapshot.routeConfig!["path"]
    }
  }

  voltarParaPaginaAnterior() {
    this._location.back();
  }
  
  public deslogar(){
    localStorage.clear()
    return this.router.navigate(['/login'])
  }
}
