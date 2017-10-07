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
 * side           - "buy" または "sell"
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
