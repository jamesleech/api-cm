export interface JSONResponse {
  statusCode: number;
  body: string;
  headers?: {
    [header: string]: boolean | number | string;
  };
}
