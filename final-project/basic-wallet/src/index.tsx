import React from 'react';
import ReactDOM from 'react-dom';
import { xdai, dai, eth, NativeAsset } from '@burner-wallet/assets';
import BurnerCore from '@burner-wallet/core';
import { InjectedSigner, LocalSigner } from '@burner-wallet/core/signers';
import { InfuraGateway, InjectedGateway, XDaiGateway, GSNGateway } from '@burner-wallet/core/gateways';
import Exchange, { Uniswap, XDaiBridge } from '@burner-wallet/exchange';
import ModernUI from '@burner-wallet/modern-ui';
import NametagPlugin from 'nametag-plugin';

const geth = new NativeAsset({
  network: '5',
  id: 'geth',
  name: 'gETH',
})

const core = new BurnerCore({
  signers: [new InjectedSigner(), new LocalSigner()],
  gateways: [
    new GSNGateway(),
    new InjectedGateway(),
    new InfuraGateway(process.env.REACT_APP_INFURA_KEY),
    new XDaiGateway(),
  ],
  assets: [geth, xdai, dai, eth],
});

const exchange = new Exchange({
  pairs: [new XDaiBridge(), new Uniswap('dai')],
});

const BurnerWallet = () =>
  <ModernUI
    title="Nametag Wallet"
    core={core}
    plugins={[exchange, new NametagPlugin()]}
  />


ReactDOM.render(<BurnerWallet />, document.getElementById('root'));
