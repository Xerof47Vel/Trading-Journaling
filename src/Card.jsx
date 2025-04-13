

function Card(props) {
    const imageSrc = "./assets/Screenshot 2025-03-06 151914.png"; // Default image
    const profitClass = props.profitLoss >= 0 ? "profit" : "loss"; // Conditional class
    console.log("Card props:", props); // Debugging line
    return (
        <div className="card" onClick={() => console.log("Card Clicked")}>
            <img src={imageSrc} alt="Trade Image" className="tradeImage" />
            <h2 className="cardTitle">{props.commodity}</h2>
            <p className={profitClass}>{"$" + props.profit_loss}</p>
            <p className="dateTime">{props.open_date}</p>
        </div>
    );
}


export default Card;
