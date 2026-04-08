import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorService } from '../services/error-service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private errorService: ErrorService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error: any) => {
                this.errorService.handleError(error);
                // Retry logic, fallback API, etc.
                return throwError(() => error);
            })
        );
    }
}