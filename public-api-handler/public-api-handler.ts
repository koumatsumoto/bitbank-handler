import { Observable } from 'rxjs/Observable';
import { Http } from '../http/http';
import {
  BitbankApiCandlestick,
  BitbankApiCandlestickType,
  BitbankApiDepth,
  BitbankApiTicker,
  BitbankApiTransactions,
} from '../api-response.type';


/**
 * base url of bitbank.cc public api.
 *
 * @see https://docs.bitbank.cc/
 */
const publicApiBaseUrl = 'https://public.bitbank.cc';


/**
 * Class to handle bitbank public api.
 */
export class BitbankPublicApiHandler {
  /**
   * Http can be dependency-injection.
   * If you want to handle your http response, use your http classes.
   *
   * @param {object} http - http client which returns http result as Observable.
   */
  constructor(
    private http = new Http(),
  ) {}

  /**
   * GET: /{pair}/ticker
   */
  getTicker(pair: string): Observable<BitbankApiTicker> {
    return this.publicRequest(`/${pair}/ticker`);
  }

  /**
   * GET: /{pair}/depth
   */
  getDepth(pair: string): Observable<BitbankApiDepth> {
    return this.publicRequest(`/${pair}/depth`);
  }

  /**
   * GET: /{pair}/transactions
   */
  getTransactions(pair: string, yyyymmdd?: string): Observable<BitbankApiTransactions> {
    const url = yyyymmdd ? `/${pair}/transactions/${yyyymmdd}` : `/${pair}/transactions`;
    return this.publicRequest(url);
  }

  /**
   * GET: /{pair}/candlestick
   */
  getCandlestick(pair: string, type: BitbankApiCandlestickType, yyyymmdd: string): Observable<BitbankApiCandlestick> {
    return this.publicRequest(`/${pair}/candlestick/${type}/${yyyymmdd}`);
  }

  /**
   * For get request to public api.
   */
  private publicRequest<T>(path: string): Observable<T> {
    const url = publicApiBaseUrl + path;
    return this.http.get<T>(url);
  }
}
