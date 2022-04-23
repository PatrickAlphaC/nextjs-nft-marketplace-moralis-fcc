import type { NextPage } from "next"
import { useMoralis, useMoralisQuery } from "react-moralis"
import { useEffect, useState } from "react"
import NFTBox from "../components/NFTBox"

const PAGE_SIZE = 9

const Home: NextPage = () => {
    // TODO: Implement paging in UI
    const [page, setPage] = useState(1)
    const { isWeb3Enabled } = useMoralis()

    const { data: listedNfts, isFetching: fetchingListedNfts } = useMoralisQuery(
        "ActiveItem",
        (query) =>
            query
                .limit(PAGE_SIZE)
                .descending("tokenId")
                .skip((page - 1) * PAGE_SIZE)
    )

    return (
        <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
            <div className="flex flex-wrap">
                {isWeb3Enabled ? (
                    fetchingListedNfts ? (
                        <div>Loading...</div>
                    ) : (
                        listedNfts.map((nft /*, index*/) => {
                            console.log(nft.attributes)
                            const { price, nftAddress, tokenId, marketplaceAddress, seller } =
                                nft.attributes

                            return (
                                <NFTBox
                                    price={price}
                                    nftAddress={nftAddress}
                                    tokenId={tokenId}
                                    marketplaceAddress={marketplaceAddress}
                                    seller={seller}
                                    key={`${nftAddress}${tokenId}`}
                                />
                            )
                        })
                    )
                ) : (
                    <div>Web3 Currently Not Enabled </div>
                )}
            </div>
        </div>
    )
}
export default Home
