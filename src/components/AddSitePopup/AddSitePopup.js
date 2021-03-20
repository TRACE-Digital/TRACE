import React from 'react';

class Popup extends React.Component {  
  render() {  
        return (  
            <div className='popup'>   
                <h1>{this.props.text}</h1>  
                <button onClick={this.props.closePopup}>close me</button>   
            </div>  
        );  
    }  
}  

export default Popup;