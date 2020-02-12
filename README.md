# Burner Wallet Workshop

## 1. Create basic wallet

Go to https://github.com/burner-wallet/sample-wallet and clone the repo (https://github.com/burner-wallet/sample-wallet/generate)

Install dependencies & start a dev server:

```
yarn install
yarn start-basic
yarn start-local
```

## 2. Add a plugin

Install a NPM package.

```
yarn add @burner-wallet/ens-plugin
```

Add the plugin to the `plugins` prop:

```jsx
import ENSPlugin from '@burner-wallet/ens-plugin';

const BurnerWallet = () =>
  <ModernUI
    title="Basic Wallet"
    core={core}
    plugins={[exchange]}
  />
```

## 3. Add a token

Create a new asset object.

Classes ERC20Asset, ERC777Asset and NativeAsset are available in the @burner-wallet/assets package.

```jsx
import { xdai, dai, eth, ERC20Asset } from '@burner-wallet/assets';

const mkr = new ERC20Asset({
  id: 'mkr',
  name: 'Maker',
  network: '1',
  address: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
  priceSymbol: 'MRK', // optional, used for displaying market price
  icon: 'https://makerdao-forum-backup.s3.dualstack.us-east-1.amazonaws.com/original/1X/68e5b859631b8f66624f5880acb8c189a32aee64.png',
});
```

Add the object to the assets list.

```
const core = new BurnerCore({
  assets: [mkr, xdai, dai, eth],
});
```

## 4. Add a Uniswap exchange

```
const exchange = new Exchange({
  pairs: [
    new XDaiBridge(),
    new Uniswap('dai'),
    new Uniswap('mkr'),
  ],
});

const BurnerWallet = () =>
  <ModernUI
    title="Basic Wallet"
    core={core}
    plugins={[exchange]}
  />
```

## 5. Create a basic plugin

We're going to start fresh: go to https://github.com/burner-wallet/sample-plugin and clone the repo.

## 6. Add a staic page

Declare the page "and a button" in the plugin entry point.

```
  initializePlugin(pluginContext: BurnerPluginContext) {
    this.pluginContext = pluginContext;

    pluginContext.addPage('/my-page', MyPage);
    pluginContext.addButton('apps', 'My Plugin', '/my-page', {
      description: 'Sample plugin page',
    });

```

## 7. Display token balances

## 8. Add a custom QR code handler

Add a handler function to the 

```
  initializePlugin(pluginContext: BurnerPluginContext) {
    const QR_REGEX = /^send:([0-9](?:\.[0-9]+)?)$/;
    pluginContext.onQRScanned((scan: string, ctx: PluginActionContext) => {
      if (QR_REGEX.test(scan)) {
        const amount = QR_REGEX.exec(scan)[1];
        ctx.actions.send({
          asset: 'keth',
          to: '0x3431c5139Bb6F5ba16E4d55EF2420ba8E0E127F6',
          ether: amount,
        });
        return true;
      }
    });
```

Note: QRs linking to pages in the wallet are automatically routed (unless overriden).

## 9. Read data from a contract

## 
