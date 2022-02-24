import { CONTRACT_ADDRESS, tld } from "../utils/walletconn";

// Add this render function next to your other render functions
const RenderMints = ({ethAddress, mints, setEditing, setDomain, setRecord}) => {

// This will take us into edit mode and show us the edit buttons!
const editRecord = (name, record) => {
	console.log("Editing record for", name);
	setDomain(name);
    setRecord(record);
	setEditing(true);
}    

if (ethAddress && mints.length > 0) {
    return (
        <div className="mint-container">
            <p className="subtitle"> Recently minted domains!</p>
            <div className="mint-list">
                { mints.map((mint, index) => {
                    return (
                        <div className="mint-item" key={index}>
                            <div className='mint-row'>
                                <a className="link" href={`https://testnets.opensea.io/assets/mumbai/${CONTRACT_ADDRESS}/${mint.id}`} target="_blank" rel="noopener noreferrer">
                                    <p className="underlined">{' '}{mint.name}{tld}{' '}</p>
                                </a>
                                {/* If mint.owner is currentAccount, add an "edit" button*/}
                                { mint.owner.toLowerCase() === ethAddress.toLowerCase() ?
                                    <button className="edit-button" onClick={() => editRecord(mint.name, mint.record)}>
                                        <img className="edit-icon" src="https://img.icons8.com/metro/26/000000/pencil.png" alt="Edit button" />
                                    </button>
                                    :
                                    null
                                }
                            </div>
                <p> {mint.record} </p>
            </div>)
            })}
        </div>
    </div>);
    } else {
        return null;
    }
};


export default RenderMints;