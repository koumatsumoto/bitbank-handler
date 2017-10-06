import { BitbankPubnubHandler } from './pubnub-handler';
import { first } from 'rxjs/operators/first';
import * as expect from 'expect';


let pubnubHandler: BitbankPubnubHandler;
const pair = 'btc_jpy';
describe('BitbankPubnubHandler', () => {
  beforeEach(() => {
    pubnubHandler = new BitbankPubnubHandler();
  });

  describe('#getTicker$', () => {
    it('should receive ticker data via pubnub properly', (done) => {
      pubnubHandler.getTicker$(pair).pipe(first())
        .subscribe(
          (ticker) => {
            expect(typeof ticker.sell).toBe('string');
            expect(Number.isFinite(+ticker.sell)).toBe(true);
            expect(typeof ticker.buy).toBe('string');
            expect(Number.isFinite(+ticker.buy)).toBe(true);
            expect(typeof ticker.high).toBe('string');
            expect(Number.isFinite(+ticker.high)).toBe(true);
            expect(typeof ticker.low).toBe('string');
            expect(Number.isFinite(+ticker.low)).toBe(true);
            expect(typeof ticker.last).toBe('string');
            expect(Number.isFinite(+ticker.last)).toBe(true);
            expect(typeof ticker.vol).toBe('string');
            expect(Number.isFinite(+ticker.vol)).toBe(true);
            expect(typeof ticker.timestamp).toBe('number');
          },
          () => {},
          () => done(),
        );
    });
  });

  describe('#getDepth$', () => {
    it('should receive ticker data via pubnub properly', (done) => {
      pubnubHandler.getDepth$(pair).pipe(first())
        .subscribe(
          (depth) => {
            expect(Array.isArray(depth.bids)).toBe(true);
            expect(Array.isArray(depth.bids[0])).toBe(true);
            expect(typeof depth.bids[0][0]).toBe('string');
            expect(Number.isFinite(+depth.bids[0][0])).toBe(true);
            expect(Array.isArray(depth.asks)).toBe(true);
            expect(Array.isArray(depth.asks[0])).toBe(true);
            expect(typeof depth.asks[0][0]).toBe('string');
            expect(Number.isFinite(+depth.asks[0][0])).toBe(true);
            expect(typeof depth.timestamp).toBe('number');
          },
          () => {},
          () => done(),
        );
    });
  });

  describe('#getTransactions$', () => {
    it('should receive ticker data via pubnub properly', (done) => {
      pubnubHandler.getTransactions$(pair).pipe(first())
        .subscribe(
          (data) => {
            expect(Array.isArray(data.transactions)).toBe(true);
            expect(data.transactions[0]).toBeTruthy();
            expect(typeof data.transactions[0].transaction_id).toBe('number');
            expect(data.transactions[0].side === 'buy' || data.transactions[0].side === 'sell').toBe(true);
            expect(typeof data.transactions[0].price).toBe('string');
            expect(Number.isFinite(+data.transactions[0].price)).toBe(true);
            expect(typeof data.transactions[0].amount).toBe('string');
            expect(Number.isFinite(+data.transactions[0].amount)).toBe(true);
            expect(typeof data.transactions[0].executed_at).toBe('number');
          },
          () => {},
          () => done(),
        );
    });
  });

  describe('#getCandlestick$', () => {
    it('should receive ticker data via pubnub properly', (done) => {
      pubnubHandler.getCandlestick$(pair).pipe(first())
        .subscribe(
          (data) => {
            expect(Array.isArray(data.candlestick)).toBe(true);
            const item = data.candlestick[0];
            expect(typeof item.type).toBe('string');
            expect(Array.isArray(item.ohlcv)).toBe(true);
            const cs = item.ohlcv[0];
            expect(typeof cs[0]).toBe('string');
            expect(Number.isFinite(+cs[0])).toBe(true);
            expect(typeof cs[1]).toBe('string');
            expect(Number.isFinite(+cs[1])).toBe(true);
            expect(typeof cs[2]).toBe('string');
            expect(Number.isFinite(+cs[2])).toBe(true);
            expect(typeof cs[3]).toBe('string');
            expect(Number.isFinite(+cs[3])).toBe(true);
            expect(typeof cs[4]).toBe('string');
            expect(Number.isFinite(+cs[4])).toBe(true);
            expect(typeof cs[5]).toBe('number');
          },
          () => {},
          () => done(),
        );
    });
  });
});
