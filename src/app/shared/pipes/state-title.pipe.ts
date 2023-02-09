import { Pipe, PipeTransform } from '@angular/core';
import { GlobalConstants } from 'src/app/common/global-constants';

@Pipe({
  name: 'stateTitle'
})
export class StateTitlePipe implements PipeTransform {

  transform(state: string): string {
    for(let i=0; i<GlobalConstants.STATES.length; i++) {
      if(state == GlobalConstants.STATES[i].code) {
        return GlobalConstants.STATES[i].name;
      }
    }
    return state
  }

}
