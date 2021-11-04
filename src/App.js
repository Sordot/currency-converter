import React, {useState, useEffect} from "react";
import Row from "./Row";

function App() {

  //list of currencies for dropdown
  const [currencies, setCurrencies] = useState([])
  //state that hold the values of our top and bottom rows, top = from, bottom = to
  const [fromCurrency, setFromCurrency] = useState()
  const [toCurrency, setToCurrency] = useState()
  //set exchangeRate for when conversion is calculated
  const [exchangeRate, setExchangeRate] = useState()
  const [amount, setAmount] = useState(1)
  //true if our top row holds an input value, used to determine whether to convert from top or bottom
  const [amountInFrom, setAmountInFrom] = useState(true)

  //convert based off of exchangeRate
  let toAmount, fromAmount
  //if we have an amount in our top row, convert the toAmount
  if (amountInFrom) {
    fromAmount = amount
    toAmount = amount * exchangeRate
    //otherwise, convert the other way
  } else {
    toAmount = amount
    fromAmount = amount / exchangeRate
  }
  
  //control the inputs of the top and bottom rows
  const handleFromAmountChange = (e) => {
    setAmount(e.target.value)
    setAmountInFrom(true)
  }
  const handleToAmountChange = (e) => {
    setAmount(e.target.value)
    setAmountInFrom(false)
  }

  //fetch latest currency rates
  useEffect(() => {

    const fetchData = async () => {
      //call the exchangerate api with base currency of USD
      const apiResponse = await fetch(`https://api.exchangerate.host/latest?base=USD&symbols=fUSD,EUR,AUD,JPY,CNY,GBP,ZAR,INR,RUB`)
      const data = await apiResponse.json()
      console.log(data)
      
      const starterCurrency = Object.keys(data.rates)[0]
      //set our list of currencies for the dropdown as the abbreviations, starting with USD
      setCurrencies([data.base, ...Object.keys(data.rates)])
      //set our starting currency to USD
      setFromCurrency(data.base)
      //set our default converted currency to the first item in our currencies array
      setToCurrency(starterCurrency)
      //default our exchange rate to convert with the top row as a base
      setExchangeRate(data.rates[starterCurrency])
    }
    
    fetchData();

  },[])

  //fetch from the api again with the appropriate base and symbol for the desired final currency
  useEffect(() => {

    //if we have values in both fields
    if (fromCurrency !== null && toCurrency !== null) {
      
      //fetch from the api and set the exchange rate
      const fetchConvert = async () => {
        const apiResponse = await fetch(`https://api.exchangerate.host/latest?base=${fromCurrency}&symbols=${toCurrency}`)
        const data = await apiResponse.json()
        setExchangeRate(data.rates[toCurrency])
      }

      fetchConvert()

    }
    //fire the useEffect any time the value of either row changes
  }, [fromCurrency, toCurrency])

  return <>
    <div className="App">
      <h1>Convert Your Currencies Below!</h1>
      <p>Exchange Rates Updated Hourly</p>
      <Row 
        currencies={currencies}
        selectedCurrency={fromCurrency}
        onChangeCurrency={e => setFromCurrency(e.target.value)}
        amount={fromAmount}
        onChangeAmount={handleFromAmountChange}
      />
      <div className='equals'>=</div>
      <Row 
        currencies={currencies}
        selectedCurrency={toCurrency}
        onChangeCurrency={e => setToCurrency(e.target.value)}
        amount={toAmount}
        onChangeAmount={handleToAmountChange}
      />
    </div>
  </>
}

export default App;
