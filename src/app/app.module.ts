import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { KatexModule } from 'ng-katex';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ComponentsModule } from './components/components.module';
import { PagesModule } from './pages/pages.module';
import { TestsModule } from './pages/tests/tests.module';

import localeVZLA from '@angular/common/locales/es-VE';
import { registerLocaleData  } from '@angular/common';
registerLocaleData( localeVZLA );
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppRoutingModule,
    ComponentsModule,
    PagesModule,
    TestsModule,
    KatexModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-VE' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
