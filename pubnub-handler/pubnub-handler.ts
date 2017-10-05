import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { BitbankApiTicker } from '../api-handler/api-response.type';
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
   * Get Ticker data stream.
   */
  getTicker$(pair: string): Observable<BitbankApiTicker> {
    const channelName = 'ticker' + '_' + pair;
    if (this.subjectMap.has(channelName)) {
      return this.subjectMap.get(channelName)!.asObservable();
    }

    const subject = new ReplaySubject<BitbankApiTicker>(1);
    this.subjectMap.set(channelName, subject);
    this.pubnub.subscribe({ channels: [channelName] });
    return subject.asObservable();
  }

  /**
   * Called in constructor.
   */
  private initializePubNub(): void {
    this.pubnub.addListener({
      message: (data: PubNubMessageData) => {
        const subject = <ReplaySubject<any>>this.subjectMap.get(data.channel);
        subject.next(data.message.data);
      },
    });
  }
}
