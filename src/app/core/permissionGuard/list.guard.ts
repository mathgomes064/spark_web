import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginComponent } from 'src/app/pages/login/login.component';
import { LoginService } from 'src/app/shared/services/login-service/login.service';

@Injectable({
  providedIn: 'root'
})
export class listGuard implements CanActivate{
  constructor(
    private router: Router,
  ){}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const userPermissions = JSON.parse(localStorage.getItem("user_permissions")!)

        let table: string = ""

        if(route.url[0].path === "user"){
          table = "usuario"
        }else if(route.url[0].path === "proprietario"){
          table = "proprietario"
        }else if(route.url[0].path === "propriedades"){
          table = "propriedade"
        }else if(route.url[0].path === "tipo-item-list" ||
          route.url[0].path === "register-tipo-item" ||
          route.url[0].path === "update-tipo-item"){
          table = "itens"
        }

        let permissions: any = {}

        userPermissions.forEach((element: any) => {
          if(element.tabela === table)
            permissions = element
        });

        if(permissions["visualizar"]){
          return true
        }
        this.router.navigate(['propriedades'])
        return false

        
  }
  
}

