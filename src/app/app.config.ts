import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(HttpClientXsrfModule.withOptions({
      cookieName: 'sessionId',
      headerName: 'Cookie'
    }))
  ]
}
