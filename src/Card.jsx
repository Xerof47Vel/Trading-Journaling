import image from "./assets/Screenshot 2025-03-06 151914.png";
function Card(props){
    //props take in values from the parent component in this case Body.jsx
    const imageAfter=image;


    return(
        <>
        
        <div className="card" onClick={()=>{console.log("Card Clicked")}}>
            <img src={imageAfter} alt="after Trade image" className="tradeImage"/>
            <h2 className="cardTittle">{props.title}</h2>
            <p className="profitLoss">{"$"+props.profitLoss}</p>
            <p className="dateTime">{props.date}</p>
            

       
        </div>
        </>

    );

}

export default Card;