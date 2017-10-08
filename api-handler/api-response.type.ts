/**
 * Common response schema.
 *
 * @see: https://docs.bitbank.cc/
 */
export interface BitbankApiResponse<T> {
  success: 0|1;
  data: T;
}

/**
 * common data interface of error response.
 *
 * @see: https://docs.bitbank.cc/
 *
 */
export interface BitbankApiErrorData {
  code: number;
}

/**
 * GET: /{pair}/ticker
 *
 * @see: https://docs.bitbank.cc/#!/Ticker/ticker
 *
 * sell - 現在の売り注文の最安値
 * buy  - 現在の買い注文の最高値
 * high - 過去24時間の最高値取引価格
 * low  - 過去24時間の最安値取引価格
 * last - 最新取引価格
 * vol  - 過去24時間の出来高
 */
export interface BitbankApiTicker {
  sell: string;
  buy: string;
  high: string;
  low: string;
  last: string;
  vol: string;
  timestamp: number;
}

/**
 * GET: /{pair}/depth
 *
 * @see: https://docs.bitbank.cc/#!/Depth/depth
 *
 * asks - 売り板 [価格, 数量]
 * bids - 買い板 [価格, 数量]
 */
export interface BitbankApiDepth {
  asks: BitbankApiDepthData[];
  bids: BitbankApiDepthData[];
  timestamp: number;
}

/**
 * Each depth data.
 */
type BitbankApiDepthData = [ string, string ];

/**
 * GET: /{pair}/transactions
 *
 * @see: https://docs.bitbank.cc/#/Transactions
 *
 */
export interface BitbankApiTransactions {
  transactions: BitbankApiTransactionData[];
}

/**
 * Each transaction data.
 *
 * transaction_id - 取引ID
 * side           - buy または sell
 * price          - 価格
 * amount         - 数量
 * executed_at    - 約定日時（UnixTimeのミリ秒）
 */
interface BitbankApiTransactionData {
  transaction_id: number;
  side: 'buy' | 'sell';
  price: string;
  amount: string;
  executed_at: number;
}

/**
 * GET: /{pair}/candlestick
 *
 * @see: https://docs.bitbank.cc/#!/Candlestick/candlestick
 *
 */
export interface BitbankApiCandlestick {
  candlestick: BitbankApiCandlestickData[];
}

/**
 * Each candlestick data.
 *
 * type  - キャンドルスティックの種類
 * ohlcv - [始値, 高値, 安値, 終値, 出来高, UnixTime]
 */
interface BitbankApiCandlestickData {
  type: BitbankApiCandlestickType;
  ohlcv: [string, string, string, string, string, number][];
}

export type BitbankApiCandlestickType = '1min' | '5min' | '15min' | '30min' | '1hour' | '4hour' | '8hour' | '12hour' | '1day' | '1week';

/**
 * GET: /user/assets
 *
 * @see: https://docs.bitbank.cc/#!/Assets/user_asset
 */
export interface BitbankApiAssets {
  assets: BitbankApiAsset[];
}

/**
 * asset - アセット名
 * amount_precision - 小数点の表示精度
 * onhand_amount - 保有量
 * locked_amount - ロックされている量
 * free_amount - 利用可能な量
 * withdrawal_fee - 引き出し手数料
 */
interface BitbankApiAsset {
  asset: string;
  amount_precision: number;
  onhand_amount: string;
  locked_amount: string;
  free_amount: string;
  withdrawal_fee: string;
}

/**
 * order_id 取引ID
 * pair 通貨ペア。btc_jpy, xrp_jpy, ltc_btc, eth_btc, mona_jpy, mona_btc, bcc_jpy, bcc_btc
 * side -buy または sell
 * type -limit または market
 * start_amount - 注文時の数量
 * remaining_amount - 未約定の数量
 * executed_amount - 約定済み数量
 * price - 注文価格
 * average_price - 平均約定価格
 * ordered_at - 注文日時(UnixTimeのミリ秒)
 * status - 注文ステータス
 */
export interface BitbankApiOrder {
  order_id: number;
  pair: string;
  side: 'buy' | 'sell';
  type: 'limit' | 'market';
  start_amount: string;
  remaining_amount: string;
  executed_amount: string;
  price: string;
  average_price: string;
  ordered_at: number;
  status: BitbankOrderStatus;
}

export interface BitbankApiMultiOrdersResult {
  orders: BitbankApiOrder[];
}

/**
 * UNFILLED - 注文中
 * PARTIALLY_FILLED - 注文中(一部約定)
 * FULLY_FILLED - 約定済み
 * CANCELED_UNFILLED - 取消済
 * CANCELED_PARTIALLY_FILLED - 取消済(一部約定)
 */
type BitbankOrderStatus = 'UNFILLED' | 'PARTIALLY_FILLED' | 'FULLY_FILLED' | 'CANCELED_UNFILLED' | 'CANCELED_PARTIALLY_FILLED';
