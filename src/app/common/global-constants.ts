import { DateOption } from "../pages/interfaces/date-option.interfaces";
import { Ranking } from "../pages/interfaces/ranking.interfaces";
import { RadioOption } from "./radio-option.interface";
import * as dayjs from 'dayjs'

export class GlobalConstants {
    public static MIN_DATE_EDITION: number = 2002;
    public static MAX_DATE_EDITION: number = (new Date()).getFullYear();
    public static randomNumber: number;
    
    public static generateRandomSuffix() {
        this.randomNumber = Math.floor(Math.random() * 1000);
    }

    public static getRandomSuffix() : number {
        return this.randomNumber;
    }

    public static getRandomName(preffix: string) {
        return `${ preffix }-${ GlobalConstants.getRandomSuffix() }`
    }

    
    public static SITE_TITLE: string = 'administrador-canguromath-app';

    public static OPTIONS_LETTERS: string[] = ['A', 'B', 'C', 'D', 'E'];
    
    public static LEVELS: RadioOption[] = [
        {name: '1ero', code: '1ero'},
        {name: '1ero y 2do', code: '1ero-2do'},
        {name: '2do', code: '2do'},
        {name: '2do y 3ero', code: '2do-3ero'},
        {name: '3ero', code: '3ero'},
        {name: '4to', code: '4to'},
        {name: '4to y 5to', code: '4to-5to'},
        {name: '5to', code: '5to'}
    ]

    public static CATEGORIES: RadioOption[] = [
        {name: 'Álgebra', code: 'algebra'},
        {name: 'Geometría', code: 'geometria'},
        {name: 'Combinatoria', code: 'combinatoria'},
        {name: 'Teoría de Números', code: 'teoria-numeros'},
        {name: 'Sin categoría', code: 'sin-categoria'},
    ]

    public static TRANSLATION = {
        monthNames: [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre" ],
        monthNamesShort: [ "ene","feb","mar","abr","may","jun", "jul","ago","sep","oct","nov","dic" ],
        dayNames: [ "domingo","lunes","martes","miércoles","jueves","viernes","sábado" ],
        dayNamesShort: [ "dom","lun","mar","mié","jue","vie","sáb" ],
        dayNamesMin: [ "D","L","M","X","J","V","S" ],
        dateFormat: "dd/mm/yy",
    }

    public static DATE_OPTIONS: DateOption[] = [
        {name: 'Desde el comienzo', code: 'beginning'},
        {name: 'Hoy', code: 'today'},
        {name: 'Ayer', code: 'yesterday'},
        {name: 'Últimos 7 días', code: 'last-7days'},
        {name: 'Últimos 30 días', code: 'last-30days'},
        {name: 'Rango de fecha personalizado', code: 'customize'},
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
        {name: 'Femenino', code: 'F'},
        {name: 'Masculino', code: 'M'},
    ]

    public static STATES = [
        {
            code: "amazonas",
            name: "Amazonas"
        },
        {
            code: "anzoategui",
            name: "Anzoátegui"
        },
        {
            code: "apure",
            name: "Apure"
        },
        {
            code: "aragua",
            name: "Aragua"
        },
        {
            code: "barinas",
            name: "Barinas"
        },
        {
            code: "bolivar",
            name: "Bolívar"
        },
        {
            code: "carabobo",
            name: "Carabobo"
        },
        {
            code: "cojedes",
            name: "Cojedes"
        },
        {
            code: "delta-amacuro",
            name: "Delta Amacuro"
        },
        {
            code: "distrito-capital",
            name: "Distrito Capital"
        },
        {
            code: "falcon",
            name: "Falcón"
        },
        {
            code: "guarico",
            name: "Guárico"
        },
        {
            code: "la-guaira",
            name: "La Guaira"
        },
        {
            code: "lara",
            name: "Lara"
        },
        {
            code: "merida",
            name: "Mérida"
        },
        {
            code: "miranda",
            name: "Miranda"
        },
        {
            code: "monagas",
            name: "Monagas"
        },
        {
            code: "nueva-esparta",
            name: "Nueva Esparta"
        },
        {
            code: "portuguesa",
            name: "Portuguesa"
        },
        {
            code: "sucre",
            name: "Sucre"
        },
        {
            code: "tachira",
            name: "Táchira"
        },
        {
            code: "trujillo",
            name: "Trujillo"
        },
        {
            code: "yaracuy",
            name: "Yaracuy"
        },
        {
            code: "zulia",
            name: "Zulia"
        }
    ]
    
    public static USER_TYPE_LABELS = [
        'Estudiante',
        'Profesor',
        'Aficionado'
    ]

    public static LEVELS_LABELS = [
        "1er Año",
        "2do Año",
        "3er Año",
        "4to Año",
        "5to Año",
        "Universitario"
    ]

    public static LEVELS_COLORS = [
        "#e5c975",
        "#d5ae87",
        "#d87505",
        "#9f765a",
        "#8e3a20",
        "#2e2925"
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
        "#d93661",
        "#0777bf",
        "#5b7671",
        "#467689",
        "#7bb2af"
    ]

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

    public static arrayDifference<T>(array1: T[], array2: T[]): T[] {
        const difference: T[] = [];
        for (const element of array1) {
          if (!array2.includes(element)) {
            difference.push(element);
          }
        }
        return difference;
    }

    public static getLabelsDistribution( distribution: Ranking[] ) {
        const arr = [];
        for(let i=0; i<distribution.length; i++){
            if(distribution[i]._id) {
                arr.push(this.capitalizeFirstLetters(distribution[i]._id));
            }
        }
        return arr;
    }

    public static getDesorderArray(array: string[]) {
        return array.sort((a, b) => 0.5 - Math.random());
    }

    public static capitalizeFirstLetters( word: string ) {
        const arr = word.split(" ");
        for (var i = 0; i < arr.length; i++) {
          arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
        }
        return arr.join(" ");
    }

    public static convertDistributionToArray( distribution: Ranking[] ){
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

    public static getDateStringToLocale( backDays: number ){
        var date = dayjs().subtract(backDays, 'day');
        return `desde ${this.capitalizeFirstLetters(this.translateMonth(date.format('MMMM')))} ${date.format('DD')}, ${date.format('YYYY')}`
    }
    
    public static getDateBackString( backDays: number ){
        return dayjs().subtract(backDays, 'day').format('YYYY-MM-DD');
    }
    
}