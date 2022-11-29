import logo from './logo.svg';
import './App.css';
import * as LitJsSdk from '@lit-protocol/lit-node-client';
import { useState } from 'react';

function App() {

  const [data, setData] = useState(null);

  const go = async () => {
    const litNodeClient = new LitJsSdk.LitNodeClient({
      litNetwork: 'serrano',
    });
    await litNodeClient.connect();

    const authSig = JSON.parse(await LitJsSdk.checkAndSignAuthMessage({
      chain: 'ethereum'
    }));

    const accs = [
      {
        contractAddress: '',
        standardContractType: '',
        chain: 'ethereum',
        method: 'eth_getBalance',
        parameters: [':userAddress', 'latest'],
        returnValueTest: {
          comparator: '>=',
          value: '0',
        },
      },
    ];

    const res = await LitJsSdk.encryptString('This test is working! Omg!');
    const encryptedString = res.encryptedString;
    const symmetricKey = res.symmetricKey;

    const base64EncryptedString = await LitJsSdk.blobToBase64String(
      encryptedString
    );

    setData(`base64EncryptedString: ${base64EncryptedString}`);

    const encryptedSymmetricKey =
      await litNodeClient.saveEncryptionKey({
        accessControlConditions: accs,
        symmetricKey: symmetricKey,
        authSig: authSig,
        chain: 'ethereum',
      });

    console.log("encryptedSymmetricKey:", encryptedSymmetricKey)
    setData(`encryptedSymmetricKey: ${encryptedSymmetricKey}`);
    const toDecrypt = await LitJsSdk.uint8arrayToString(
      encryptedSymmetricKey,
      'base16'
    );
    setData(`toDecrypt: ${toDecrypt}`);

    const encryptionKey = await litNodeClient.getEncryptionKey({
      accessControlConditions: accs,
      toDecrypt: toDecrypt,
      authSig: authSig,
      chain: 'ethereum',
    });
    setData(`encryptionKey: ${encryptionKey}`);

    const blob = await LitJsSdk.base64StringToBlob(base64EncryptedString);

    const decryptedString = await LitJsSdk.decryptString(
      blob,
      encryptionKey
    );
    setData(`decryptedString: ${decryptedString}`);

    console.log("decryptedString:", decryptedString);


  }

  return (
    <div className="App">
      <header className="App-header">
        <img src='https://developer.litprotocol.com/img/logo.svg' className="App-logo" alt="logo" />
        <p>
          Give it a try!<br />
          <a href="https://github.com/LIT-Protocol/demo-lit-js-sdk-v2-react-encrypt-decrypt/blob/main/src/App.js">https://github.com/LIT-Protocol/demo-lit-js-sdk-v2-react-encrypt-decrypt/blob/main/src/App.js</a>
          <code>
            <pre>
              {
                data ? JSON.stringify(data) : null
              }
            </pre>
          </code>
        </p>
        <button
          onClick={go}
        >
          Go!
        </button>
      </header>
    </div>
  );
}

export default App;
