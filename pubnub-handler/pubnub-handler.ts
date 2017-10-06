import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import {
  BitbankApiCandlestick, BitbankApiDepth, BitbankApiTicker, BitbankApiTransactions,
} from '../api-handler/api-response.type';
import { PubNub, PubNubMessageData } from './pubnub.type';
const PubNub = require('pubnub');

const bitbankPubNubSubscribeKey = 'sub-c-e12e9174-dd60-11e6-806b-02ee2ddab7fe';


export class BitbankPubnubHandler {
  private pubnub: PubNub = new PubNub({ subscribeKey: bitbankPubNubSubscribeKey });

  /**
   * Subjects of tickers for each pubnub channel, depths and etc.
   *
   * key is pubnub channel name.
   */
  private subjectMap = new Map<string, ReplaySubject<any>>();

  constructor() {
    this.initializePubNub();
  }

  /**
   * Get Ticker data stream via pubnub.
   */
  getTicker$(pair: string): Observable<BitbankApiTicker> {
    const channelName = 'ticker' + '_' + pair;
    return this.handlePubNubChannelAndGetItsObservable<BitbankApiTicker>(channelName);
  }

  /**
   * Get depth data stream via pubnub..
   */
  getDepth$(pair: string): Observable<BitbankApiDepth> {
    const channelName = 'depth' + '_' + pair;
    return this.handlePubNubChannelAndGetItsObservable<BitbankApiDepth>(channelName);
  }

  /**
   * Get transactions data stream via pubnub..
   */
  getTransactions$(pair: string): Observable<BitbankApiTransactions> {
    const channelName = 'transactions' + '_' + pair;
    return this.handlePubNubChannelAndGetItsObservable<BitbankApiTransactions>(channelName);
  }

  /**
   * Get transactions data stream via pubnub..
   */
  getCandlestick$(pair: string): Observable<BitbankApiCandlestick> {
    const channelName = 'candlestick' + '_' + pair;
    return this.handlePubNubChannelAndGetItsObservable<BitbankApiCandlestick>(channelName);
  }

  /**
   * Get observable of target channel.
   *
   * If pubnub have not subscribed to it yet, start to.
   */
  private handlePubNubChannelAndGetItsObservable<T>(channel: string): Observable<T> {
    if (this.subjectMap.has(channel)) {
      return this.subjectMap.get(channel)!.asObservable();
    }

    const subject = new ReplaySubject<T>(1);
    this.subjectMap.set(channel, subject);
    this.pubnub.subscribe({ channels: [channel] });
    return subject.asObservable();
  }

  /**
   * Called in constructor.
   */
  private initializePubNub(): void {
    this.pubnub.addListener({
      message: (data: PubNubMessageData) => {
        const subject = this.subjectMap.get(data.channel);
        // this subject has been set certainly in this.handlePubNubChannelAndGetItsObservable().
        subject!.next(data.message.data);
      },
    });
  }
}
