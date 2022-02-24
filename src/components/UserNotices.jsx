


const UserNotices = ({type, msg, setMintedDomain, link}) => 
    <div style={{
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            margin: '10px 15px',
            width: '520px',
            borderRadius: '5px',
            boxShadow: '0px 0px 10px 3px rgba(255, 255, 255, 0.2)'}}
          className="mintedDomain">
              <p style = {{marginLeft:'35px', fontSize:'3em', marginTop:'-30px'}}>👍</p>
        <div style = {{
            display: 'flex',
            flexDirection: 'column',
            // justifyContent: 'center',
            alignItems: 'center',
            fontSize: '1.2rem',
            color:'#065269'}}>
        <p style={{marginTop:'30px', marginBottom:'15px'}} >{msg}</p> 
        <a className="link" href={link} target="_blank" rel="noopener noreferrer">
            <p style={{color:'#065269', marginRight:'35px'}} className="underlined"> Check ownership proof NFT here</p>
        </a>
            <p style={{marginTop:'15px', marginRight:'35px'}} > (Notice it could take 30 minutes to appear!)</p>
        <button className="cta-button" 
                style={{margin:'25px 1px',
                backgroundColor:'blue'
                }} onClick={() => setMintedDomain(false)}> OK </button>
        </div>
    </div>
export default UserNotices;