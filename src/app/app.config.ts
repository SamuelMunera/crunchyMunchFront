import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { AuthInterceptor } from './interceptors/auth';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    provideZoneChangeDetection({ eventCoalescing: true }),
  ],
};
