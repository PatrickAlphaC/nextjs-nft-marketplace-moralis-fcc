import type { NextPage } from "next"
import { Form, Button, useNotification } from "web3uikit"
import { useWeb3Contract, useMoralis } from "react-moralis"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import nftAbi from "../constants/BasicNft.json"
import networkMapping from "../constants/networkMapping.json"
import { useEffect, useState } from "react"
import { BigNumber, ethers } from "ethers"

type NetworkConfigItem = {
    NftMarketplace: string[]
}

type NetworkConfigMap = {
    [chainId: string]: NetworkConfigItem
}

const SellNft: NextPage = () => {
    const { chainId, account, isWeb3Enabled } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const marketplaceAddress = (networkMapping as NetworkConfigMap)[chainString].NftMarketplace[0]
    const [proceeds, setProceeds] = useState("0")

    const dispatch = useNotification()

    // @ts-ignore
    const { runContractFunction } = useWeb3Contract()

    const withDrawOptions = {
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "withdrawProceeds",
        params: {},
    }

    const getProceedsOptions = {
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "getProceeds",
        params: {
            seller: account,
        },
    }

    async function setupUI() {
        const returnedProceeds = (await runContractFunction({
            params: getProceedsOptions,
            onError: (error) => console.log(error),
        })) as BigNumber
        if (returnedProceeds) {
            setProceeds(returnedProceeds.toString())
        }
    }

    useEffect(() => {
        setupUI()
    }, [proceeds, account, isWeb3Enabled, chainId])

    const handleWithdrawSuccess = () => {
        dispatch({
            type: "success",
            message: "Proceeds withdrawn successfully",
            title: "Proceeds Withdrawn",
            position: "topR",
        })
    }

    async function handleApproveSuccess(nftAddress: string, tokenId: string, price: string) {
        console.log("Ok... Now listing the item...")

        const options = {
            abi: nftMarketplaceAbi,
            contractAddress: marketplaceAddress,
            functionName: "listItem",
            params: {
                nftAddress: nftAddress,
                tokenId: tokenId,
                price: price,
            },
        }

        await runContractFunction({
            params: options,
            onSuccess: () => handleListSuccess(),
            onError: (error) => console.log(error),
        })
    }

    async function handleListSuccess() {
        dispatch({
            type: "success",
            message: "NFT Listed successfully",
            title: "NFT Listed",
            position: "topR",
        })
    }

    async function approveAndList(data: any) {
        console.log("Approving...")
        const nftAddress = data.data[0].inputResult
        const tokenId = data.data[1].inputResult
        const price = ethers.utils.parseUnits(data.data[2].inputResult, "ether").toString()

        const options = {
            abi: nftAbi,
            contractAddress: data.data[0].inputResult,
            functionName: "approve",
            params: {
                to: marketplaceAddress,
                tokenId: data.data[1].inputResult,
            },
        }

        await runContractFunction({
            params: options,
            onSuccess: () => handleApproveSuccess(nftAddress, tokenId, price),
            onError: (error) => {
                console.log(error)
            },
        })
    }

    return (
        <div>
            <Form
                onSubmit={approveAndList}
                buttonConfig={{
                    isLoading: false,
                    type: "submit",
                    theme: "primary",
                    text: "Sell NFT!",
                }}
                data={[
                    {
                        inputWidth: "50%",
                        name: "NFT Address",
                        type: "text",
                        value: "",
                        key: "nftAddress",
                    },
                    {
                        name: "NFT Token Id",
                        type: "number",
                        value: "",
                        key: "tokenId",
                    },
                    {
                        name: "Price (in ETH)",
                        type: "number",
                        value: "",
                        key: "price",
                    },
                ]}
                title="Sell your NFT!"
                id="Main Form"
            />
            <div className="py-4">
                <div className="flex flex-col gap-2 justify-items-start w-fit">
                    <h2 className="text-2xl">
                        Withdraw {ethers.utils.formatUnits(proceeds.toString(), "ether")} proceeds
                    </h2>
                    {proceeds != "0" ? (
                        <Button
                            id="withdraw-proceeds"
                            onClick={() =>
                                runContractFunction({
                                    params: withDrawOptions,
                                    onSuccess: () => handleWithdrawSuccess,
                                    onError: (error) => console.log(error),
                                })
                            }
                            text="Withdraw"
                            theme="primary"
                            type="button"
                        />
                    ) : (
                        <p>No withdrawable proceeds detected</p>
                    )}
                </div>
            </div>
        </div>
    )
}
export default SellNft
