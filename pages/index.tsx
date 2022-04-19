import type { NextPage } from "next"
// import { useState } from "react"
import NFTBox from "../components/NFTBox"
import GET_ACTIVE_ITEMS from "../constants/subgraphQueries"
import { useQuery } from "@apollo/client"
import networkConfig from "../constants/networkMapping.json"
import { useMoralis } from "react-moralis"

// const PAGE_SIZE = 9

interface nftInterface {
    price: number
    nftAddress: string
    tokenId: string
    address: string
    seller: string
}

interface contractAddressesInterface {
    [key: string]: contractAddressesItemInterface
}

interface contractAddressesItemInterface {
    [key: string]: string[]
}

const Home: NextPage = () => {
    // TODO: Implement paging in UI
    // const [page, setPage] = useState(1)
    const { chainId } = useMoralis()
    const addresses: contractAddressesInterface = networkConfig
    const marketplaceAddress = chainId
        ? addresses[parseInt(chainId!).toString()]["NftMarketplace"][0]
        : null

    const { loading, error: subgraphQueryError, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS)

    return (
        <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
            <div className="flex flex-wrap">
                {loading || !listedNfts ? (
                    <div>Loading...</div>
                ) : (
                    listedNfts.activeItems.map((nft: nftInterface /*, index*/) => {
                        const { price, nftAddress, tokenId, seller } = nft
                        // console.log("Patrick")
                        console.log("PATRICK")
                        console.log(marketplaceAddress)
                        // console.log(address)
                        // console.log(nft)

                        return (
                            <NFTBox
                                price={price}
                                nftAddress={nftAddress}
                                tokenId={tokenId}
                                nftMarketplaceAddress={marketplaceAddress!}
                                seller={seller}
                                key={`${nftAddress}${tokenId}`}
                            />
                        )
                    })
                )}
            </div>
        </div>
    )
}
export default Home
