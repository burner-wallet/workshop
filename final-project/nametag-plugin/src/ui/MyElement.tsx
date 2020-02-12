import React, { useEffect, useState } from 'react';
import { PluginElementContext } from '@burner-wallet/types';
import NametagPlugin from '../NametagPlugin';

const MyElement: React.FC<PluginElementContext> = ({ plugin, defaultAccount, BurnerComponents, actions }) => {
  const [name, setName] = useState<string | null>(null);

  const refreshName = async () => {
    const name = await (plugin as NametagPlugin).getName(defaultAccount);
    setName(name);
  };

  useEffect(() => {
    refreshName();
  }, [defaultAccount]);

  const { Button } = BurnerComponents;
  return (
    <div style={{ display: 'flex' }}>
      <Button onClick={() => actions.navigateTo('/nametag')}>Edit Nametag</Button>
      <div>{name}</div>
    </div>
  );
};

export default MyElement;
