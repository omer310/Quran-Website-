import moment from 'moment';

declare module 'moment' {
  interface Moment {
    format(format?: string): string;
    iYear(): number;
    iMonth(): number;
    iDate(): number;
    iDayOfYear(): number;
    iWeek(): number;
    iWeekday(): number;
    iDayOfYear(): number;
    add(amount?: number, unit?: moment.unitOfTime.DurationConstructor): moment.Moment;
    subtract(amount?: number, unit?: moment.unitOfTime.DurationConstructor): moment.Moment;
  }

  function iDaysInMonth(year: number, month: number): number;
}

declare module 'moment-hijri' {
  import moment from 'moment';
  
  interface MomentHijri extends moment.Moment {
    iDate(): number;
    iMonth(): number;
    iYear(): number;
    format(format?: string): string;
  }

  function momentHijri(inp?: moment.MomentInput, format?: moment.MomentFormatSpecification, strict?: boolean): MomentHijri;
  
  namespace momentHijri {
    export function iConvert(inp?: moment.MomentInput, format?: moment.MomentFormatSpecification, strict?: boolean): MomentHijri;
  }

  export = momentHijri;
}
