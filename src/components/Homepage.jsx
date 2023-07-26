import React from "react";
import { useNavigate } from "react-router-dom";

export default function Homepage(){

    const nav = useNavigate();

    const [portfolios, setPortfolios] = React.useState();


    React.useEffect(() => {
        const getPortfolios = async () => {
            let username = localStorage.user;
            let data = await fetch('https://yhnrl7h7f8.execute-api.us-east-1.amazonaws.com/Test/portfolios/userportfolios', {
                method: 'POST',
                body: JSON.stringify({"username": username})
            });
            let res = await data.json();
            let portfolios = res['body'];
            setPortfolios(portfolios);
        }
        getPortfolios();
    }, [])

    React.useEffect(() => {}, portfolios);


    const Create = () => {
        nav('/createPort');
    }

    const ViewPort = (event) => {
        event.preventDefault();
        let portName = event.target.id;
        localStorage.setItem('viewPort', portName);
        nav('/portfolioView');
    }

    return(
        <div>
            <input type='button' onClick={Create} value="Create Portfolio"></input>

            <div>
            {Object.keys(portfolios || {})?.map((key, i) => (
                <li id={key} onClick={ViewPort}>{key}</li>
            ))}
            </div>
        </div>
    )
}
