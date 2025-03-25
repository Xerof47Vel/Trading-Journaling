import image from "./assets/Screenshot 2025-03-06 151914.png";
import propTypes from "prop-types";
function Card(props){
    //props take in values from the parent component in this case Body.jsx
    const imageAfter=image;
    if(props.profitLoss>=0){
        return(
       
            <>
      
            <div className="card" onClick={()=>{console.log("Card Clicked")}}>
                <img src={imageAfter} alt="after Trade image" className="tradeImage"/>
                <h2 className="cardTittle">{props.title}</h2>
                
                <p className="profit">{"$"+props.profitLoss}</p>
                <p className="dateTime">{props.date}</p>
                
    
           
            </div>
            </>
    
        );
    }
    else{ return(
       
        <>
  
        <div className="card" onClick={()=>{console.log("Card Clicked")}}>
            <img src={imageAfter} alt="after Trade image" className="tradeImage"/>
            <h2 className="cardTittle">{props.title}</h2>
            
            <p className="loss">{"$"+props.profitLoss}</p>
            <p className="dateTime">{props.date}</p>
            

       
        </div>
        </>

    );

    }

   

}
Card.propTypes={
    title:propTypes.string.isRequired,
    date:propTypes.string.isRequired,
    profitLoss:propTypes.number.isRequired
}

export default Card;