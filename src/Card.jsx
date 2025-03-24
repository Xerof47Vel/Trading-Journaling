import image from "./assets/Screenshot 2025-03-06 151914.png";
function Card(){

    const imageAfter=image;
    const title="NQ100";
    
    const date=new Date().toDateString();
    const profitLoss="$100";

    return(
        <>
        
        <div className="card" onClick={()=>{console.log("Card Clicked")}}>
            <img src={imageAfter} alt="after Trade image" className="tradeImage"/>
            <h2>{title}</h2>
            <p className="profitLoss">{profitLoss}</p>
            <p>{date}</p>

       
        </div>
        </>

    );

}

export default Card;