import NFTBox from "../components/NFTBox"
import { useMoralisQuery, useMoralis } from "react-moralis"

export default function BoughtNfts() {
    const { isWeb3Enabled } = useMoralis()
    const { data: listedNfts, isFetching: fetchingListedNfts } = useMoralisQuery(
        "ItemBought",
        (query) => query.limit(10).ascending("tokenId")
    )

    return (
        <div className="container mx-auto ">
            <h1 className="py-4 px-4 font-bold text-2xl text-left">NFTs You Bought</h1>
            <div className="container flex items-center content-center">
                {isWeb3Enabled ? (
                    fetchingListedNfts ? (
                        <div>Loading...</div>
                    ) : listedNfts?.length ? (
                        listedNfts.map((nft) => {
                            const { price, nftAddress, tokenId, marketplaceAddress, seller } =
                                nft.attributes
                            return (
                                <>
                                    <NFTBox
                                        price={price}
                                        nftAddress={nftAddress}
                                        tokenId={tokenId}
                                        marketplaceAddress={marketplaceAddress}
                                        seller={seller}
                                        key={`${nftAddress}${tokenId}`}
                                    />
                                </>
                            )
                        })
                    ) : (
                        <div className="pl-4">No Nfts</div>
                    )
                ) : (
                    <div>Web3 Currently Not Enabled</div>
                )}
            </div>
        </div>
    )
}
