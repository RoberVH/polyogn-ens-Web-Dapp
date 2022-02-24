import { useState } from 'react';
import { mintDomain, updateDomain } from '../utils/walletconn';
import LoadingIndicador from './LoadingIndicator';
import UserNotices  from './UserNotices';



// Form to enter domain name and data
	const InputForm = ({tld, domain, record, setDomain, setRecord, setMints, editing, setEditing}) =>{
		const [loading, setloading] = useState(false);
		const[mintedDomain, setMintedDomain]=useState('');
		const [link, setLink] = useState('');
		

	const onClickUpdateDomain = async (e) => {
		setloading(true)
		console.log('Updating domain...')
		await updateDomain(record, domain, setDomain, setRecord, setMints) 
		setEditing(false)
		setloading(false)
	}

    const handleSubmit = async (event) => {
        event.preventDefault();
		setloading(true)
		const resp = await mintDomain(domain, record, setMints)
        if (resp.opcode ) {
            setDomain('');
            setRecord('');  
			setMintedDomain(resp.msg)
			setLink(resp.link)
			console.log('minted!!!!!!!', resp.msg)
        } else {
			alert(resp.msg);
        }
		setloading(false)
    }        
		return (

			<div>
			{ loading && <LoadingIndicador /> } 
			<div className="form-container">
				<div className="first-row">
					<input
						type="text"
						value={domain}
						placeholder='your domain'
						onChange={e => setDomain(e.target.value)}
					/>
					<p className='tld'> {tld} </p>
				</div>

				<input
					type="text"
					value={record}
					placeholder="what's the link?"
					onChange={e => setRecord(e.target.value)}
				/>
				<div className="button-container">
				{editing ? (
						<div className="button-container">
						<button className='cta-button mint-button' disabled={loading} onClick={onClickUpdateDomain}>
							Set record
						</button>  
						<button className='cta-button mint-button' onClick={() => {setEditing(false)}}>
							Cancel
						</button>  
					</div>					
					  ) : (
						<button className='cta-button mint-button' disabled={null} onClick={handleSubmit}>
						Mint
					</button>
					)
				}		
				{
				mintedDomain &&
				<UserNotices
					type={'Success'} 
					msg= { mintedDomain }
					link = {link}
					setMintedDomain={setMintedDomain} 
				/>							}

				</div>

			</div>
			</div>
		);
	}

    export default InputForm;