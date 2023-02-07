import { Component, Input, OnInit } from '@angular/core';
import { PagesService } from '../../pages/services/pages.service';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html'
})
export class UploadFileComponent implements OnInit {

  constructor(private pagesService: PagesService) { }

  @Input() fileName: string;
  @Input() folder: string;

  ngOnInit(): void {
  }

  handleUploadSuccess(res: any) {
    console.log('File upload success with response: ', res);
  }

  handleUploadError(err: any) {
    console.log('There was an error in upload: ', err);
  }

  borrar(file_id: string) {
    this.pagesService.deleteImage(file_id)
  }

}
