import './App.css';
import {
  SmartWeaveWebFactory,
  LoggerFactory,
  RedstoneGatewayContractDefinitionLoader,
  RedstoneGatewayInteractionsLoader,
  MemCache,
} from 'redstone-smartweave';
import Arweave from 'arweave';
import { useState, useEffect } from 'react';

const arweave = Arweave.init({
  host: 'dh48zl0solow5.cloudfront.net',
  port: 443,
  protocol: 'https',
  timeout: 20000,
  logging: false,
});

const smartweave = SmartWeaveWebFactory.memCachedBased(arweave)
  .setInteractionsLoader(
    new RedstoneGatewayInteractionsLoader('https://gateway.redstone.finance')
  )
  .setDefinitionLoader(
    new RedstoneGatewayContractDefinitionLoader(
      'https://gateway.redstone.finance',
      arweave,
      new MemCache()
    )
  )
  .build();

const ctrId = 'Daj-MNSnH55TDfxqC7v4eq0lKzVIwh98srUaWqyuZtY';
const ctr = smartweave.contract(ctrId);

LoggerFactory.INST.logLevel('error');

ctr.readState().then((r) => console.log(r));

function App() {
  const [contractState, setContractState] = useState({});

  useEffect(() => {
    async function fetchContractData() {
      const result = await ctr.readState();
      setContractState(result.validity);
    }

    fetchContractData().then(() => console.log(contractState));
  }, [contractState]);
  return (
    <div className="App">
      <header className="App-header">
        <p>Contract Id:</p>
        <p>{ctrId}</p>
        <p>State:</p>
        <div>
          {Object.keys(contractState).map((item, key) => (
            <ul
              style={{
                display: 'flex',
                listStyle: 'none',
                justifyContent: 'space-between',
              }}
            >
              <li>{item}</li>
              <li>{contractState[item].toString()}</li>
            </ul>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
