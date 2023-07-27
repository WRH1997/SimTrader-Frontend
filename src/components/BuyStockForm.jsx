import React from "react";
import { useNavigate } from "react-router-dom";


export default function BuyStockForm(props){

    const [options, setOptions] = React.useState([]);
    const [quote, setQuote] = React.useState([]);


    const searchTicker = async () => {
        let searchTerm = document.getElementById("ticker").value;
        if(searchTerm==""){
            alert("Error: Search Term is blank!");
            return;
        }

        let data = await fetch(env.process.REACT_APP_API_GATEWAY+'/marketdata/tickersearch', {
            method: 'POST',
            body: JSON.stringify({"searchTerm": searchTerm})
        });
        let res = await data.json();
        let tickers = res["body"]["bestMatches"];

        let optionList = [];
        for(let x=0; x<tickers.length; x++){
            let symbol = tickers[x]["1. symbol"];
            optionList.push(symbol);
        }
        setOptions(optionList);
    }


    const buyStock = async (label, quote) => {
        let quantity = document.getElementById('quantity').value;
        quote = Math.round(quote * 100) / 100;
        let data = await fetch(env.process.REACT_APP_API_GATEWAY+'/portfolios/buy', {
            method: 'POST',
            body: JSON.stringify({
                "username": props.username,
                "portfolioName": props.portfolio,
                "ticker": label,
                "quote": quote,
                "quantity": quantity
            })
        });
        let res = await data.json();
        console.log(res["statusCode"]);
        if(res["statusCode"]!=200){
            alert(res["error"]+"\n"+res["errorMessage"]);
            return;
        }
        alert("You have successfully purchased [" + quantity + "] of [" + label + "]!");
        window.location.reload(); 
    }


    const getStockQuote = async (event) => {
        event.preventDefault();
        let data = await fetch(env.process.REACT_APP_API_GATEWAY+'/marketdata/stockquote', {
            method: 'POST',
            body: JSON.stringify({"ticker": event.target.id})
        });
        let res = await data.json();
        let quote = res["body"]["price"];
        let label = event.target.id;
        //setQuote([label, quote]);
        let quoteDiv = <div>
            Stock: <span id='stockLabel'>{label}</span>
            <br></br>
            Price: <span id='stockQuote'>${quote}</span>
            <br></br>
            Quantity: <input type='number' id='quantity' defaultValue={1}></input>
            <br></br>
            <input type='button' value='Buy' onClick={()=>buyStock(label, quote)}></input>
            <br></br>
        </div>
        setQuote(quoteDiv);
    }


    React.useEffect(()=>{}, options)

    React.useEffect(()=>{}, [quote]);


    return(
        <div>
            Ticker: <input type='text' className='ticker' id='ticker'></input>  
            <br></br>    
            <div id='options'>
                {options?.map((option) => (
                    <div onClick={getStockQuote} id={option}>
                        {option}
                    </div>
                ))}
            </div>
            <br></br>
            <div id='quote'>
                    {quote}
            </div>
            <input type='button' value='Search Ticker' onClick={searchTicker}></input>
        </div>
        
    )
}