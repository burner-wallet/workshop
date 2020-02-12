import React, { useState, useEffect } from 'react';
import { PluginPageContext } from '@burner-wallet/types';
import { Asset } from '@burner-wallet/assets';
import NametagPlugin from '../NametagPlugin';

const wait = (time: number) => new Promise(resolve => setTimeout(resolve, time));

const MyPage: React.FC<PluginPageContext> = ({ BurnerComponents, plugin, defaultAccount, actions }) => {
  const [name, setName] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(false);

  const refreshName = async () => {
    const name = await (plugin as NametagPlugin).getName(defaultAccount);
    setName(name);
  };

  useEffect(() => {
    refreshName();
  }, [defaultAccount]);

  const updateName = async () => {
    setLoading(true);
    actions.setLoading('Setting name...');

    await (plugin as NametagPlugin).setName(newName, defaultAccount);
    await wait(500);
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

export default MyPage;
