import { BitbankApiHandler } from './api-hander';
import * as expect from 'expect';
import moment = require('moment');


describe('BitbankApiHandler', () => {
  const pair = 'btc_jpy';


  describe('Public Api', () => {
    let api: BitbankApiHandler;
    before(() => {
      api = new BitbankApiHandler();
    });

    describe('#getTicker', () => {
      it('should fetch expected data from api properly.', (done) => {
        api.getTicker(pair)
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

      it('should failed when invalid pair passes', (done) => {
        api.getTicker('invalid-pair')
          .subscribe(
            () => {},
            (error) => {
              // This is error of axios.
              expect(error.message).toBe('Request failed with status code 404');
              done();
            },
          );
      });
    });

    describe('#getDepth', () => {
      it('should fetch expected data from api properly.', (done) => {
        api.getDepth(pair)
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

      it('should failed when invalid pair passes', (done) => {
        api.getDepth('invalid-pair')
          .subscribe(
            () => {},
            (error) => {
              // This is error of axios.
              expect(error.message).toBe('Request failed with status code 404');
              done();
            },
          );
      });
    });

    describe('#getTransactions', () => {
      it('should fetch expected data from api properly.', (done) => {
        api.getTransactions(pair)
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

      it('should fetch specific day transactions by using the yyyymmdd param.', (done) => {
        api.getTransactions(pair, moment().subtract(2, 'day').format('YYYYMMDD'))
          .subscribe(
            (data) => {
              expect(Array.isArray(data.transactions)).toBeTruthy();
            },
            () => {},
            () => done(),
          );
      });

      it('should failed when invalid pair passes', (done) => {
        api.getTransactions('invalid-pair')
          .subscribe(
            () => {},
            (error) => {
              // This is error of axios.
              expect(error.message).toBe('Request failed with status code 404');
              done();
            },
          );
      });
    });

    describe('#getCandlestick', () => {
      it('should fetch expected data from api properly.', (done) => {
        api.getCandlestick(pair, '1hour', moment().subtract(1, 'day').format('YYYYMMDD'))
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
            () => {
            },
            () => done(),
          );
      });

      it('should failed when invalid pair passes', (done) => {
        api.getCandlestick('invalid-pair', '1min', moment().subtract(1, 'd').format('YYYYMMDD'))
          .subscribe(
            () => {},
            (error) => {
              // This is error of axios.
              expect(error.message).toBe('Request failed with status code 404');
              done();
            },
          );
      });
    });
  });
});
