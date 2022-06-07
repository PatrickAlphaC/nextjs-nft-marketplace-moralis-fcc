import "../styles/globals.css"
import Head from "next/head"
import type { AppProps } from "next/app"
import { MoralisProvider } from "react-moralis"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
import NetworkBanner from "../components/NetworkBanner"
import { NotificationProvider } from "web3uikit"
import Header from "../components/Header"

const APP_ID = process.env.NEXT_PUBLIC_APP_ID
const SERVER_URL = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>NFT Marketplace</title>
                <link rel="shortcut icon" href="/favicon.ico" />
            </Head>
            <MoralisProvider appId={APP_ID!} serverUrl={SERVER_URL!} initializeOnMount={true}>
                <NotificationProvider>
                    <NetworkBanner />
                    <Header />
                    <Component {...pageProps} />
                </NotificationProvider>
            </MoralisProvider>
        </>
    )
}
export default MyApp
