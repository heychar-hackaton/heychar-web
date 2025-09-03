export type FormResult<T = object> = {
  errors?: string[];
  success?: boolean;
  data?: T;
};

export type TStat = {
  label: string;
  icon: React.ElementType;
  value: number;
  description: string;
  link: string;
};
