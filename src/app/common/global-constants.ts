import { DateOption } from "../pages/interfaces/date-option.interfaces";
import { LevelOption } from "../tests/interfaces/level-option.interface";

export class GlobalConstants {
    public static MIN_DATE_EDITION: number = 2002;
    public static SITE_TITLE: string = 'administrador-canguromath-app';
    public static LEVELS: LevelOption[] = [
        {name: '1ero', code: '1ero'},
        {name: '1ero y 2do', code: '1ero-2do'},
        {name: '2do', code: '2do'},
        {name: '2do y 3ero', code: '2do-3ero'},
        {name: '3ero', code: '3ero'},
        {name: '4to', code: '4to'},
        {name: '4to y 5to', code: '4to-5to'},
        {name: '5to', code: '5to'}
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
        {name: 'Ayer', code: 'yesterday'},
        {name: 'Últimos 7 días', code: 'last-7days'},
        {name: 'Últimos 30 días', code: 'last-30days'},
        {name: 'Rango de fecha personalizado', code: 'customize'},
    ]
    public static UPLOAD_OPTIONS: [
        'Automática',
        'Manual'
    ]
}