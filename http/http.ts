import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { map, tap } from 'rxjs/operators';
import { BitbankApiErrorData, BitbankApiResponse } from '../api-response.type';


/**
 * Http handler for bitbank.cc API.
 *
 * this uses axios module internally and return only http response data as Observable.
 */
export class Http {
  get<T>(url: string, options?: AxiosRequestConfig): Observable<T> {
    return fromPromise<AxiosHttpResponse<BitbankApiResponse<T>>>(<any>axios.get(url, options))
      .pipe(
        map(res => res.data),
        tap(data => throwErrorIfSuccessIs0(data)),
        map(data => data.data),
      );
  }

  post<T>(url: string, body: {[key: string]: any}, options?: AxiosRequestConfig): Observable<T> {
    return fromPromise<AxiosHttpResponse<BitbankApiResponse<T>>>(<any>axios.post(url, body, options))
      .pipe(
        map(res => res.data),
        tap(data => throwErrorIfSuccessIs0(data)),
        map(data => data.data),
      );
  }
}

/**
 * Internal function of Http.
 *
 * all api result whose success is 0 has common interface.
 */
function throwErrorIfSuccessIs0(data: BitbankApiResponse<any>): void {
  if (data.success === 0) {
    const errorResult = <BitbankApiErrorData>data.data;
    throw new Error(`bitbank.cc api error, ${errorResult.code}`);
  }
}

/**
 * Override axios response's interface to enable generics.
 *
 * data: any -> data: T
 */
interface AxiosHttpResponse<T> extends AxiosResponse {
  data: T;
}
