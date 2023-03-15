import { Component, Input, OnInit } from '@angular/core';
import { GlobalConstants } from 'src/app/common/global-constants';
import { Figure } from '../models/figure-model';
import { TestService } from '../services/test.service';

@Component({
  selector: 'app-figures-table',
  templateUrl: './figures-table.component.html'
})
export class FiguresTableComponent implements OnInit {

  constructor( private testService: TestService) { }

  @Input() figures: Figure[] = [];
  @Input() problem_id: string;
  uploadings: boolean[] = [];

  ngOnInit(): void {
    GlobalConstants.generateRandomSuffix();
  }

  getRandomFigureName(num_s: number) {
    return GlobalConstants.getRandomName(num_s.toString());
  }

  addFigure(newFigure: any) {
    GlobalConstants.generateRandomSuffix();
    if(this.figures[newFigure.num_s-1].ik_id) {
      this.testService.deleteFigure(this.figures[newFigure.num_s-1].ik_id);
    }
    this.figures[newFigure.num_s-1] = newFigure;
    this.uploadings[newFigure.num_s-1] = false;
  }

  deleteFigure(num_s: number) {
    for(let i=0; i<this.figures.length; i++) {
      if(this.figures[i].num_s == num_s)
        this.testService.deleteFigure(this.figures[i].ik_id);
    }
    this.figures.splice(num_s-1, 1);
    if(num_s < this.figures.length)
      // var lastSegments, filePath, newFileName;
      for(let i=num_s-1; i<this.figures.length; i++) {
        // lastSegments = this.figures[num_s-1].url.split('/').slice(-2);
        // filePath = lastSegments[0] + '/' + lastSegments[1];
        // newFileName = num_s + '-' + lastSegments[1].split('-').slice(-1);
        this.figures[i].num_s = this.figures[i].num_s - 1;
        // console.log('filePath', '/'+filePath);
        // console.log('newFileName', newFileName);
        // this.testService.renameFigure('/'+filePath+'.png', newFileName);
      }
  }

  /*function string_to_slug(str) {
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        //str = str.replace(/\{.*\}/, ''); // trim
        //str = str.replace(/\\includegraphics\[.*\]/, '{*1*}'); // trim
        //str = str.replace(/\centerline{\[.*\}/, '{*1*}'); // 
    
        return str;
    }
    var x = String.raw` María dibujó varias figuras en hojas de papel cuadradas e idénticas:
    
    \medskip
    \centerline{\includegraphics[height=17mm]{B_fig/B12-1.eps}}
    
    \smallskip
    ¿Cuántas de estas formas tienen el mismo perímetro que la hoja de papel en que están dibujadas?
    `;
    console.log(string_to_slug(x.replace(/\r?\n|\r/gm,"")));*/

    /*
    function string_to_slug(str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.replace(/\{\*.*\*\}/, ''); // trim
    str = str.toLowerCase();
  
    // remove accents, swap ñ for n, etc
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to   = "aaaaeeeeiiiioooouuuunc------";
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes
  
    if(str[str.length-1] === '-') {
      str = str.slice(0,-1);
    }
    if(str[0] === '-') {
      str = str.slice(1);
    }
    return str;
    }
    var x = "María dibujó varias figuras en hojas de papel cuadradas e idénticas: {*1*} ¿Cuántas de estas formas tienen el mismo perímetro que la hoja de papel en que están dibujadas?";
    console.log(string_to_slug(x));
    */
}
