import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (!localStorage.getItem('token')) {
      console.log('token empty');
      this.router.navigateByUrl('/login');
      return EMPTY;
    }
    const token = localStorage.getItem('token');

    if (!token) {
      return next.handle(request);
    }

    const req1 = request.clone({
      headers: request.headers
        .set('Authorization', `Bearer ${token}`)
        .set('requestId', uuidv4()),
    });

    return next.handle(req1);
  }
}
