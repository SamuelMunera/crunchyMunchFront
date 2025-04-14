import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { userAuthInterceptor } from './interceptors/user.interceptor';
import { adminAuthInterceptor } from './interceptors/admin.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([
      userAuthInterceptor,
      adminAuthInterceptor
    ])),
    provideZoneChangeDetection({ eventCoalescing: true })
  ],
};