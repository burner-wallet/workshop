import { BurnerPluginContext, Plugin, Actions } from '@burner-wallet/types';
import MyPage from './ui/MyPage';
import MyElement from './ui/MyElement';
import NametagABI from './NametagABI.json';

const CONTRACT_ADDRESS = '0x16171Bd459eCd6d638639adC9bAAEA4bF5DAb5c6';

export default class MyPlugin implements Plugin {
  private pluginContext?: BurnerPluginContext;

  initializePlugin(pluginContext: BurnerPluginContext) {
    this.pluginContext = pluginContext;

    pluginContext.addPage('/nametag', MyPage);
    pluginContext.addElement('home-middle', MyElement);
  }

  async getName(address: string) {
    const web3 = this.pluginContext!.getWeb3('5');
    const contract = new web3.eth.Contract(NametagABI as any, CONTRACT_ADDRESS);
    const name = await contract.methods.getName(address).call();
    return name;
  }

  async setName(name: string, sender: string) {
    const web3 = this.pluginContext!.getWeb3('5');
    const contract = new web3.eth.Contract(NametagABI as any, CONTRACT_ADDRESS);
    await contract.methods.setName(name).send({ from: sender, useGSN: true });
  }
}
