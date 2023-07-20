import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { firstValueFrom } from 'rxjs';
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

  getMiddleFiveWords(term: string) {
    const palabras = term.trim().split(' ');
    const indiceInicio = Math.max(0, Math.floor((palabras.length - 8) / 2));
    return palabras.slice(indiceInicio, indiceInicio + 8).join(' ');
  }

  extractRawProblems(texto: string): string[] {
    const secciones: string[] = [];
    const lineas = texto.split('\n');
    let capturando = false;
    let seccionActual = '';
    for (const linea of lineas) {
      if (linea.startsWith('%inicio')) {
        capturando = true;
        seccionActual = '';
      } else if (linea.startsWith('%fin')) {
        capturando = false;
        if (seccionActual.length > 0) {
          secciones.push(seccionActual.trim());
        }
      } else if (capturando) {
        seccionActual += linea + '\n';
      }
    }
    return secciones;
  }

  validateSections(text: string): boolean {
    const lines = text.split('\n');
    let startCount = 0;
    let endCount = 0;
    for (const line of lines) {
      if (line.startsWith('%inicio')) {
        startCount++;
      } else if (line.startsWith('%fin')) {
        endCount++;
      }
      if (startCount== 30 && endCount == 30) {
        return true;
      }
    }
    return false;
  }

  async onTestUpload(event: any) {
    try {
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
              if(this.validateSections(testText)) {
                const resNewTest = await firstValueFrom(this.testService.addNewTest(this.test));
                if(resNewTest.successful) {
                  const solutions_regex = /[ABCDE]{30}/g;
                  const paths_regex = /{([^{}]*\.(?:png|jpe?g))}/g;
                  const options_regex_resp = /\\resp\{((?:[^{}]|(?:\{[^{}]*\}))*?)\}\{((?:[^{}]|(?:\{[^{}]*\}))*?)\}\{((?:[^{}]|(?:\{[^{}]*\}))*?)\}\{((?:[^{}]|(?:\{[^{}]*\}))*?)\}\{((?:[^{}]|(?:\{[^{}]*\}))*?)\}/g;
                  const options_regex_medskip = /\\[A-E]\s([^\\]+)/g;
                  var rawSolutions: string[];

                  var testTextClean = testText.replace(/\\includegraphics\[[^\]]+\]/g, '')
                                              .replace(/^(?!%inicio\b|%fin\b)(%.+)/gm, '')
                                              .replace(/\\pagebreak/g, '')
                                              .replace(/\\hspace\{[^{}]*\}/g, '')
                                              .replace(/\\begin{(?:pspicture|pspicture\*)}[\s\S]*?\\end{(?:pspicture|pspicture\*)}/g, '');

                  const rawProblems = this.extractRawProblems(testTextClean);
                  const matchSolutions = solutions_regex.exec(testText);
                  if(matchSolutions) {
                    rawSolutions = matchSolutions[0].split('');
                  }

                  rawProblems?.forEach(async (rawProblem, index) => {
                    // Figuras
                    var rawPaths;
                    if(rawProblem.includes('profig')) {
                      if(rawProblem.includes('\\resp')) {
                        const matches_paths = rawProblem.slice(0, rawProblem.indexOf("\\resp")).match(paths_regex) || [];
                        if(matches_paths) {
                          rawPaths = matches_paths.map(match => match.slice(1, -1));
                        }
                      } else if(rawProblem.includes('\\medskip')) {
                        const matches_paths = rawProblem.slice(0, rawProblem.indexOf("\\medskip")).match(paths_regex) || [];
                        if(matches_paths) {
                          rawPaths = matches_paths.map(match => match.slice(1, -1));
                        }
                      }
                    }

                    // Enunciado
                    var statement = rawProblem;
                    statement = statement.replace(/\\pro(?:fig)?\{\d+(?:\.\d+)?\}\s*?\{\d+(?:\.\d+)?\}\s*/g, '')
                                        .replace(/\\pro(?:fig)?\{\d+(?:\.\d+)?\}\s*/g, '')
                                        .replace(/\\resp\{.*\}/g, '')
                                        .replace(/\\begin\{center\}|\\end\{center\}/g, '')
                                        .replace(/(\\includegraphics|\s*\\smallskip|\s*\\centerline|\s*\\quad|\s*\\medskip\s*|\\psset\{.*?\}|\\raisebox\{.*?\})/g, '')
                                        .replace(/\\[A-E]/g, '')
                                        .replace(/\\ /g, '')
                                        .replace(/{([^{}]*\.(?:png|jpe?g))}/g, '')
                                        .replace(/\{\s*\}/g, '');

                    statement = statement.trim();
                    if (statement.startsWith("{") && statement.endsWith("}")) {
                      statement = statement.slice(1, -1);
                    }
                    var solution = rawSolutions[index];

                    const otherLevels = await firstValueFrom(this.testService.getLevelsByEdition(this.test.edition));
                    var duplicateProblem = false;
                    if(otherLevels.length > 1){
                      const res: any[] = await firstValueFrom(this.testService.searchProblem(this.test.edition, this.getMiddleFiveWords(statement), this.test.levels));
                      if (res.length == 1 && res[0].solution == solution ) {
                        console.log('->', this.getMiddleFiveWords(statement));
                        this.messageService.add({ severity: 'warn', summary: 'Problema duplicado', detail: `Problema #${index+1} duplicado`, life: 3250 });
                        duplicateProblem = true;
                        // Añadir un problema existente, no funciona. Si encuentra un problema duplicado lo ignora
                        //  resAddExistingProblem = await firstValueFrom(this.testService.addExistingProblem(resNewTest.test_id, res[0]._id));
                      }
                    }

                    if(!duplicateProblem) {
                      var rawOptions: string[] = [];
                      if(!rawProblem.includes('\\resp') && rawProblem.includes('\\medskip') && rawProblem.includes('\\A') && rawProblem.includes('\\B') && rawProblem.includes('\\C') && rawProblem.includes('\\D') && rawProblem.includes('\\E')) {
                        const matches_paths_resp = rawProblem.slice(rawProblem.indexOf("\\medskip")).match(paths_regex) || [];
                        if(matches_paths_resp.length > 3) {
                          for(let i = 0; i < matches_paths_resp.length; i++) {
                            rawOptions[i] = matches_paths_resp[i];
                          }
                        } else {
                          const matches_medskip = rawProblem.match(options_regex_medskip);
                          if(matches_medskip)
                            rawOptions = matches_medskip.map(match => match.split("\\")[1].trim());
                        }
                      } else if(rawProblem.includes('\\resp')) {
                        const matches_paths_resp = rawProblem.slice(rawProblem.indexOf("\\resp")).match(paths_regex) || [];
                        if(matches_paths_resp.length > 3) {
                          for(let i = 0; i < matches_paths_resp.length; i++) {
                            rawOptions[i] = matches_paths_resp[i];
                          }
                        } else {
                          const matches_resp = rawProblem.match(options_regex_resp);
                          if(matches_resp) {
                            rawOptions = matches_resp[0].replace('\\resp{', '').split("}{");
                            if (rawOptions[rawOptions.length-1].endsWith('}')) {
                              rawOptions[rawOptions.length-1] = rawOptions[rawOptions.length-1].slice(0, -1);
                            }
                          }
                        }
                      }

                      for (let i = 0; i < rawOptions.length; i++) {
                        let option = rawOptions[i];
                        if (option.startsWith("{") && option.endsWith("}")) {
                          rawOptions[i] = option.slice(1, -1);
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

                      if (statement && options) {
                        //Llamar a la API para asignar la categoría
                        var categorias = ["algebra", "geometria", "probabilidad", "teoria-numeros", "sin-categoria"];
                        var problem = {
                          _id: '',
                          statement: statement,
                          solution: solution,
                          // category: 'algebra',
                          category: categorias[Math.floor(Math.random() * categorias.length)],
                          options: options,
                          figures: figures
                        }
                        const newProblem = await firstValueFrom(this.testService.addNewProblem(problem, this.test.test_id));
                        const thereFigures = !!newProblem.figures.length;
                        const thereImagesInOptions = GlobalConstants.hasAtLeastOneOptionWithImagePath(newProblem.options);

                        if (thereFigures || thereImagesInOptions) {
                          await firstValueFrom(this.testService.createFolder(newProblem._id, 'preliminar'));
                          if (thereFigures) {
                            const uploadPromises = newProblem.figures.map(async (figure) => {
                              GlobalConstants.generateRandomSuffix();
                              const res = await firstValueFrom(this.testService.uploadImage(`uploads/${fileTex.name.split('/')[0]}/${figure.url}`, `preliminar/${newProblem._id}/`, GlobalConstants.getRandomName(figure.num_s.toString())));
                              figure.url = res.url;
                              figure.ik_id = res.fileId;
                              return this.testService.updateFigure(newProblem._id, figure);
                            });
                            await Promise.all(uploadPromises);
                          }

                          if (thereImagesInOptions) {
                            const uploadPromises = newProblem.options
                              .filter(option => GlobalConstants.isPath(option.answer))
                              .map(async (option) => {
                                const res = await firstValueFrom(this.testService.uploadImage(`uploads/${fileTex.name.split('/')[0]}/${option.answer}`, `preliminar/${newProblem._id}/`, GlobalConstants.getRandomName(option.letter)));
                                option.answer = res.url;
                                option.ik_id = res.fileId;
                                return this.testService.updateFigureOption(newProblem._id, option);
                              });
                            await Promise.all(uploadPromises);
                          }
                          if (thereFigures || thereImagesInOptions) {
                            this.testService.updateProblem('', -1, newProblem).subscribe({
                              next: (res) => {},
                              error: (err) => {}
                            });
                          }
                        }
                      }
                    }
                  });
                  this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Prueba creada 🎉', life: 3250 });
                  setTimeout(() => {
                    this.router.navigate([`/pruebas/ver/${this.test.test_id}`]);
                  }, 2420);
                }
              } else {
                this.messageService.add({ severity: 'error', summary: 'Rechazado', detail: 'Hay un error de formato en el archivo .tex 🙁', life: 3250 });
              }
            } else {
              this.messageService.add({ severity: 'error', summary: 'Rechazado', detail: 'El archivo de la prueba no es .tex 🙁', life: 3250 });
            }
          };
          reader.readAsArrayBuffer(file);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Rechazado', detail: 'El archivo seleccionado no es .zip 🙁', life: 3250 });
        }
      }
    } catch (err) {
      this.messageService.add({ severity: 'error', summary: 'Rechazado', detail: 'La prueba no fue creada 🙁', life: 3250 });
    }
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