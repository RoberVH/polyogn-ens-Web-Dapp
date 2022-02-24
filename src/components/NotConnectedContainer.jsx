	import { ethereum } from '../utils/walletconn';

	// Create a function to render if wallet is not connected yet
export const NotConnectedContainer = ({handleConnect, ethAddress}) => (
	<div>
	{ethereum && !ethAddress && ( 
		<div className="connect-wallet-container">
				<img src="https://media.giphy.com/media/ToMjGprvNrmZXDMZJQY/giphy.gif" alt="Ninja gif" />
				<button onClick={handleConnect} className="cta-button connect-wallet-button">
					Connect Wallet
				</button>
		</div>
		) 
	}
	</div>
	
  	);