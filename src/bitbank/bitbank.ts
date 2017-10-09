import { Observable } from 'rxjs/Observable';
import { BitbankPublicApiHandler } from '../public-api-handler/public-api-handler';
import { BitbankPubnubHandler } from '../pubnub-handler/pubnub-handler';
import {
  BitbankApiCandlestick,
  BitbankApiCandlestickType,
  BitbankApiDepth,
  BitbankApiMultiOrdersResult,
  BitbankApiOrder,
  BitbankApiTicker,
  BitbankApiTransactions,
  BitbankApiWithdrawalRequestResult,
  BitbankApiWithdrawalResult,
} from '../api-response.type';
import {
  BitbankApiActiveOrdersOptions,
  BitbankApiCreateWithdrawalRequestOptions,
  BitbankApiOrderOptions,
  BitbankPrivateApiHandler,
  BitbankPrivateApiHandlerOptions,
} from '../private-api-handler/private-api-handler';


/**
 * Facade class for three bitbank api handlers.
 */
export class Bitbank {
  private publicApi: BitbankPublicApiHandler;
  private privateApi: BitbankPrivateApiHandler;
  private pubnubHandler: BitbankPubnubHandler;

  constructor(
    options: BitbankPrivateApiHandlerOptions,
  ) {
    this.publicApi = new BitbankPublicApiHandler();
    this.privateApi = new BitbankPrivateApiHandler(options);
    this.pubnubHandler = new BitbankPubnubHandler();
  }

  /**
   * GET: /{pair}/ticker
   */
  getTicker(pair: string): Observable<BitbankApiTicker> {
    return this.publicApi.getTicker(pair);
  }

  /**
   * GET: /{pair}/depth
   */
  getDepth(pair: string): Observable<BitbankApiDepth> {
    return this.publicApi.getDepth(pair);
  }

  /**
   * GET: /{pair}/transactions
   */
  getTransactions(pair: string, yyyymmdd?: string): Observable<BitbankApiTransactions> {
    return this.publicApi.getTransactions(pair, yyyymmdd);
  }

  /**
   * GET: /{pair}/candlestick
   */
  getCandlestick(pair: string, type: BitbankApiCandlestickType, yyyymmdd: string): Observable<BitbankApiCandlestick> {
    return this.publicApi.getCandlestick(pair, type, yyyymmdd);
  }

  /**
   * Get observable of ticker data published by pubnub.
   */
  getTicker$(pair: string): Observable<BitbankApiTicker> {
    return this.pubnubHandler.getTicker$(pair);
  }

  /**
   * Get observable of ticker data published by pubnub.
   */
  getDepth$(pair: string): Observable<BitbankApiDepth> {
    return this.pubnubHandler.getDepth$(pair);
  }

  /**
   * Get observable of transactions data published by pubnub.
   */
  getTransactions$(pair: string): Observable<BitbankApiTransactions> {
    return this.pubnubHandler.getTransactions$(pair);
  }

  /**
   * Get observable of candlestick data published by pubnub.
   */
  getCandlestick$(pair: string): Observable<BitbankApiCandlestick> {
    return this.pubnubHandler.getCandlestick$(pair);
  }

  /**
   * POST: /v1/user/spot/order
   */
  createOrder(options: BitbankApiOrderOptions): Observable<BitbankApiOrder> {
    return this.privateApi.createOrder(options);
  }

  /**
   * POST: /v1/user/spot/cancel_order
   */
  cancelOrder(pair: string, order_id: string): Observable<BitbankApiOrder> {
    return this.privateApi.cancelOrder(pair, order_id);
  }

  /**
   * POST: /v1/user/spot/cancel_orders
   */
  cancelOrders(pair: string, order_ids: string[]|number[]): Observable<BitbankApiMultiOrdersResult> {
    return this.privateApi.cancelOrders(pair, order_ids);
  }

  /**
   * GET: /v1/user/spot/order
   */
  getOrder(pair: string, order_id: string): Observable<BitbankApiOrder> {
    return this.privateApi.getOrder(pair, order_id);
  }

  /**
   * POST: /v1/user/spot/orders_info
   */
  getOrders(pair: string, order_ids: string[]): Observable<BitbankApiMultiOrdersResult> {
    return this.privateApi.getOrders(pair, order_ids);
  }

  /**
   * GET: /v1/user/spot/active_orders
   */
  getActiveOrders(pair: string, options?: BitbankApiActiveOrdersOptions): Observable<BitbankApiMultiOrdersResult> {
    return this.privateApi.getActiveOrders(pair, options);
  }

  /**
   * GET: /v1/user/withdrawal_account
   */
  getWithdrawAccount(asset: string): Observable<BitbankApiWithdrawalResult> {
    return this.privateApi.getWithdrawAccount(asset);
  }

  /**
   * POST: /v1/user/request_withdrawal
   *
   * @see - https://docs.bitbank.cc/#!/Withdraw/request_withdrawal
   */
  createWithdrawalRequest(options: BitbankApiCreateWithdrawalRequestOptions): Observable<BitbankApiWithdrawalRequestResult> {
    return this.privateApi.createWithdrawalRequest(options);
  }
}
