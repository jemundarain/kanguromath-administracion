import { Component, Input, OnInit } from '@angular/core';
import { Figure } from '../models/figure-model';
import { TestService } from '../services/test.service';

@Component({
  selector: 'app-figures-table',
  templateUrl: './figures-table.component.html'
})
export class FiguresTableComponent implements OnInit {

  constructor( private testService: TestService) { }

  @Input() figures: Figure[] = [];
  position: string;
  contents: any = null;
  filename: string;

  ngOnInit(): void {
  }

  public upload(event: any, uploadFigure: any) {
    console.log('Reading file...');
    for (const file of event.files) {
      const dataset = this.readFile(file);
      console.log('onUpload: ', dataset);
    }
    uploadFigure.clear();
  }

  uploadFigure(event: any) {
    console.log("Multiple Files are uploaded: ", event.files);
  }

  private readFile(file: File) {
    const reader: FileReader = new FileReader();
    reader.onload = () => {
        console.log('readFile: ', reader.result);
        this.contents = reader.result;
    };
    reader.readAsText(file);
    this.filename = file.name;
  }

  setPosition(position: string){
    this.position = position;
  }
}
