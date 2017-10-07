import * as qs from 'qs';
import { HmacSHA256 } from 'crypto-js';
import { Observable } from 'rxjs/Observable';
import { Http } from '../http/http';
import {
  BitbankApiCandlestick,
  BitbankApiCandlestickType,
  BitbankApiDepth,
  BitbankApiTicker,
  BitbankApiTransactions, BitbankApiUserAssets,
} from './api-response.type';


const publicApiBaseUrl = 'https://public.bitbank.cc/';
const privateApiBaseUrl = 'https://api.bitbank.cc/v1/';


/**
 * Class to handle bitbank api.
 */
export class BitbankApiHandler {
  private http = new Http();

  constructor(
    private options: BitbankApiHandlerOptions = {},
  ) {}

  /**
   * GET: /{pair}/ticker
   */
  getTicker(pair: string): Observable<BitbankApiTicker> {
    return this.publicRequest(`${pair}/ticker`);
  }

  /**
   * GET: /{pair}/depth
   */
  getDepth(pair: string): Observable<BitbankApiDepth> {
    return this.publicRequest(`${pair}/depth`);
  }

  /**
   * GET: /{pair}/transactions
   */
  getTransactions(pair: string, yyyymmdd?: string): Observable<BitbankApiTransactions> {
    const url = yyyymmdd ? `${pair}/transactions/${yyyymmdd}` : `${pair}/transactions`;
    return this.publicRequest(url);
  }

  /**
   * GET: /{pair}/candlestick
   */
  getCandlestick(pair: string, type: BitbankApiCandlestickType, yyyymmdd: string): Observable<BitbankApiCandlestick> {
    return this.publicRequest(`${pair}/candlestick/${type}/${yyyymmdd}`);
  }

  /**
   * GET: /user/assets
   */
  getUserAssets(): Observable<BitbankApiUserAssets> {
    return this.privateGetRequest<Observable<BitbankApiUserAssets>>('/user/assets');
  }

  /**
   * For get request to public api.
   */
  private publicRequest<T>(path: string): Observable<T> {
    const url = publicApiBaseUrl + path;
    return this.http.get<T>(url);
  }

  /**
   * Use to credential request.
   *
   * @throw - Error be thrown if credential data lacks.
   */
  private privateGetRequest<T>(path: string, query?: {[key: string]: any}): Observable<T> {
    // Error can be thrown here.
    this.checkApiKeyAndSecretBeforeRequest();

    const url = privateApiBaseUrl + path;
    const queryString = url + getJSONorEmptyString(query);
    return this.http.get(url, {
      headers: this.makeHeaderToPrivateRequest(queryString),
    });
  }

  /**
   * Make header object to private api-request from query string.
   *
   * @param {string} queryString
   * @returns {object}
   */
  private makeHeaderToPrivateRequest(queryString: string) {
    const nonce = new Date().getTime();
    const message = nonce + queryString;
    return {
      'Content-Type': 'application/json',
      'ACCESS-KEY': this.options.apiKey,
      'ACCESS-NONCE': nonce,
      'ACCESS-SIGNATURE': HmacSHA256(this.options.apiSecret, message),
    };
  }

  /**
   * Check user can use private request.
   *
   * @throws {Error}
   */
  private checkApiKeyAndSecretBeforeRequest(): void {
    if (!this.options.apiKey || !this.options.apiSecret) {
      throw new Error('api-handler-key and api-handler-secret are required to request private api-handler.');
    }
  }
}

/**
 * apiKey and apiSecret are required if user uses private-api.
 */
interface BitbankApiHandlerOptions {
  apiKey?: string;
  apiSecret?: string;
}

/**
 * JSON.stringify wrapped with try-catch.
 *
 * @param data - target contents to json-stringify.
 * @returns {string} - json, or empty-string if invalid data passed.
 */
function getJSONorEmptyString(data?: any): string {
  let result = '';
  try {
    result = JSON.stringify(data);
  } catch {
    // do nothing when error.
  }

  return result;
}
