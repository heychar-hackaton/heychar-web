export type FormResult<T = object> = {
  errors?: string[];
  success?: boolean;
  data?: T;
};
