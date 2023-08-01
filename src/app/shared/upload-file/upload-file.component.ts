import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GlobalConstants } from 'src/app/common/global-constants';
import { Figure } from 'src/app/tests/models/figure-model';
import { Option } from 'src/app/shared/option-model';
import { TestService } from 'src/app/tests/services/test.service';
import { PageService } from '../../pages/services/page.service';
import { Avatar } from 'src/app/admin-users/models/avatar-model';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html'
})
export class UploadFileComponent implements OnInit {

  constructor(private pageService: PageService, private testService: TestService) { }

  @Input() fileName: string;
  @Input() folder: string;
  @Input() typeNameFile: string;
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
    } else if(!isNaN(Number(this.fileName.split('-')[0]))) {
      let num_s = +res.name.split('-')[0];
      this.endUpload.emit(new Figure( '', res.fileId, num_s, res.url, num_s===1? 'derecha':'intermedia' ));
    } else { 
      this.endUpload.emit(new Avatar( '', res.fileId, res.url ));
    }
  }

  onUploadStart = (res: Event) => {
    this.startUpload.emit(true);
  }

}
