import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}
  
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
    var _token = localStorage.getItem('access_token');
    const dupReq = req.clone({
      headers: req.headers.set('Authorization', _token ? _token : '')
    });
    return next.handle(dupReq)
  }
}
