import { Pipe, PipeTransform } from '@angular/core';
import { GlobalConstants } from 'src/app/common/global-constants';

@Pipe({
  name: 'stateTitle'
})
export class StateTitlePipe implements PipeTransform {

  transform(state: string): string {
    return GlobalConstants.capitalizeFirstLetters(state.replace('-', ' '));
  }

}
