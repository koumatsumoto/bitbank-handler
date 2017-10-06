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
});
