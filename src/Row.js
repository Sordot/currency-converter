const Row = ({currencies, selectedCurrency, onChangeCurrency, amount, onChangeAmount}) => {

    return <>
        <div>
            <input type='number' className='input'value={amount} onChange={onChangeAmount}/>
            {/* map over each currency symbol and assign it an option in our select menu */}
            <select value={selectedCurrency} onChange={onChangeCurrency}>
                {currencies.map(option => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
        </div>
    </>

}

export default Row