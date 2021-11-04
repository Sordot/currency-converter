import React, {useState, useEffect} from "react";
import Row from "./Row";

function App() {

  const [currencies, setCurrencies] = useState([])
  const [fromCurrency, setFromCurrency] = useState()
  const [toCurrency, setToCurrency] = useState()
  const [exchangeRate, setExchangeRate] = useState()
  const [amount, setAmount] = useState(1)
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
      setExchangeRate(data.rates[starterCurrency])
    }
    
    fetchData();

  },[])

  useEffect(() => {

    if (fromCurrency !== null && toCurrency !== null) {
      
      const fetchConvert = async () => {
        const apiResponse = await fetch(`https://api.exchangerate.host/latest?base=${fromCurrency}&symbols=${toCurrency}`)
        const data = await apiResponse.json()
        setExchangeRate(data.rates[toCurrency])
      }

      fetchConvert()

    }

  }, [fromCurrency, toCurrency])

  return <>
    <div className="App">
      <h1>Convert!</h1>
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
