const Moralis = require("moralis/node")
require("dotenv").config()
const contractAddresses = require("./constants/networkMapping.json")

let chainId = process.env.chainId || "31337"
let moralisChainId = chainId == "31337" ? "1337" : chainId
console.log(moralisChainId)

/* Moralis init code */
const serverUrl = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL
const appId = process.env.NEXT_PUBLIC_APP_ID
const masterKey = process.env.masterKey

async function main() {
    await Moralis.start({ serverUrl, appId, masterKey })
    const contractAddress = contractAddresses[chainId]["NftMarketplace"][0]
    console.log(contractAddress)

    console.log(`Working with contract address: ${contractAddress}`)

    let itemListedOptions = {
        chainId: moralisChainId,
        address: contractAddress,
        topic: "ItemListed(address,address,uint256,uint256)",
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "seller",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "nftAddress",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "price",
                    type: "uint256",
                },
            ],
            name: "ItemListed",
            type: "event",
        },
        tableName: "ItemListed",
        sync_historical: true,
    }

    let itemBoughtOptions = {
        chainId: moralisChainId,
        address: contractAddress,
        topic: "ItemBought(address,address,uint256,uint256)",
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "buyer",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "nftAddress",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "price",
                    type: "uint256",
                },
            ],
            name: "ItemBought",
            type: "event",
        },
        tableName: "ItemBought",
        sync_historical: true,
    }

    let itemCanceledOptions = {
        chainId: moralisChainId,
        address: contractAddress,
        topic: "ItemCanceled(address,address,uint256)",
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "seller",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "nftAddress",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
            ],
            name: "ItemCanceled",
            type: "event",
        },
        tableName: "ItemCanceled",
        sync_historical: true,
    }

    const listedResponse = await Moralis.Cloud.run("watchContractEvent", itemListedOptions, {
        useMasterKey: true,
    })
    const boughtResponse = await Moralis.Cloud.run("watchContractEvent", itemBoughtOptions, {
        useMasterKey: true,
    })
    const canceledResponse = await Moralis.Cloud.run("watchContractEvent", itemCanceledOptions, {
        useMasterKey: true,
    })
    if (listedResponse.success && canceledResponse.success && boughtResponse.success) {
        console.log(
            "Updated! You should now be able to see these tables in your database. \n Note: You won't be able to see the events on the `sync` tab of the UI though."
        )
    } else {
        console.log(
            "Something went wrong uploading events... Try manually importing for a better error code. "
        )
    }
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
