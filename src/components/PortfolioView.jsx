import React from "react";
import { useNavigate } from "react-router-dom";
import BuyStockForm from "./BuyStockForm"
import Popup from 'reactjs-popup';
import Logout from './Logout';
//import 'reactjs-popup/dist/index.css';



export default function PortfolioView(){

    const nav = useNavigate();

    const [portfolio, setPortfolio] = React.useState();
    const [balance, setBalance] = React.useState();
 
    React.useEffect(() => {
        const getPortfolio = async () => {
            let username = localStorage.user;
            if(localStorage.viewPort==null || localStorage.viewPort ==undefined){
                nav('/homepage');
            }
            let targetPort = localStorage.viewPort;
            let data = await fetch(env.process.REACT_APP_API_GATEWAY+'/portfolios/userportfolios', {
                method: 'POST',
                body: JSON.stringify({"username": username, "viewPort":targetPort})
            });
            let res = await data.json();
            let portfolio = res['body'];
            let balance = portfolio['balance'];
            setBalance(balance);
            delete portfolio['balance'];
            setPortfolio(portfolio);
        }
        getPortfolio();
    }, [])

    React.useEffect(() => {}, portfolio);


    const BackToAll = () => {
        nav('/homepage');
    }


    const quoteTargetStock = async (stock) => {
        let data = await fetch(env.process.REACT_APP_API_GATEWAY+'/marketdata/stockquote', {
            method: 'POST',
            body: JSON.stringify({"ticker": stock})
        });
        let res = await data.json();
        let quote = res["body"]["price"];
        return quote;
    }

    const sellOne = async (event) => {
        event.preventDefault();
        let stock = event.target.id;
        let username = localStorage.user;
        let targetPortfolio = localStorage.viewPort;

        let quote = await quoteTargetStock(stock);
        console.log(quote);

        //implement selecting quant during sell
        let quantity = 1


        let data2 = await fetch(env.process.REACT_APP_API_GATEWAY+'/portfolios/sell', {
            method: 'POST',
            body: JSON.stringify({
                "username": username,
                "portfolioName": targetPortfolio,
                "ticker": stock,
                "quote": quote,
                "quantity": quantity
            })
        });
        let res2 = await data2.json();

        if(res2["statusCode"]!=200){
            alert("Error trying to sell stock [" + stock + "]!");
            return;
        }

        alert("Successfully sold [" + quantity + "] of [" + stock + "]!");
        window.location.reload(); 
    }


    return(
        <div>
        <Logout/>
        <b><u>{localStorage.viewPort}</u></b>
        <br></br><br></br>
        {Object.keys(portfolio || {})?.map((key, i) => (
            <div>
                Stock: {key}
                <br></br>
                Quantity: {portfolio[key]}
                <br></br>
                <input type='button' id={key} onClick={sellOne} value='Sell One'></input>
                <hr></hr>
            </div>
        ))}
        <br></br><br></br>
        <i>Balance: <b>${balance}</b></i>
        <br></br><br></br>
        <input type='button' value='Back to All Portfolios' onClick={BackToAll}></input>
        <Popup trigger={<button> Buy Stock</button>} position="right center">
            <BuyStockForm username={localStorage.user} portfolio={localStorage.viewPort}/>
        </Popup>
        </div>
    )
}

