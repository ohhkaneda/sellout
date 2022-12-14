import * as React from 'react';
import type { AppProps } from 'next/app';
import NextHead from 'next/head';
import '../styles/globals.css';

// Imports
import { chain, createClient, WagmiConfig, configureChains } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider, Chain, darkTheme } from '@rainbow-me/rainbowkit';

import { useIsMounted } from '../hooks';
import { ModalProvider } from '@/context/SellOutProvider';
import { ToastContainer } from 'react-toastify';

// Get environment variables
const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID as string;
// const infuraId = process.env.NEXT_PUBLIC_INFURA_ID as string;

const hardhatChain: Chain = {
	id: 31337,
	name: 'Hardhat',
	nativeCurrency: {
		decimals: 18,
		name: 'Hardhat',
		symbol: 'HARD',
	},
	network: 'hardhat',
	rpcUrls: {
		default: 'http://127.0.0.1:8545',
	},
	testnet: true,
};

const { chains, provider } = configureChains(
	[chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum, hardhatChain, chain.polygonMumbai],
	[alchemyProvider({ alchemyId }), publicProvider()],
);

const { connectors } = getDefaultWallets({
	appName: 'create-web3',
	chains,
});

const wagmiClient = createClient({
	autoConnect: true,
	connectors,
	provider,
});

const App = ({ Component, pageProps }: AppProps) => {
	const isMounted = useIsMounted();

	if (!isMounted) return null;
	return (
		<WagmiConfig client={wagmiClient}>
			<RainbowKitProvider coolMode initialChain={chain.polygonMumbai} chains={chains}>
				<ModalProvider>
					<NextHead>
						<ToastContainer />
						<title>create-web3</title>
					</NextHead>
					<Component {...pageProps} />
				</ModalProvider>
			</RainbowKitProvider>
		</WagmiConfig>
	);
};

export default App;
