# bitbank.cc handler


## Public API

```
const bitbank = new Bitbank();
```

### Ticker

```javascript
bitbank.getTicker('btc_jpy')
  .subscribe((data) => {
    console.log(data);
  });
```


### Depth

```javascript
bitbank.getDepth('btc_jpy')
  .subscribe((data) => {
    console.log(data);
  });
```


### Transactions

```javascript
bitbank.getTransactions('btc_jpy')
  .subscribe((data) => {
    console.log(data);
  });

bitbank.getTransactions('btc_jpy', '20171009')
  .subscribe((data) => {
    console.log(data);
  });
```


### Candlestick

```javascript
bitbank.getCandlestick('btc_jpy', '1day', '2017')
  .subscribe((data) => {
    console.log(data);
  });
```


## RealTime API

```javascript
const bitbank = new Bitbank();
```

### Ticker

```javascript
bitbank.getTicker$('btc_jpy')
  .subscribe((data) => {
    console.log(data);
  });
```


### Depth

```javascript
bitbank.getDepth$('btc_jpy')
  .subscribe((data) => {
    console.log(data);
  });
```


### Transactions

```javascript
bitbank.getTransactions$('btc_jpy')
  .subscribe((data) => {
    console.log(data);
  });
```


### Candlestick

```javascript
bitbank.getCandlestick$('btc_jpy')
  .subscribe((data) => {
    console.log(data);
  });
```


## Private API

```javascript
const bitbank = new Bitbank({
  apiKey: 'your-api-key',
  apiSecret: 'your-api-secret',
});
```


### Assets

```javascript
bitbank.getAssets('btc_jpy')
  .subscribe((data) => {
    console.log(data);
  });
```


### Order
#### create

```javascript
const options = {
 pair: 'btc_jpy',
 amount: 100,
 price: 500000,
 side: 'buy',
 type: 'limit',
};

bitbank.createOrder(options)
  .subscribe((data) => {
    console.log(data);
  });
```


### cancel

```javascript
bitbank.cancelOrder('btc_jpy', yourOrderId)
  .subscribe((data) => {
    console.log(data);
  });

bitbank.cancelOrders('btc_jpy', [yourOrderId1, yourOrderId2])
  .subscribe((data) => {
    console.log(data);
  });
```

### get information

```javascript
bitbank.getOrder('btc_jpy', yourOrderId)
  .subscribe((data) => {
    console.log(data);
  });

bitbank.getOrders('btc_jpy', [yourOrderId1, yourOrderId2])
  .subscribe((data) => {
    console.log(data);
  });

const options = {
  count: 100,
  from_id: 10000000,
  end_id: 20000000,
  since: 1507550000000,
  end: 1507551000000,
};
bitbank.getActiveOrders('btc_jpy', options)
  .subscribe((data) => {
    console.log(data);
  });
```


### Withdrawal

#### get account

```javascript
bitbank.getWithdrawAccount('btc')
  .subscribe((data) => {
    console.log(data);
  });
```

#### request withdrawal

```javascript
const options = {
    asset: 'btc',
    uuid: 'my-uuid',
    amount: 100,
    otp_token: '123456',
    sms_token: '123456',
};
bitbank.createWithdrawalRequest(options)
  .subscribe((data) => {
    console.log(data);
  });
```


# Sample

see sample.md
