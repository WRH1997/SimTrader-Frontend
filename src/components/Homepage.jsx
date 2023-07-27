import React from "react";
import { useNavigate } from "react-router-dom";
import Logout from './Logout';

export default function Homepage(){

    const nav = useNavigate();

    const [portfolios, setPortfolios] = React.useState();


    React.useEffect(() => {
        const getPortfolios = async () => {
            let username = localStorage.user;
            let data = await fetch(process.env.REACT_APP_API_GATEWAY+'/portfolios/userportfolios', {
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
            <Logout/>
            <input type='button' onClick={Create} value="Create Portfolio"></input>

            <div>
            {Object.keys(portfolios || {})?.map((key, i) => (
                <li id={key} onClick={ViewPort}>{key}</li>
            ))}
            </div>
        </div>
    )
}
