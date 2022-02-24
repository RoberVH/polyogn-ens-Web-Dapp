import React, { useEffect, useState} from 'react';
import './styles/App.css';
import { NotConnectedContainer } from './components/NotConnectedContainer';
import  InputForm  from './components/InputForm';
import  Warning from './components/Warning';
import  RenderMints from './components/RenderMints';
import { 
	ethereum, 
  networks,
  tld,
	checkMMAccounts,
	getEthAddress,
  switchNetwork,
  fetchMints
} from './utils/walletconn'; 
import { shortAccount } from './utils/shortaccount';
import twitterLogo from './assets/twitter-logo.svg';
import pen from './assets/pen.svg';
import polygonLogo from './assets/polygonlogo.png';
import ethLogo from './assets/ethlogo.png';

// Constants
const TWITTER_HANDLE = 'RoberVH';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;



const App = () => {


  // State Vars ********************************************************************
  const [ethAddress, setEthAddress] = useState(undefined);
  const [networkMumbai, setNetworkMumbai] = useState(true);
  const [domain, setDomain] = useState('');
  const [record, setRecord] = useState('');
  const [editing, setEditing] = useState(false);
  const [mints, setMints] = useState([]);

// on Load methods *******************************************************************

  // If we do have Metamask, check if already an account is connected (from previous executions)
  useEffect(() => {
    async function getEthAccount() {
    //   setIsLoading(true);
      const { opcode, errorMsg, value } = await checkMMAccounts();
      if (opcode) {
        if (value && value[0].length > 0) {
          setEthAddress(value[0]);
		  console.log(value[0])
          setNetworkMumbai(ethereum.chainId === "0x13881");
          // console.log('ethereum',ethereum)
          ethereum.on('chainChanged', handleChainChanged);
        } else alert(errorMsg);
      }
    }
    getEthAccount();
    //setIsLoading(false)
  }, []);

  // Each time we connect to Mumbai or change address  we'll go for list of domains
  useEffect(() => {
    if (networkMumbai) {
      fetchMints(setMints);
    }
  }, [ethAddress, networkMumbai, setMints]);

// handling methods *******************************************************************
    const handleConnect = async () => {
        const result = await getEthAddress()
        if (result.opcode)  {
            setEthAddress(result.value[0])
            console.log('Connected')
        } else {
            alert(result.message)
        }
    };

    		// Reload the page when they change networks
		function handleChainChanged(_chainId) {
			window.location.reload();
		}

  return (
		<div className="App">
			<div className="container">

			   {!ethereum && <Warning>No metamask, please install it!</Warning>}
         {ethereum && !networkMumbai && <Warning>You are in {networks[ethereum.chainId]} not in Polygon Mumbai Testnet </Warning>}
				<div className="header-container">
					<header>
					<div className="left">
					<p className="title"><img alt="pen logo" src={pen} /> &nbsp; Plus Name Service</p>
					<p className="subtitle">Domain Service to register websites on permissionless blockchain!</p>
					</div> 
					{ethAddress && 
          <div className="network-logo">
            <img alt="Network logo" className="logo" src={ networkMumbai ? polygonLogo : ethLogo} />
            <p className='eth-cta'>Wallet: {shortAccount(ethAddress)}</p>
          </div>
          }
					</header>
				</div>
				<NotConnectedContainer 
          handleConnect={handleConnect} 
          ethAddress={ethAddress}
        />
        {ethAddress && !networkMumbai && 
            <div className="connect-wallet-container">
              <h2>Please switch to Polygon Mumbai Testnet</h2>
              {/* This button will call our switch network function */}
              <button className='cta-button mint-button' onClick={switchNetwork}>Click here to switch</button>
            </div>
        }
        {ethAddress && networkMumbai &&
        <InputForm 
          tld={tld}
          domain={domain}
          record={record}
          setDomain={setDomain} 
          setRecord={setRecord} 
          setMints={setMints}
          editing= {editing}
          setEditing={setEditing}
        />}
        <RenderMints 
          ethAddress={ethAddress}
          mints={mints}
          setEditing={setEditing}
          setDomain= {setDomain}
          setRecord= {setRecord}
         />
        <div className="footer-container">
					<img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
					<a
						className="footer-text"
						href={TWITTER_LINK}
						target="_blank"
						rel="noreferrer"
					>{`@${TWITTER_HANDLE}`}</a>
				</div>
			</div>
		</div>
	);
}

export default App;
