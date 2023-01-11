import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'levelsTittle'
})
export class LevelsTittlePipe implements PipeTransform {

  transform(levels: string): string {
    var levels_s = levels.toString();
    return levels_s.replace('-', ' - ');
  }

}
