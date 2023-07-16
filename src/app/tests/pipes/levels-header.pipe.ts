import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'levelsHeader'
})
export class LevelsHeaderPipe implements PipeTransform {

  transform(levels: string): string {
    switch (levels) {
      case '1ero':
        return 'PRIMER AÑO'
        break;
      case '1ero-2do':
        return 'PRIMER Y SEGUNDO AÑO'
        break;
      case '2do':
        return 'SEGUNDO AÑO'
        break;
      case '3ero':
        return 'TERCER AÑO'
        break;
      case '4to':
        return 'CUARTO AÑO'
        break;
      case '4to-5to':
        return 'CUARTO Y QUINTO AÑO'
        break;
      case '5to':
        return 'QUINTO AÑO'
        break;
    
      default:
        return levels;
        break;
    }
  }
}
