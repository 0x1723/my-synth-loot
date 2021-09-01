import React, { useState } from "react";
import { Contract } from "@ethersproject/contracts";
import { getDefaultProvider } from "@ethersproject/providers";
import { useQuery } from "@apollo/react-hooks";

import { Body, Button, Header } from "./components";
import useWeb3Modal from "./hooks/useWeb3Modal";

import { addresses, abis } from "./contracts";
import GET_TRANSFERS from "./graphql/subgraph";

async function getSynthLoot(address) {
  const defaultProvider = getDefaultProvider();
  const lootContract = new Contract(addresses.syntheticLoot, abis.syntheticLootAbi, defaultProvider);
  const tokenURI = await lootContract.tokenURI(address);
  const lootMetadata = JSON.parse(atob(tokenURI.replace('data:application/json;base64,','')));
  const lootImage = lootMetadata["image"];
  return (lootImage)
}

function WalletButton({ provider, loadWeb3Modal, logoutOfWeb3Modal }) {
  return (
    <div>
      {provider ? <p>{provider.provider.selectedAddress}</p> : <div></div>}
      <Button
        onClick={() => {
          if (!provider) {
            loadWeb3Modal();
          } else {
            logoutOfWeb3Modal();
          }
        }}
      >
        {!provider ? "Connect Wallet" : "Disconnect Wallet"}
      </Button>
    </div>
  );
}

function App() {
  const { loading, error, data } = useQuery(GET_TRANSFERS);
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
  const [synthLootImg, setSynthLootImg] = useState("");

  React.useEffect(() => {
    if (loading) {
      setSynthLootImg("https://mir-s3-cdn-cf.behance.net/project_modules/fs/b6e0b072897469.5bf6e79950d23.gif")
    }
    if (!loading && !error && data && data.transfers) {}
  }, [loading, error, data]);

  if (provider) {
    getSynthLoot(provider.provider.selectedAddress).then((image) => {
      setSynthLootImg(image);
    });
  }

  return (
    <div>
      <Header>
        <WalletButton provider={provider} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Modal={logoutOfWeb3Modal}  />
      </Header>
      <Body>
        {provider ? <img alt="Synthetic Loot of your wallet" src={synthLootImg}></img> : <div></div>}
      </Body>
    </div>
  );
}

export default App;
