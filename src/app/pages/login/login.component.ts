import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { login } from 'src/app/shared/models/models';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/shared/services/login-service/login.service';
import { LoadingService } from 'src/app/shared/services/loading-service/loading.service';
import { finalize, first } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  public hide: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private messageService: MessageService,
    private loadingService: LoadingService
  ){}

  ngOnInit(): void {
    this.createLoginForm(new login())
  }

  public createLoginForm(register: login){
    this.loginForm = this.formBuilder.group({
      email: [register.email, [Validators.required, Validators.email]],
      password: [register.password, [Validators.required]]
    })
  }

  public msgError: boolean = false;

  public submitForm(){
    if(this.loginForm.valid){
      this.loadingService.present();
      this.loginService.login({
        ...this.loginForm.value
      }).pipe(first(), finalize(()=> {this.loadingService.dismiss()})).subscribe({
        next: (res) => {
          localStorage.clear()
          localStorage.setItem('access_token', res.token.token)
          let userPermissions = JSON.stringify(res.token.userPermissions)
          localStorage.setItem('user_permissions', userPermissions)
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Logando...' });
          this.router.navigate(['propriedades'])
        },
        error: (err) => {
          console.log(err)
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message })
        }
      })
    }else{
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Email ou senha inválidos" })
    }
  }


}
