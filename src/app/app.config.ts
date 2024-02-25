import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
// import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { MAT_DATE_LOCALE } from '@angular/material/core';

import { graphqlProvider } from './graphql.provider';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'fr' },
    provideRouter(routes, withComponentInputBinding()),
    // provideClientHydration(),
    provideAnimations(),
    provideHttpClient(),
    graphqlProvider
  ]
};
