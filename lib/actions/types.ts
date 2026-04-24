export type ActionResult<T = undefined> = {
  success: boolean;
  error: string | null;
  data?: T;
};

export type RedirectActionData = {
  redirectTo: string;
};
