/**
 * @file utils/weather.ts
 * Utility for fetching weather data.
 */

export async function getCurrentTemperature(city: string): Promise<number | null> {
	if (!city) return null;
	try {
		// Use wttr.in to fetch weather in JSON format
		// format=j1 returns JSON structure
		const encodedCity = encodeURIComponent(city.trim());
		const url = `https://wttr.in/${encodedCity}?format=j1`;
		
		const response = await fetch(url, {
			headers: {
				"Accept-Language": "en",
			},
		});

		if (!response.ok) {
			console.error(`[Weather] Failed to fetch weather for ${city}: ${response.status}`);
			return null;
		}

		const data: any = await response.json();
		if (data?.current_condition?.[0]?.temp_C !== undefined) {
			return parseFloat(data.current_condition[0].temp_C);
		}

		return null;
	} catch (error) {
		console.error(`[Weather] Error fetching weather for ${city}:`, error);
		return null;
	}
}
