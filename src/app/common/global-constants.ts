import { Option } from '../shared/option-model';
import { Ranking } from '../pages/interfaces/ranking.interfaces';
import { RadioOption } from './radio-option.interface';
import * as dayjs from 'dayjs';
import katex from 'katex';

export class GlobalConstants {
    public static SITE_TITLE: string = 'administrador-canguromath-app';
    public static MIN_DATE_EDITION: number = 2002;
    public static MAX_DATE_EDITION: number = (new Date()).getFullYear();
    public static randomNumber: number;

    public static OPTIONS_LETTERS: string[] = ['A', 'B', 'C', 'D', 'E'];
    
    public static LEVELS: RadioOption[] = [
        { name: '1ero', code: '1ero' },
        { name: '1ero y 2do', code: '1ero-2do' },
        { name: '2do', code: '2do' },
        { name: '2do y 3ero', code: '2do-3ero' },
        { name: '3ero', code: '3ero' },
        { name: '4to', code: '4to' },
        { name: '4to y 5to', code: '4to-5to' },
        { name: '5to', code: '5to' }
    ]

    public static DISTRIBUTION_LEVELS: RadioOption[] = [
        { name: '1ero', code: '1ero' },
        { name: '2do', code: '2do' },
        { name: '3ero', code: '3ero' },
        { name: '4to', code: '4to' },
        { name: '5to', code: '5to' },
        { name: 'Universitario', code: 'universitario' }
    ]

    public static CATEGORIES: RadioOption[] = [
        { name: 'Álgebra', code: 'algebra' },
        { name: 'Geometría', code: 'geometria' },
        { name: 'Combinatoria', code: 'combinatoria' },
        { name: 'Teoría de Números', code: 'teoria-numeros' },
        { name: 'Sin categoría', code: 'sin-categoria' },
    ]

    public static USER_ROLS: RadioOption[] = [
        { name: 'Estudiante', code: 'estudiante' },
        { name: 'Profesor', code: 'profesor' },
        { name: 'Aficionado', code: 'aficionado' },
    ]

    public static TRANSLATION = {
        monthNames: [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre' ],
        monthNamesShort: [ 'ene','feb','mar','abr','may','jun', 'jul','ago','sep','oct','nov','dic' ],
        dayNames: [ 'domingo','lunes','martes','miércoles','jueves','viernes','sábado' ],
        dayNamesShort: [ 'dom','lun','mar','mié','jue','vie','sáb' ],
        dayNamesMin: [ 'D','L','M','X','J','V','S' ],
        dateFormat: 'dd/mm/yy',
    }

    public static DATE_OPTIONS: RadioOption[] = [
        { name: 'Hoy', code: 'today' },
        { name: 'Ayer', code: 'yesterday' },
        { name: 'Últimos 7 días: desde FECHA_INICIO', code: 'last-7days' },
        { name: 'Últimos 30 días: desde FECHA_INICIO', code: 'last-30days' },
        { name: 'Desde el comienzo', code: 'beginning' },
        { name: 'Rango de fecha personalizado', code: 'customize' },
    ]

    public static UPLOAD_OPTIONS = [
        'Automática',
        'Manual'
    ]

    public static NEW_PROBLEM_OPTIONS = [
        'Nuevo',
        'Existente'
    ]

    public static SEXS: RadioOption[] = [
        { name: 'Femenino', code: 'F' },
        { name: 'Masculino', code: 'M' },
    ]

    public static STATES = [
        { code: 'amazonas', name: 'Amazonas' },
        { code: 'anzoategui', name: 'Anzoátegui' },
        { code: 'apure', name: 'Apure' },
        { code: 'aragua', name: 'Aragua' },
        { code: 'barinas', name: 'Barinas' },
        { code: 'bolivar', name: 'Bolívar' },
        { code: 'carabobo', name: 'Carabobo' },
        { code: 'cojedes', name: 'Cojedes' },
        { code: 'delta-amacuro', name: 'Delta Amacuro' },
        { code: 'distrito-capital', name: 'Distrito Capital' },
        { code: 'falcon', name: 'Falcón' },
        { code: 'guarico', name: 'Guárico' },
        { code: 'la-guaira', name: 'La Guaira' },
        { code: 'lara', name: 'Lara' },
        { code: 'merida', name: 'Mérida' },
        { code: 'miranda', name: 'Miranda' },
        { code: 'monagas', name: 'Monagas' },
        { code: 'nueva-esparta', name: 'Nueva Esparta' },
        { code: 'portuguesa', name: 'Portuguesa' },
        { code: 'sucre', name: 'Sucre' },
        { code: 'tachira', name: 'Táchira' },
        { code: 'trujillo', name: 'Trujillo' },
        { code: 'yaracuy', name: 'Yaracuy' },
        { code: 'zulia', name: 'Zulia' }
    ]

    public static INSTITUTIONS: RadioOption[] = [
        { code: 'publica', name: 'Pública' },
        { code: 'privada', name: 'Privada' }
    ]

    public static PERFORMANCE_OPTIONS: RadioOption[] = [
        { code: 'correctas', name: 'Respuestas Correctas' },
        { code: 'incorrectas', name: 'Respuestas Incorrectas' }
    ]

    public static LEVELS_LABELS = [
        '1er Año',
        '2do Año',
        '3er Año',
        '4to Año',
        '5to Año',
        'Universitario'
    ]

    public static LEVELS_COLORS = [
        '#bd93f9',
        '#e60012',
        '#e413a4',
        '#fe7465',
        '#faac47',
        '#8be9fd'
    ]

    public static FIGURES_MAP1 = {
        '=0': '',
        '=1': 'Se detectó ',
        'other': 'Se detectaron '
    }
    
    public static FIGURES_MAP2 = {
        '=0': 'No se detectaron figuras',
        '=1': 'figura',
        'other': 'figuras'
    }

    public static TYPES_COLORS = [
        '#ff5555',
        '#cdb996',
        '#00adb8',
        '#467689',
        '#7bb2af'
    ]

    public static CHART_FONT_SIZE = 18;
    public static CHART_COLOR = '#26201f';
    public static CHART_FONT_FAMILY = 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';

    public static BASIC_OPTIONS = {
        plugins: {
            legend: {
                labels: {
                    color: '#26201F'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#495057',
                },
                grid: {
                    color: '#ebedef'
                }
            },
            y: {
                ticks: {
                    color: '#495057',
                    callback: function(v: number) { if (v % 1 === 0) return v; else return; }
                },
                grid: {
                    color: '#ebedef'
                },
                min: 0
            }
        }
    };

    public static generateRandomSuffix() {
        this.randomNumber = Math.floor(Math.random() * 1000);
    }

    public static getRandomSuffix() {
        return this.randomNumber;
    }

    public static getRandomName(preffix: string) {
        return `${ preffix }-${ GlobalConstants.getRandomSuffix() }`
    }

    public static isRenderizableWithKaTeX(content: string) {
        try {
          katex.renderToString(content.replace(/\$/g, ''));
          return {res: true, err: ''};
        } catch (err:any) {
          const regex = /Undefined control sequence: (\\[a-zA-Z]+)/;
          const match = regex.exec(err);
          if (match && match.length > 1) {
            return {
                res: false,
                err: `
                    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong class="font-bold">Comando inválido: ${match[1]}</strong>
                        <span class="block sm:inline">Para más información sobre los comandos soportados, visita la <a style="text-decoration:underline;" href="https://katex.org/docs/supported.html">Documentación de KaTeX<a/></span>
                    </div>
                    `,
                operator: `\\${match[0].split(': ')[1]}`
            };
          } else {
            return {
                res: false,
                err: `
                    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong class="font-bold">Error desconocido en la rutina de diagramación</strong>
                        <span class="block sm:inline">Para más información sobre los comandos soportados, visita la <a style="text-decoration:underline;" href="https://katex.org/docs/supported.html">Documentación de KaTeX<a/></span>
                    </div>
                    `,
                operator: ''
            };
          }
        }
    }

    public static isLink(answer: string) {
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
          '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return !!pattern.test(answer);
    }

    public static isPath(answer: string) {
        var pattern = new RegExp('^.+\.(png|jpe?g)$','g');
        return !!pattern.test(answer);
    }

    public static filterLevels(levels: string[]) {
        return GlobalConstants.LEVELS.filter(level => {
          for (let i = 0; i < levels.length; i++) {
            if (levels[i] === '1ero-2do' && (level.code === '1ero' || level.code === '2do' || level.code === '2do-3ero')) {
              return false;
            }
            if (levels[i] === '2do' && (level.code === '1ero-2do' || level.code === '2do' || level.code === '2do-3ero')) {
              return false;
            }
            if (levels[i] === '5to' && (level.code === '4to-5to' || level.code === '5to')) {
              return false;
            }
            if (levels[i].includes(level.code)) {
              return false;
            }
            if (level.code.includes(levels[i])) {
              return false;
            }
          }
          return true;
        });
      }  

    public static concatenatePath(url: string, newPath: string) {
        const lastPath = url.split('/').pop();
        return lastPath ? `${url.replace(/\/[^/]*$/, '')}${newPath}${lastPath}` : url;
      }
    
    public static hasAtLeastOneOptionWithImageLink(options: Option[]) {
        return options?.some(option => this.isLink(option.answer)) || false;
    }

    public static hasAtLeastOneOptionWithImagePath(options: Option[]) {
        return options?.some(option => this.isPath(option.answer)) || false;
    }
    
    public static getDistributionLabels(distribution: Ranking[], constants: RadioOption[]) {
        return distribution.reduce((namesArr, obj) => {
          const matchingInstitution = constants.find(institution => institution.code === obj._id);
          if (matchingInstitution && matchingInstitution.name !== null) {
            namesArr.push(matchingInstitution.name);
          }
          return namesArr;
        }, [] as string[]); // Añadimos una anotación de tipo para evitar el error
    }

    public static getDesorderArray(array: string[]) {
        return array.sort((a, b) => 0.5 - Math.random());
    }

    public static capitalizeFirstLetters(word: string) {
        const arr = word.split(' ');
        for (var i = 0; i < arr.length; i++) {
          arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
        }
        return arr.join(' ');
    }

    public static convertDistributionToArray(distribution: Ranking[]) {
        var arr = [];
        for(let i=0; i<distribution.length; i++){
            if(distribution[i]._id) {
                arr.push(distribution[i].count);
            }
        }
        return arr;
    }

    public static translateMonth(month_en: string) {
        switch (month_en) {
            case 'January':
                return this.TRANSLATION.monthNames[0];
                break;
        
            case 'February':
                return this.TRANSLATION.monthNames[1];
                break;
        
            case 'March':
                return this.TRANSLATION.monthNames[2];
                break;
        
            case 'April':
                return this.TRANSLATION.monthNames[3];
                break;
        
            case 'May':
                return this.TRANSLATION.monthNames[4];
                break;
        
            case 'June':
                return this.TRANSLATION.monthNames[5];
                break;

            case 'July':
                return this.TRANSLATION.monthNames[6];
                break;
        
            case 'August':
                return this.TRANSLATION.monthNames[7];
                break;
        
            case 'September':
                return this.TRANSLATION.monthNames[8];
                break;
        
            case 'October':
                return this.TRANSLATION.monthNames[9];
                break;
        
            case 'November':
                return this.TRANSLATION.monthNames[10];
                break;
        
            case 'December':
                return this.TRANSLATION.monthNames[11];
                break;
        
            default:
                return '';
                break;
        }
    }

    public static getDateStringToLocale(backDays: number) {
        var date = dayjs().subtract(backDays, 'day');
        return `${this.capitalizeFirstLetters(this.translateMonth(date.format('MMMM')))} ${date.format('DD')}, ${date.format('YYYY')}`
    }
    
    public static getDateBackString(backDays: number) {
        return dayjs().subtract(backDays, 'day').format('YYYY-MM-DD');
    }
    
}