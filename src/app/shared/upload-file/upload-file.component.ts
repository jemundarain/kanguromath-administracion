import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GlobalConstants } from 'src/app/common/global-constants';
import { Figure } from 'src/app/tests/models/figure-model';
import { Option } from 'src/app/tests/models/option-model';
import { TestService } from 'src/app/tests/services/test.service';
import { PagesService } from '../../pages/services/pages.service';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html'
})
export class UploadFileComponent implements OnInit {

  constructor(private pagesService: PagesService, private testService: TestService) { }

  @Input() fileName: string;
  @Input() folder: string;
  @Output() startUpload: EventEmitter<boolean> = new EventEmitter();
  @Output() endUpload: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {
    this.testService.authenticationImageKitIO()
  }

  isLetterOption(letter: string) {
    return GlobalConstants.OPTIONS_LETTERS.includes(letter);
  }

  handleUploadSuccess(res: any) {
    if(this.isLetterOption(this.fileName.split('-')[0])) {
      var newOption: Option = new Option( '', this.fileName.split('-')[0], res.url, res.fileId );
      this.endUpload.emit(newOption);
    } else {
      var newfigure: Figure = new Figure( '', res.fileId, +res.name.split('-')[0], res.url, 'intermedia' );
      this.endUpload.emit(newfigure);
    }
    //this.testService.updateFigure(updateFigure);
    //this.testService.deleteFigure(res.fileId);
  }

  handleUploadError(err: any) {
    console.log('There was an error in upload: ', err);
  }

  onUploadStart = (res: Event) => {
    this.startUpload.emit(true);
  }

  borrar(file_id: string) {
    this.pagesService.deleteImage(file_id)
  }

}
