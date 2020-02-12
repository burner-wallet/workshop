# Burner Wallet Workshop

## 1. Create basic wallet

Go to https://github.com/burner-wallet/sample-wallet and clone the repo (https://github.com/burner-wallet/sample-wallet/generate)

Install dependencies

```
yarn install
```

To use Infura, you need to create a .env file with your key:

```
REACT_APP_INFURA_KEY=dc534ef20a08423b851d5c50978f6d52
```

Start a dev server:

```
yarn start
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

```jsx
const core = new BurnerCore({
  assets: [mkr, xdai, dai, eth],
});
```

## 4. Add a Uniswap exchange

```jsx
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

## 6. Add a static page

Declare the page "and a button" in the plugin entry point.

```jsx
  initializePlugin(pluginContext: BurnerPluginContext) {
    this.pluginContext = pluginContext;

    pluginContext.addPage('/my-page', MyPage);
    pluginContext.addButton('apps', 'My Plugin', '/my-page', {
      description: 'Sample plugin page',
    });

```

## 7. Display token balances

```jsx
const MyPage = ({ BurnerComponents }) => {
  const { Page, AccountBalance } = BurnerComponents;
  return (
    <Page>
      <AccountBalance asset="xdai" render={(data: AccountBalanceData | null) => (
        <div>
          {data
            ? `Your xDai balance: ${data.displayBalance}`
            : 'Loading...'}
        </div>
      )} />
    </Page>
  );
};
```

## 8. Add a custom QR code handler

Add a handler function to the 

```jsx
  initializePlugin(pluginContext: BurnerPluginContext) {
    const QR_REGEX = /^send:([0-9](?:\.[0-9]+)?)$/;
    pluginContext.onQRScanned((scan: string, ctx: PluginActionContext) => {
      if (QR_REGEX.test(scan)) {
        const amount = QR_REGEX.exec(scan)[1];
        ctx.actions.send({
          asset: 'geth',
          to: '0x3431c5139Bb6F5ba16E4d55EF2420ba8E0E127F6',
          ether: amount,
        });
        return true;
      }
    });
```

Note: QRs linking to pages in the wallet are automatically routed (unless overriden).

## 9. Read data from a contract

[Download and import the Nametag ABI](./Nametag.json).

Construct a Contract object with it and make data available from a function call.

```jsx
const CONTRACT_ADDRESS = '0x16171Bd459eCd6d638639adC9bAAEA4bF5DAb5c6';

export default class MyPlugin {
  private pluginContext: BurnerPluginContext;

  initializePlugin(pluginContext: BurnerPluginContext) {
    this.pluginContext = pluginContext;
  }

  async getName(address: string) {
    const web3 = this.pluginContext!.getWeb3('5');
    const contract = new web3.eth.Contract(NametagABI as any, CONTRACT_ADDRESS);
    const name = await contract.methods.getName(address).call();
    return name;
  }
}
```

Call the function in your page/element:

```jsx
const MyPage: React.FC<PluginPageContext> = ({ BurnerComponents, plugin, defaultAccount, actions }) => {
  const [name, setName] = useState<string | null>(null);

  const refreshName = async () => {
    const name = await (plugin as NametagPlugin).getName(defaultAccount);
    setName(name);
  };

  useEffect(() => {
    refreshName();
  }, [defaultAccount]);

  const { Page, Button } = BurnerComponents;
  return (
    <Page title="Name Tag">
      <div>Account: {defaultAccount}</div>
      <div>Name: {name ? `"${name}"` : 'Not set'}</div>
    </Page>
  );
};
```

## 10. Write contract data

Add a method to your plugin contract:

```jsx
const CONTRACT_ADDRESS = '0x16171Bd459eCd6d638639adC9bAAEA4bF5DAb5c6';

export default class MyPlugin implements Plugin {
  async setName(name: string, sender: string) {
    const web3 = this.pluginContext!.getWeb3('5');
    const contract = new web3.eth.Contract(NametagABI as any, CONTRACT_ADDRESS);
    await contract.methods.setName(name).send({ from: sender });
  }
}
```

And integrate it into your component:

```jsx
const MyPage: React.FC<PluginPageContext> = ({ BurnerComponents, plugin, defaultAccount, actions }) => {
  const [name, setName] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(false);

  //...

  const updateName = async () => {
    setLoading(true);
    actions.setLoading('Setting name...');

    await (plugin as NametagPlugin).setName(newName, defaultAccount);
    await refreshName();

    setLoading(false);
    actions.setLoading(null);
    setNewName('');
  };

  const { Page, Button } = BurnerComponents;
  return (
    <Page title="Name Tag">
      <div>Account: {defaultAccount}</div>
      <div>Name: {name ? `"${name}"` : 'Not set'}</div>
      <div>
        Set Name: {}
        <input value={newName} onChange={(e: any) => setNewName(e.target.value)} disabled={loading} />
        <Button onClick={updateName} disabled={loading}>Set</Button>
      </div>
    </Page>
  );
};
```


## 11. Create gasless transations with Gas Station Network

Adding GSN Support is easy!

Add the GSN Gateway to your project:

```jsx
import { InfuraGateway, InjectedGateway, XDaiGateway, GSNGateway } from '@burner-wallet/core/gateways';

const core = new BurnerCore({
  signers: [new InjectedSigner(), new LocalSigner()],
  gateways: [
    new GSNGateway(),
    new InjectedGateway(),
    new InfuraGateway(process.env.REACT_APP_INFURA_KEY),
    new XDaiGateway(),
  ],
```

and add `useGSN` to send calls:

```jsx
  async setName(name: string, sender: string) {
    const web3 = this.pluginContext!.getWeb3('5');
    const contract = new web3.eth.Contract(NametagABI as any, CONTRACT_ADDRESS);
    await contract.methods.setName(name).send({ from: sender, useGSN: true });
  }
```
