import { FilterSize, FilterVariant } from '../filter.models';

export const CHIP_SIZE: Record<FilterSize, string> = {
  xs: 'text-[10px] py-0.5 pl-2 pr-1 gap-1',
  sm: 'text-xs py-1 pl-2.5 pr-1.5 gap-1.5',
  md: 'text-sm py-1.5 pl-3 pr-2 gap-1.5',
  lg: 'text-base py-2 pl-3.5 pr-2.5 gap-2',
  xl: 'text-lg py-2.5 pl-4 pr-3 gap-2.5',
};

export const CHIP_VARIANT: Record<FilterVariant, string> = {
  default: 'border-base-300 bg-base-200 text-base-content hover:bg-base-300',
  primary: 'border-primary/30 bg-primary/10 text-primary hover:bg-primary/20',
  secondary: 'border-secondary/30 bg-secondary/10 text-secondary hover:bg-secondary/20',
  accent: 'border-accent/30 bg-accent/10 text-accent hover:bg-accent/20',
  info: 'border-info/30 bg-info/10 text-info hover:bg-info/20',
  success: 'border-success/30 bg-success/10 text-success hover:bg-success/20',
  warning: 'border-warning/30 bg-warning/10 text-warning hover:bg-warning/20',
  error: 'border-error/30 bg-error/10 text-error hover:bg-error/20',
};

export const FIELD_SIZE: Record<FilterSize, string> = {
  xs: 'text-[10px]',
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
};

export const INPUT_TYPE_BY_FIELD: Record<string, string> = {
  number: 'number',
  email: 'email',
  url: 'url',
  date: 'date',
  datetime: 'datetime-local',
  month: 'month',
  time: 'time',
};

export const INPUT_MODE_BY_FIELD: Record<string, string> = {
  cpf: 'numeric',
  number: 'numeric',
  email: 'email',
  url: 'url',
};

export const INPUT_MASK_BY_FIELD: Partial<Record<string, string>> = {
  cpf: '000.000.000-00',
  cnpj: 'SS.SSS.SSS/SSSS-SS',
};
