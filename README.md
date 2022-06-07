
- [Full-Stack Setup](#full-stack-setup)
  - [1. Git clone the contracts repo](#1-git-clone-the-contracts-repo)
  - [2. Start your node](#2-start-your-node)
  - [3. Connect your codebase to your moralis server](#3-connect-your-codebase-to-your-moralis-server)
  - [4. Globally install the `moralis-admin-cli`](#4-globally-install-the-moralis-admin-cli)
  - [5. Setup your Moralis reverse proxy](#5-setup-your-moralis-reverse-proxy)
    - [IMPORTANT](#important)
  - [6. Setup your Cloud functions](#6-setup-your-cloud-functions)
  - [7. Add your event listeners](#7-add-your-event-listeners)
    - [You can do this programatically by running:](#you-can-do-this-programatically-by-running)
    - [Or, if you want to do it manually](#or-if-you-want-to-do-it-manually)
  - [8. Mint and List your NFT](#8-mint-and-list-your-nft)
  - [9. Start your front end](#9-start-your-front-end)
- [Minimal Quickstart](#minimal-quickstart)

# Full-Stack Setup

## 1. Git clone the contracts repo

In it's own terminal / command line, run: 

```
git clone https://github.com/PatrickAlphaC/hardhat-nft-marketplace-fcc
cd hardhat-nextjs-nft-marketplace-fcc
yarn
```

## 2. Start your node 

After installing dependencies, start a node on it's own terminal with:

```
yarn hardhat node
```

## 3. Connect your codebase to your moralis server

Setup your event [moralis](https://moralis.io/). You'll need a new moralis server to get started. 

Sign up for a [free account here](https://moralis.io/).

Once setup, update / create your `.env` file. You can use `.env.example` as a boilerplate. 

```
NEXT_PUBLIC_APP_ID=XXXX
NEXT_PUBLIC_SERVER_URL=XXXX
moralisApiKey=XXX
moralisSubdomain=XXX
masterKey=XXX
chainId=31337
```

With the values from your account. 

Then, in your `./package.json` update the following lines:
```
"moralis:sync": "moralis-admin-cli connect-local-devchain --chain hardhat --moralisSubdomain XXX.usemoralis.com --frpcPath ./frp/frpc",
"moralis:cloud": "moralis-admin-cli watch-cloud-folder  --moralisSubdomain XXX.usemoralis.com --autoSave 1 --moralisCloudfolder ./cloudFunctions",
"moralis:logs": "moralis-admin-cli get-logs --moralisSubdomain XXX.usemoralis.com"
```

Replace the `XXX.usemoralis.com` with your subdomain, like `4444acatycat.usemoralis.com` and update the `moralis:sync` script's path to your instance of `frp` (downloaded as part of the Moralis "Devchain Proxy Server" instructions mentioned above)

## 4. Globally install the `moralis-admin-cli`

```
yarn global add moralis-admin-cli
```

## 5. Setup your Moralis reverse proxy 

> Optionally: On your server, click on "View Details" and then "Devchain Proxy Server" and follow the instructions. You'll want to use the `hardhat` connection. 

- Download the latest reverse proxy code from [FRP](https://github.com/fatedier/frp/releases) and add the binary to `./frp/frpc`. 
- Replace your content in `frpc.ini`, based on your devchain. You can find the information on the `DevChain Proxy Server` tab of your moralis server. 

In some Windows Versions, FRP could be blocked by firewall, just use a older release, for example frp_0.34.3_windows_386

Mac / Windows Troubleshooting: https://docs.moralis.io/faq#frpc

Once you've got all this, you can run: 

```
yarn moralis:sync
``` 

You'll know you've done it right when you can see a green `connected` button after hitting the refresh symbol next to `DISCONNECTED`. *You'll want to keep this connection running*.

<img src="./img/connected.png" width="200" alt="Connected to Moralis Reverse Proxy">

### IMPORTANT

Anytime you reset your hardhat node, you'll need to press the `RESET LOCAL CHAIN` button on your UI!

## 6. Setup your Cloud functions

In a separate terminal (you'll have a few up throughout these steps)

Run `yarn moralis:cloud` in one terminal, and run `yarm moralis:logs` in another. If you don't have `moralis-admin-cli` installed already, install it globally with `yarn global add moralis-admin-cli`.

> Note: You can stop these after running them once if your server is at max CPU capactity. 

If you hit the little down arrow in your server, then hit `Cloud Functions` you should see text in there. 

<img src="./img/down-arrow.png" width="500" alt="Cloud Functions Up">
<img src="./img/functions.png" width="250" alt="Cloud Functions Up">

Make sure you've run `yarn moralis:sync` from the previous step to connect your local Hardhat devchain with your Moralis instance. You'll need these 3 moralis commands running at the same time. 

## 7. Add your event listeners

### You can do this programatically by running:

```
node watchEvents.js
```

### Or, if you want to do it manually

Finally, go to `View Details` -> `Sync` and hit `Add New Sync` -> `Sync and Watch Contract Events`

Add all 3 events by adding it's information, like so: 

1. ItemListed:
   1. Description: ItemListed
   2. Sync_historical: True
   3. Topic: ItemListed(address,address,uint256,uint256)
   4. Abi: 
```
{
  "anonymous": false,
  "inputs": [
    {
      "indexed": true,
      "internalType": "address",
      "name": "seller",
      "type": "address"
    },
    {
      "indexed": true,
      "internalType": "address",
      "name": "nftAddress",
      "type": "address"
    },
    {
      "indexed": true,
      "internalType": "uint256",
      "name": "tokenId",
      "type": "uint256"
    },
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "price",
      "type": "uint256"
    }
  ],
  "name": "ItemListed",
  "type": "event"
}
```
    5. Address: <YOUR_NFT_MARKETPLACE_DEPLOYED_ADDRESS_FROM_HARDHAT>
    6. TableName: ItemListed

You can add the canceled and bought events later. 

## 8. Mint and List your NFT

Back in the main directory, run:

```
yarn hardhat run scripts/mint-and-list-item.js --network localhost
```

And you'll now have an NFT listed on your marketplace. 

## 9. Start your front end

At this point, you'll have a few terminals running:

- Your Hardhat Node
- Your Hardhat Node syncing with your moralis server
- Your Cloud Functions syncing
- Your Moralis Logging

And you're about to have one more for your front end. 

```
yarn run dev
```

And you'll have your front end, indexing service running, and blockchain running.

# Minimal Quickstart

1. Clone the backend repo

```
git clone https://github.com/PatrickAlphaC/hardhat-nft-marketplace-fcc
cd hardhat-nextjs-nft-marketplace-fcc
yarn
yarn hardhat node
```
Leave that terminal running^

2. Clone the frontend

```
git clone https://github.com/PatrickAlphaC/nextjs-nft-marketplace-moralis-fcc
cd nextjs-nft-marketplace-moralis-fcc
yarn
```

Setup your `.env` with moralis info and update your `package.json` with moralis subdomain.

3. Sync your hardhat node with moralis

Update your `frpc.ini` file with what you see in the moralis UI.

Leave this terminal running: 

```
yarn moralis:sync
```

4. Watch for events && Update cloud functions

Run once:
```
yarn moralis:cloud
```

```
node watchEvents.js
```

5. Emit an event

Back in your hardhat project, run:

```
yarn hardhat run scripts/mint-and-list-item.js --network localhost
```

And you should see it updated in the database
