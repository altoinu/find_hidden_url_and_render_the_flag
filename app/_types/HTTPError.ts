export class HTTPError extends Error {
  method: string;
  url: string;
  status: number;

  constructor(method: string, url: string, status: number) {
    super(`${method} ${url} (status: ${status})`);

    this.method = method;
    this.status = status;
    this.url = url;

    Object.setPrototypeOf(this, HTTPError.prototype);
  }
}
