import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

const Notification = ({message}) => {

	return (
		<div className="error">
			{message !== null ? message : ''}
		</div>
	)
}

const ExchangeTable = ({ data }) => {

	return (
		<table>
			<thead>
				<tr>
					<th className='currency'>Currency</th>
					<th className='rate'>Rate</th>
				</tr>
			</thead>
			<tbody>
				{Object.entries(data).map(([currency, rate]) => {
					return (
						<tr key={currency} >
							<td className='currency'>{currency}</td>
							<td className='rate'>{rate}</td>
						</tr>
					)
				})}
			</tbody>
		</table>
	)
}

const App = () => {
	const [exchangeFrom, setExchangeFrom] = useState('')
	const [exchangeData, setExchangeData] = useState(null)
	const [errorMessage, setErrorMessage] = useState(null)
	
	const getExchangeData = (currency) => {
		axios
			.get(`/.netlify/functions/fetchData?query=${currency}`)
			.then((response) => {
				if (response.data.result === 'success') {
					setExchangeData(response.data.conversion_rates)
				} else {
					setErrorMessage(response.data['error-type'])
					setTimeout(() => {
						setErrorMessage(null)
					}, 4000)
				}
			})
			.catch((error) => {
				if (error.response) {
					console.log('Error response:', error.response)
					setErrorMessage(error.response.data.error || error.response.status)
				} else if (error.request) {
					console.log('No response:', error.request)
					setErrorMessage('Network error - no response from server')
				} else {
					console.log('Request error:', error.message)
					setErrorMessage(error.message)
				}
				
				setTimeout(() => {
					setErrorMessage(null);
				}, 4000)
			})
	}

	useEffect(() => {
		getExchangeData('MAD')
	}, [])

	const handleChange = (event) => {
		event.preventDefault()
		if (event.target.value.length < 4)
			setExchangeFrom(event.target.value.toUpperCase())
	}

	const onSearch = (event) => {
		event.preventDefault()
		getExchangeData(exchangeFrom)
	}

  return (
    <>
      <h1>Exchange Rate</h1>
			<Notification message={errorMessage} />
      <div className="card">
				<form onSubmit={onSearch}>
					<input className='currency-input' value={exchangeFrom} onChange={handleChange} placeholder='ex: USD' />
					<button type='submit'>search</button>
				</form>
      </div>
			{exchangeData !== null ? <ExchangeTable data={exchangeData} /> : ''}
    </>
  )
}

export default App
