import React, {useState, useEffect} from "react";
import Row from "./Row";

function App() {

  const [currencies, setCurrencies] = useState([])
  const [fromCurrency, setFromCurrency] = useState()
  const [toCurrency, setToCurrency] = useState()

  //fetch latest currency rates
  useEffect(() => {

    const fetchData = async () => {
      //call the exchangerate api with base currency of USD
      const apiResponse = await fetch(`https://api.exchangerate.host/latest?base=USD`)
      const data = await apiResponse.json()
      console.log(data)
      
      const starterCurrency = Object.keys(data.rates)[0]
      //set our list of currencies for the dropdown as the abbreviations, starting with USD
      setCurrencies([Object.keys(data.rates.USD), ...Object.keys(data.rates), ])
      //set our starting currency to USD
      setFromCurrency(data.base)
      //set our default converted currency to the first item in our currencies array
      setToCurrency(starterCurrency)
    }
    
    fetchData();

  },[])


  return <>
    <div className="App">
      <h1>Convert!</h1>
      <Row currencies={currencies}/>
      <div className='equals'>=</div>
      <Row currencies={currencies}/>
    </div>
  </>
}

export default App;
