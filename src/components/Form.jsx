// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from 'react'
import Button from './Button'
import styles from './Form.module.css'
import { useNavigate } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'
// import { useUrlPosition } from '../hooks/useUrlPosition'

export function convertToEmoji(countryCode) {
	const codePoints = countryCode
		.toUpperCase()
		.split('')
		.map(char => 127397 + char.charCodeAt())
	return String.fromCodePoint(...codePoints)
}
const BASE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client'

function Form() {
	const [searchParams] = useSearchParams()
	const lat = searchParams.get('lat')
	const lng = searchParams.get('lng')
	const [cityName, setCityName] = useState('')
	const [country, setCountry] = useState('')
	const [date, setDate] = useState(new Date())
	const [notes, setNotes] = useState('')
	const [isLoadingGeoCoding, setIsLoadingGeoCoding] = useState(false)
	const [emoji, setEmoji] = useState()
	const navigate = useNavigate()
	useEffect(
		function () {
			async function fetchCityData() {
				try {
					setIsLoadingGeoCoding(true)
					const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`)
					const data = await res.json()
					setCityName(data.city || data.locality || '')
					setCountry(data.countryName)
					setEmoji(convertToEmoji(data.countryCode))
					console.log(data)
				} catch (err) {
				} finally {
					setIsLoadingGeoCoding(false)
				}
			}
			fetchCityData()
		},
		[lat, lng]
	)

	return (
		<form className={styles.form}>
			<div className={styles.row}>
				<label htmlFor="cityName">City name</label>
				<input id="cityName" onChange={e => setCityName(e.target.value)} value={cityName} />

				<span className={styles.flag}>{emoji}</span>
			</div>

			<div className={styles.row}>
				<label htmlFor="date">When did you go to {cityName}?</label>
				<input id="date" onChange={e => setDate(e.target.value)} value={date} />
			</div>

			<div className={styles.row}>
				<label htmlFor="notes">Notes about your trip to {cityName}</label>
				<textarea id="notes" onChange={e => setNotes(e.target.value)} value={notes} />
			</div>

			<div className={styles.buttons}>
				<Button type="primary">add</Button>
				<Button
					type="back"
					onClick={e => {
						e.preventDefault()
						navigate(-1)
					}}>
					&larr; Back
				</Button>
			</div>
		</form>
	)
}

export default Form
