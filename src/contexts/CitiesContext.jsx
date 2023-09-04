import { createContext, useContext } from 'react'
import { useState, useEffect } from 'react'
const API = 'http://localhost:8000'
const CitiesContext = createContext()
const CitiesProvider = function ({ children }) {
	const [cities, setCities] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [currentCities, setCurrentCities] = useState({})
	useEffect(function () {
		async function fetchData() {
			try {
				setIsLoading(true)
				const res = await fetch(`${API}/cities`)
				const data = await res.json()
				setCities(data)
			} catch {
				alert('something is wrong')
			} finally {
				setIsLoading(false)
			}
		}
		fetchData()
	}, [])
	const getCities = async function (id) {
		try {
			setIsLoading(true)
			const res = await fetch(`${API}/cities/${id}`)
			const data = await res.json()
			setCurrentCities(data)
		} catch {
			alert('something is wrong')
		} finally {
			setIsLoading(false)
		}
	}
	const citiesContextData = { cities, isLoading, getCities, currentCities }
	return <CitiesContext.Provider value={citiesContextData}>{children}</CitiesContext.Provider>
}
export const useCitiesContext = function () {
	const context = useContext(CitiesContext)
	if (context === undefined)
		throw new error('useCitiesContext was used out side the citiesProvider')
	return context
}
export { CitiesProvider }
