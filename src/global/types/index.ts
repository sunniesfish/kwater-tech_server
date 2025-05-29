export enum Day {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

type OnlyOne<T, K extends keyof T = keyof T> = K extends keyof T
  ? { [P in K]: T[P] } & Partial<Record<Exclude<keyof T, K>, never>>
  : never;

type RawDivision = {
  division: string;
  manager: 'manager';
  all: 'all';
};

export type Division = OnlyOne<RawDivision>;

export interface IUser {
  key: string;
  division: Division;
  divisionName: string;
}

export interface IAlarm {
  id: string;
  day: Day;
  hour: number;
  minute: number;
  repeat: boolean;
  lastTriggered?: number;
  title: string;
  musicId: string;
}

export interface IMusic {
  id: string;
  name: string;
  upload_date: Date;
  duration: number;
  file: Buffer;
}
