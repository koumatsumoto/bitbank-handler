import * as qs from 'qs';
import { createHmac } from 'crypto';
import { Observable } from 'rxjs/Observable';
import { Http } from '../http/http';
import {
  BitbankApiAssets,
  BitbankApiOrder,
  BitbankApiCandlestick,
  BitbankApiCandlestickType,
  BitbankApiDepth,
  BitbankApiMultiOrdersResult,
  BitbankApiTicker,
  BitbankApiTransactions,
} from './api-response.type';


const publicApiBaseUrl = 'https://public.bitbank.cc/';
const privateApiBaseUrl = 'https://api.bitbank.cc';


/**
 * Class to handle bitbank api.
 */
export class BitbankApiHandler {
  private http = new Http();
  private apiKey = '';
  private apiSecret = '';

  constructor(
    options: BitbankApiHandlerOptions = {},
  ) {
    this.apiKey = options.apiKey || '';
    this.apiSecret = options.apiSecret || '';
  }

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
  getAssets(): Observable<BitbankApiAssets> {
    return this.privateGetRequest<BitbankApiAssets>('/v1/user/assets');
  }

  /**
   * POST: /user/spot/order
   */
  createOrder(options: BitbankApiOrderOptions): Observable<BitbankApiOrder> {
    return this.privatePostRequest<BitbankApiOrder>('/v1/user/spot/order', options);
  }

  /**
   * POST: /user/spot/cancel_order
   */
  cancelOrder(pair: string, order_id: string): Observable<BitbankApiOrder> {
    return this.privatePostRequest<BitbankApiOrder>('/v1/user/spot/cancel_order', { pair, order_id });
  }

  /**
   * POST: /user/spot/cancel_orders
   */
  cancelOrders(pair: string, order_ids: string[]): Observable<BitbankApiMultiOrdersResult> {
    return this.privatePostRequest<BitbankApiMultiOrdersResult>('/v1/user/spot/cancel_orders', { pair, order_ids });
  }

  /**
   * GET: /user/spot/order
   */
  getOrder(pair: string, order_id: string): Observable<BitbankApiOrder> {
    return this.privateGetRequest<BitbankApiOrder>('/v1/user/spot/order', { pair, order_id });
  }

  /**
   * POST: /user/spot/orders_info
   */
  getOrders(pair: string, order_ids: string[]): Observable<BitbankApiMultiOrdersResult> {
    return this.privatePostRequest<BitbankApiMultiOrdersResult>('/v1/user/spot/orders_info', { pair, order_ids });
  }

  /**
   * GET: /user/spot/active_orders
   */
  getActiveOrders(pair: string, options: BitbankApiActiveOrdersOptions = {}): Observable<BitbankApiMultiOrdersResult> {
    return this.privateGetRequest<BitbankApiMultiOrdersResult>('/v1/user/spot/active_orders', { pair, ...options });
  }

  /**
   * For get request to public api.
   */
  private publicRequest<T>(path: string): Observable<T> {
    const url = publicApiBaseUrl + path;
    return this.http.get<T>(url);
  }

  /**
   * Get request to private api.
   *
   * @throw - Error be thrown if credential data lacks.
   */
  private privateGetRequest<T>(path: string, query?: {[key: string]: any}): Observable<T> {
    // Error can be thrown here.
    this.checkApiKeyAndSecretBeforeRequest();

    const queryString = query ? `?${qs.stringify(query)}` : '';
    const url = privateApiBaseUrl + path + queryString;
    const options = this.getOptionsToPrivateRequest(path + queryString);
    return this.http.get(url, options);
  }

  /**
   * Post request to private api.
   *
   * @throw - Error be thrown if credential data lacks.
   */
  private privatePostRequest<T>(path: string, body: {[key: string]: any}): Observable<T> {
    // Error can be thrown here.
    this.checkApiKeyAndSecretBeforeRequest();

    const json = getJSONorEmptyString(body);
    const url = privateApiBaseUrl + path;
    const options = this.getOptionsToPrivateRequest(json);
    return this.http.post(url, body, options);
  }

  /**
   * Make header object to private api-request from query string.
   *
   * @param {string} queryString
   * @returns {object}
   */
  private getOptionsToPrivateRequest(queryString: string): {[k: string]: any} {
    const nonce = new Date().getTime();
    const message = nonce + queryString;
    const headers = {
      'Content-Type': 'application/json',
      'ACCESS-KEY': this.apiKey,
      'ACCESS-NONCE': nonce,
      'ACCESS-SIGNATURE': createHmac('sha256', this.apiSecret).update(new Buffer(message)).digest('hex').toString(),
    };
    return { headers };
  }

  /**
   * Check user can use private request.
   *
   * @throws {Error}
   */
  private checkApiKeyAndSecretBeforeRequest(): void {
    if (!this.apiKey || !this.apiSecret) {
      throw new Error('both api-key and api-secret are required to private api request.');
    }
  }
}


/**
 * JSON.stringify wrapped with try-catch.
 *
 * If data does not pass, return empty string.
 *
 * @param data - target contents to json-stringify.
 * @returns {string} - json, or empty-string if invalid data passed.
 */
function getJSONorEmptyString(data?: any): string {
  if (!data) {
    return '';
  }

  let result = '';
  try {
    result = JSON.stringify(data);
  } catch {
    // do nothing when error.
  }

  return result;
}

/**
 * apiKey and apiSecret are required if user uses private-api.
 */
interface BitbankApiHandlerOptions {
  apiKey?: string;
  apiSecret?: string;
}

/**
 * @see: https://docs.bitbank.cc/#!/Order/order
 */
export interface BitbankApiOrderOptions {
  pair: string;
  amount: number;
  price: number;
  side: 'buy' | 'sell';
  type: 'limit' | 'market';
}

/**
 * @see: https://docs.bitbank.cc/#!/Order/active_orders
 */
interface BitbankApiActiveOrdersOptions {
  count?: number;
  from_id?: number;
  end_id?: number;
  since?: number;
  end?: number;
}
