import { Http } from '../http/http';
import { Observable } from 'rxjs/Observable';
import { BitbankApiCandlestick, BitbankApiDepth, BitbankApiTicker, BitbankApiTransactions } from './api-response.type';

const publicApiBaseUrl = 'https://public.bitbank.cc/';
const privateApiBaseUrl = 'https://api.bitbank.cc/v1/';

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
  getCandlestick(pair: string, type: CandlestickType, yyyymmdd: string): Observable<BitbankApiCandlestick> {
    return this.publicRequest(`${pair}/candlestick/${type}/${yyyymmdd}`);
  }

  /**
   * Base method to request public api-handler.
   */
  private publicRequest<T>(path: string, params: {[key: string]: any} = {}) {
    const url = publicApiBaseUrl + path;
    const options = { params: { ...params } };
    return this.http.get<T>(url, options);
  }
}

/**
 * apiKey and apiSecret are required if user uses private-api.
 */
interface BitbankApiHandlerOptions {
  apiKey?: string;
  apiSecret?: string;
}

type CandlestickType = '1min' | '5min' | '15min' | '30min' | '1hour' | '4hour' | '8hour' | '12hour' | '1day' | '1week';
