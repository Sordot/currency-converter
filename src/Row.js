const Row = ({currencies}) => {

    return <>
        <div>
            <input type='number' className='input'/>
            {/* map over each currency symbol and assign it an option in our select menu */}
            <select>
                {currencies.map(option => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
        </div>
    </>

}

export default Row