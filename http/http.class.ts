import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { map, tap } from 'rxjs/operators';
import { BitbankApiResponse } from '../api-handler/api-response.type';


/**
 * Override type of data. <any> to <T>.
 */
interface AxiosHttpResponse<T> extends AxiosResponse {
  data: T;
}

/**
 * Http handler for bitbank.cc API.
 *
 * this uses axios internally and return only http response data as Observable.
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
}

/**
 * Internal function of Http.
 */
function throwErrorIfSuccessIs0(data: BitbankApiResponse<any>): void {
  if (!data.success) {
    throw new Error('bitbank.cc api success is not 1');
  }
}
