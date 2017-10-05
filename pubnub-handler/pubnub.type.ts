export interface PubNub {
  PubNub(options: PubNubConstructOption): void;
  addListener(options: PubNubAddListenerOption): void;
  hereNow(options: {[key: string]: any}, cb: Function): void;
  history(options: {[key: string]: any}, cb: Function): void;
  publish(options: {[key: string]: any}, cb: Function): void;
  removeListener(): void;
  subscribe(options: {channels: string[], withPresence?: boolean}): void;
  time(cb: Function): void;
  unsubscribe(options: {channels: string[]}): void;
}


export interface PubNubConstructOption {
  subscribeKey: string;
  publishKey: string;
  secretKey: string;
  ssl: boolean;
}

export interface PubNubAddListenerOption {
  message?: (data: PubNubMessageData) => void;
  presence?: (data: PubNubPresenceData) => void;
  status?: (data: PubNubStatusData) => void;
}

export interface PubNubMessageData {
  actualChannel: any;
  channel: any; // The channel for which the message belongs
  message: any; // The Payload
  publisher: any;
  subscribedChannel: any;
  subscription: any; // The channel group or wildcard subscription match (if exists)
  timetoken: any; // Publish timetoken
}

export interface PubNubPresenceData {
  action: any;
  channel: any;
  subscription: any;
  timestamp: any;
  status: any;
  message: any;
  service: any;
  uuids: any;
  occupancy: any;
}

export interface PubNubStatusData {
  category: any;
  operation: any;
  affectedChannels: any;
  subscribedChannels: any;
  affectedChannelGroups: any;
  lastTimetoken: any;
  currentTimetoken: any;
}
