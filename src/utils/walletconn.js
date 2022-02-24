/**
 * All Web3 connecction methods
 */

import { ethers } from 'ethers';
import contractABI from './contractABI.json';


export const { ethereum } = window

export const networks = {
    "0x1": "Mainnet",
    "0x3": "Ropsten",
    "0x2a": "Kovan",
    "0x4": "Rinkeby",
    "0x5": "Goerli",
    "0x61": "BSC Testnet",
    "0x38": "BSC Mainnet",
    "0x89": "Polygon Mainnet",
    "0x13881": "Polygon Mumbai Testnet",
    "0xa86a": "AVAX Mainnet",
  }

export const CONTRACT_ADDRESS = '0xc4FdBec58FA3760c7613BAb3fc8656f440354ebd';
export const tld = '.plus';
  
// List of error coming from Metamask Wallet
export const errorMsjs = {
   '-32002': 'There is a Metamask window already opened. Make click on Metamask',
     '4001':  'User rejected request'
}


 /*******************************************************************
 *  getEthAddress - 
 *        Check if we already  have  permissions to Metamask account
 *       returns: 
 *            object with properties:
 *            opcode: true, value: accounts[0]: Metamask's Account connected if there is one 
 *            opcode: false  errorCode: error code from Metamask if not
 * 
 *****************************************************************/
export const  getEthAddress = async () => {
    try {
        if (ethereum) {
          const accounts = await ethereum.request({method: 'eth_requestAccounts'})
          return {opcode: true, value: accounts}
          }
        else {
          return {opcode: false, errorCode:'No Metamask detected'}
          }
      } catch (error) {
         console.log('There is not account connected', error)
         console.log('Code:', error.code)
         console.log('Msg:', error.message)
         const mmError = parseInt(error.code)
         console.log('result!:', mmError)
         let errorMsj=''
         errorMsj = errorMsjs[String(mmError)]
         console.log('errorMsj',errorMsj)
         return {opcode: false, errorCode: error.code, message : errorMsj}
      }    
}


 /*******************************************************************
 *  checkMMAccounts - 
 *        Check if we already  have  permissions to Metamask account
 *       returns: 
 *            object with properties:
 *            opcode: true, value: accounts[0]: Metamask's Account connected if there is one 
 *            opcode: false  errorMsg: error code from Metamask if not
 * 
 *****************************************************************/
  export const checkMMAccounts = async () => {
    try {
      if (ethereum) {
        const accounts = await ethereum.request({method: 'eth_accounts'})
        if (accounts.length===0) 
          {
              return {opcode: false, errorMsg: 'Unlock Metamask Wallet'} //  metamask locked/not connected}
          } else 
            return {opcode: true, value: accounts}  // all right
        } else {
        return {opcode: false, errorMsg:'This Dapp requires Metamask, please install it.'}
        }
    } catch (error) {
       console.log('There is not account connected', error)
       return {opcode: false, errorMsg: error.code}
    }
    }

    /*************************************************************
     * mintDomain -
     *     Mint a new domain
     *    @params domain: domain name to mint
     *    @params record: link to domain
     *   Returns:
     *     object with properties:
     *        opcode: true, value: msg: msg containing the name domain minted, link: link of NFT at opensea tesnet mumbai
     *        opcode: false, msg: error message
     *********************************************************/
     export const mintDomain = async (domain, record, setMints) => {
      // Don't run if the domain is empty
      if (!domain) { return {opcode: false, msg: 'Domain cannot be empty'}; }
      // Alert the user if the domain is too short

      if (domain.length < 3) {
        //alert('Domain must be at least 3 characters long');
        return {opcode: false, msg: 'Domain must be at least 3 characters long'};
      }
      let name = ''
      let tokenId = ''
      // Calculate price based on length of domain (change this to match your contract)	
      // 3 chars = 0.5 MATIC, 4 chars = 0.3 MATIC, 5 or more = 0.1 MATIC
      const price = domain.length === 3 ? '0.5' : domain.length === 4 ? '0.3' : '0.1';
      console.log("Minting domain", domain, "with price", price);
      try {
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
    
          console.log("Going to pop wallet now to pay gas...")
          let tx = await contract.register(domain, {value: ethers.utils.parseEther(price)});
          // Wait for the transaction to be mined
          const receipt = await tx.wait();
          console.log("Transaction finished! Receipt:", receipt);
          // Check if the transaction was successfully completed
          if (receipt.status === 1) {
            console.log("Domain minted! https://mumbai.polygonscan.com/tx/"+tx.hash);
            let events = receipt.events
            for (const event of events) {
              if (event.event && event.event === "DomainMinted") {
                name = event.args[0]
                tokenId = convertBigNumber(event.args[2])
              }
            }
          let msg = `You just minted ${name} domain!`
          let link= `https://testnets.opensea.io/assets/mumbai/${CONTRACT_ADDRESS}/${tokenId}`
          // Set the record for the domain
          tx = await contract.setRecord(domain, record);
          await tx.wait();
          // Call fetchMints after 2 seconds
          setTimeout(() => {
            fetchMints(setMints);
          }, 2000);    
          console.log("Record set! https://mumbai.polygonscan.com/tx/"+tx.hash);
          return {opcode: true, msg: msg, link: link}
          }
          else {
            return {opcode: false, msg: 'Transaction failed'}
          }
        }
      }
      catch(error){
        console.log(error);
        return {opcode: false, errorMsg: 'Transaction failed'}
      }
    }

    /*************************************************************
     * switchNetwork -
     *     Prompt  Metamask to change network to Mumbai Testnet
     *
     **********************************************************/
    export const switchNetwork = async () => {
      if (ethereum) {
        try {
          // Try to switch to the Mumbai testnet
          await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x13881' }], // Check networks.js for hexadecimal network ids
          });
        } catch (error) {
          // This error code means that the chain we want has not been added to MetaMask
          // In this case we ask the user to add it to their MetaMask
          if (error.code === 4902) {
            try {
              await ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {	
                    chainId: '0x13881',
                    chainName: 'Polygon Mumbai Testnet',
                    rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
                    nativeCurrency: {
                        name: "Mumbai Matic",
                        symbol: "MATIC",
                        decimals: 18
                    },
                    blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
                  },
                ],
              });
            } catch (error) {
              console.log(error);
            }
          }
          console.log(error);
        }
      } else {
        // If window.ethereum is not found then MetaMask is not installed
        alert('MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html');
      } 
    }

    /*************************************************************
     * updateDomain -
     *     Invoke setRecord on contract to update domain record
     *     @params domain: domain name to mint
     *     @params record: New link to domain 
     *     @params setLoading: callbak function to show UI loading status
     *
     **********************************************************/
    export const updateDomain = async (record, domain, setDomain, setRecord, setMints) => {
      if (!record || !domain) { return }
      //setLoading(true);
      console.log("Updating domain", domain, "with record", record);
        try {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
    
          let tx = await contract.setRecord(domain, record);
          await tx.wait();
          console.log("Record set https://mumbai.polygonscan.com/tx/"+tx.hash);
    
          fetchMints(setMints);
          setRecord('');
          setDomain('');
        }
        } catch(error) {
          console.log(error);
        }
      //setLoading(false);
    }

     /*************************************************************
     * fetchMints -
     *     Brings from Polygon the set of domain records and update them using callback function 
     *     @params setMints: Callback function to update mints
     *
     **********************************************************/
    export const fetchMints = async (setMints) => {
      try {
        const { ethereum } = window;
        if (ethereum) {
          // You know all this
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
            
          // Get all the domain names from our contract
          const names = await contract.getAllNames();
            
          // For each name, get the record and the address
          const mintRecords = await Promise.all(names.map(async (name) => {
          const mintRecord = await contract.records(name);
          const owner = await contract.domains(name);
          return {
            id: names.indexOf(name),
            name: name,
            record: mintRecord,
            owner: owner,
          };
        }));
    
        console.log("MINTS FETCHED ", mintRecords);
        setMints(mintRecords);
        }
      } catch(error){
        console.log(error);
      }
    }

    export const convertBigNumber= (bignumber) => {
      return ethers.BigNumber.from(bignumber).toString()
    }