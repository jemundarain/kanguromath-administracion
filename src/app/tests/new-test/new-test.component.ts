import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import JSZip from 'jszip';

import { GlobalConstants } from 'src/app/common/global-constants';
import { RadioOption } from '../../common/radio-option.interface';
import { Test } from '../models/test-model';
import { TestService } from '../services/test.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-new-test',
  templateUrl: './new-test.component.html',
  providers: [MessageService]
})
export class NewTestComponent implements OnInit {

  @ViewChild('addTestForm', { static: true }) addTestForm!: NgForm;
  @ViewChild('uploadBtn') uploadBtn!: FileUpload;
  minEdition: number = GlobalConstants.MIN_DATE_EDITION;
  maxEdition: number = GlobalConstants.MAX_DATE_EDITION;
  test: Test;
  levels: RadioOption[];
  selectedLevelCode: string;
  items: MenuItem[];
  uploadUrl: string = `${environment.baseUrl}/admin_uploads/upload_test/`;

  constructor(
    private testService: TestService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.addTestForm.form.valueChanges.subscribe((data) => {
      this.testService.getLevelsByEdition(data.edition).subscribe(levels => { 
        this.levels = GlobalConstants.filterLevels(levels);
      });
    });
    this.test = new Test('', '', '', GlobalConstants.MAX_DATE_EDITION.toString(), false, [])
    this.items = [
      {label: 'Pruebas'},
      {label: 'Prueba nueva'}
    ];
  }                    

  onTestUpload(event: any) {
    this.testService.addNewTest(this.test).subscribe({
      next: (successful) => {
        const fileList: FileList = event.files;
        if (fileList.length > 0) {
          const file: File = fileList[0];
          if (file.type === 'application/zip' || file.type === 'application/x-zip-compressed') {
            const reader = new FileReader();
            reader.onload = async (e: any) => {
              const zipContent: ArrayBuffer = e.target.result;
              const jszip = new JSZip();
              const zip = await jszip.loadAsync(zipContent);
              const fileTex = zip.file(/\.tex$/i)[0];              
              if (fileTex) {
                const testText: string = await fileTex.async('string');
                const main_regex = /\\pro(fig)?\{[^{}]*\}[\s\S]*?\n(\\resp\{((?:[^{}]|(?:\{[^{}]*\}))*?)\}\{((?:[^{}]|(?:\{[^{}]*\}))*?)\}\{((?:[^{}]|(?:\{[^{}]*\}))*?)\}\{((?:[^{}]|(?:\{[^{}]*\}))*?)\}\{((?:[^{}]|(?:\{[^{}]*\}))*?)\}|%\{|\\end)/g;
                const solutions_regex = /[ABCDE]{30}/g;
                const paths_regex = /{([^{}]*\.(?:png|jpe?g))}/g;
                const options_regex_resp = /\\resp\{((?:[^{}]|(?:\{[^{}]*\}))*?)\}\{((?:[^{}]|(?:\{[^{}]*\}))*?)\}\{((?:[^{}]|(?:\{[^{}]*\}))*?)\}\{((?:[^{}]|(?:\{[^{}]*\}))*?)\}\{((?:[^{}]|(?:\{[^{}]*\}))*?)\}/g;
                const options_regex_medskip = /\\[A-E]\s([^\\]+)/g;
                var rawSolutions: string[];
                
                var testTextClean = testText.replace(/\\includegraphics\[[^\]]+\]/g, '')
                                            .replace(/\\begin{(?:pspicture|pspicture\*)}[\s\S]*?\\end{(?:pspicture|pspicture\*)}/g, '');
                const rawProblems =  testTextClean.match(main_regex);
                
                const matchSolutions = solutions_regex.exec(testText);
                if(matchSolutions) {
                  rawSolutions = matchSolutions[0].split('');
                }
                
                rawProblems?.forEach((rawProblem, index) => {
                  // Figuras
                  var rawPaths;
                  if(rawProblem.includes('profig')) {
                    const matches_paths = rawProblem.match(paths_regex);
                    if(matches_paths) {
                      rawPaths = matches_paths.map(match => match.slice(1, -1));
                    }
                  }
                  
                  // Enunciado
                  var statement = rawProblem;
                  statement = statement.replace(/\\pro(?:fig)?\{\d+(?:\.\d+)?\}\s*?\{\d+(?:\.\d+)?\}\s*/g, '')
                                      .replace(/\\pro(?:fig)?\{\d+(?:\.\d+)?\}\s*/g, '')
                                      .replace(/\\resp\{.*\}/g, '')
                                      .replace(/^%.*$/gm, '')
                                      .replace(/(\\quad|\s*\\medskip\s*|\\psset\{.*?\}|\\raisebox\{.*?\})/g, '')
                                      .replace(/{([^{}]*\.(?:png|jpe?g))}/g, '')
                                      .replace(/\{\s*\}/g, '');
                  
                  statement = statement.trim();
                  if (statement.startsWith("{") && statement.endsWith("}")) {
                    statement = statement.slice(1, -1);
                  }
                  var solution = rawSolutions[index];
                  
                  var rawOptions;
                  if(!rawProblem.includes('\\resp') && rawProblem.includes('\\A') && rawProblem.includes('\\B') && rawProblem.includes('\\C') && rawProblem.includes('\\D') && rawProblem.includes('\\E')) {
                    const matches_medskip = rawProblem.match(options_regex_medskip);
                    if(matches_medskip)
                    rawOptions = matches_medskip.map(match => match.split("\\")[1].trim());
                  } else {
                    const matches_resp = rawProblem.match(options_regex_resp);
                    if(matches_resp) {
                      rawOptions = matches_resp[0].replace('\\resp{', '').split("}{");
                      rawOptions[rawOptions.length-1] = rawOptions[rawOptions.length-1].replace('}', '');
                    }
                  }
                  
                  var options = []
                  if(rawOptions) {
                    for(let i=0; i<5; i++) {
                      options.push({
                        _id: '',
                        letter: String.fromCharCode(65 + i),
                        answer: rawOptions[i],
                        ik_id: ''
                      })
                    }
                  }
                  
                  var figures = [];
                  if(rawPaths) {
                    for(let i=0; i<rawPaths.length; i++) {
                      figures.push({
                        _id: '',
                        ik_id: '',
                        num_s: i+1,
                        url: rawPaths[i],
                        position: i+1==1? 'derecha':'intermedia'
                      })
                    }
                  }
                  
                  if(statement && options) {
                    //Llamar a la API para asignar la categoría
                    var problem = {
                      _id: '',
                      statement: statement,
                      solution: solution,
                      category: 'sin-categoria',
                      options: options,
                      figures: figures
                    }

                    this.testService.addNewProblem(problem, this.test.test_id).subscribe({
                      next: (newProblem) => {
                        const thereFigures = !!newProblem.figures.length;
                        const thereImagesInOptions = GlobalConstants.hasAtLeastOneOptionWithImageLink(newProblem.options);
                        
                        if (thereFigures || thereImagesInOptions) {
                            this.testService.createFolder(newProblem._id, 'preliminar');
                        }
                          
                        if (thereFigures) {
                          newProblem.figures.forEach((figure, index) => {
                            console.log(figure);
                            GlobalConstants.generateRandomSuffix();
                            this.testService.uploadImage(`uploads/${fileTex.name.split('/')[0]}/${figure.url}`, `preliminar/${newProblem._id}/`, GlobalConstants.getRandomName((index+1).toString())).subscribe({
                              next: (res) => {
                                figure.url = res.url;
                              },
                              error: (err) => { }
                            });
                          });
                        }
                        
                        if (thereImagesInOptions) {
                          newProblem.options.forEach((option) => {
                              if (GlobalConstants.isLink(option.answer)) {
                              this.testService.moveFile(option.answer.split('/').slice(-1)[0], `preliminar/${newProblem._id}`).subscribe({
                                next: () => {},
                                error: (err) => { }
                              });
                              option.answer = GlobalConstants.concatenatePath(option.answer, `/preliminar/${newProblem._id}/`);
                            }
                          });
                        }
                        
                        if (thereFigures || thereImagesInOptions) {
                            this.testService.updateProblem('', -1, newProblem);
                        }
                      },
                      error: (err) => { }
                    });
                    setTimeout(() => {
                    }, 400);
                  }
                });
                // this.messageService.add({severity:'success', summary: 'Exitoso', detail: 'Prueba creada 🎉', life: 3250});
                // setTimeout(() => {
                //   this.router.navigate([`/pruebas/ver/${this.test.test_id}`]);
                // }, 1220);
              } else {
                // console.log('El archivo .zip no contiene un archivo .tex');
              }
            };
            reader.readAsArrayBuffer(file);
          } else {
            // console.log('El archivo seleccionado no es un archivo .zip');
          }
        }
        // this.messageService.add({severity:'success', summary: 'Exitoso', detail: 'Prueba creada 🎉', life: 3250});
        // setTimeout(() => {
        //   this.router.navigate([`/pruebas/ver/${this.test.test_id}`]);
        // }, 1220);
      },
      error: (err) => {
        this.messageService.add({severity:'error', summary: 'Rechazado', detail: 'La prueba no fue creada 🙁', life: 3250});
      }
    });
  }

  addTest() {
    this.test.test_id = `preliminar-${this.test.edition}-${this.test.levels}`;
    if (this.uploadBtn && this.uploadBtn.files && this.uploadBtn.files.length > 0) {
      setTimeout(() => { this.uploadBtn.upload() }, 500)
    } else {
      this.testService.addNewTest(this.test).subscribe({
        next: (successful) => {
          this.messageService.add({severity:'success', summary: 'Exitoso', detail: 'Prueba creada 🎉', life: 3250});
          setTimeout(() => {
            this.router.navigate([`/pruebas/ver/${this.test.test_id}`]);
          }, 1220);
        },
        error: (err) => {
          this.messageService.add({severity:'error', summary: 'Rechazado', detail: 'La prueba no fue creada 🙁', life: 3250});
        }
      });
    }
  }
}