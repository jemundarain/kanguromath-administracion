import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

interface CanComponentDeactivate {
  exitConfirmation: () => Observable<boolean> | boolean;
}

@Injectable()
export class TestsGuard implements CanDeactivate<any> {
  constructor() {}

  canDeactivate(component: CanComponentDeactivate): Observable<boolean> | boolean {
    if (typeof component.exitConfirmation === 'function') {
      return component.exitConfirmation();
    }
    return true;
  }
}

