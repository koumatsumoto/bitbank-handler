/**
 * Common response schema.
 */
export interface BitbankApiResponse<T> {
  success: 0|1;
  data: T;
}

/**
 * GET: /{pair}/ticker
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
 * transaction_id - 取引ID
 * side           - "buy" または "sell"
 * price          - 価格
 * amount         - 数量
 * executed_at    - 約定日時（UnixTimeのミリ秒）
 */
export interface BitbankApiTransactions {
  transactions: BitbankApiTransactionData[];
}

/**
 * Each transaction data.
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
 * type  -
 * ohlcv - [始値, 高値, 安値, 終値, 出来高, UnixTime]
 */
export interface BitbankApiCandlestick {
  candlestick: BitbankApiCandlestickData[];
}

/**
 * Each transaction data.
 */
interface BitbankApiCandlestickData {
  type: string;
  ohlcv: [string, string, string, string, string, number][];
}
