const Warning = (props) => (
    <div style={{
        backgroundColor: 'red',
        minWidth: '100%',
        heigth: '20px',
        fontSize: '1.3em',
        fontWeight: 'bold',
        padding: '15px 0 15px 0',
        color:'yellow',
    }}>
        {props.children}
    </div>
)

export default Warning;