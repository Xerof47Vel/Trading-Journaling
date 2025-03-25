import Card from "./Card";
function Body(){
    return(
        <>
        <div className="card-container">
        <Card title="NQ100" date={new Date().toDateString()} profitLoss={100} />
        <Card  title="NQ100" date={new Date().toDateString()} profitLoss={100} />
        <Card title="NQ100" date={new Date().toDateString()} profitLoss={100} />
        <Card title="NQ100" date={new Date().toDateString()} profitLoss={100} />
        <Card title="NQ100" date={new Date().toDateString()} profitLoss={100} />
        <Card title="NQ100" date={new Date().toDateString()} profitLoss={100} />
        </div>
        </>
    );
}

export default Body;