import axios from "axios";

export const handler = (event) => {
  const API_KEY = process.env.EXCHANGE_API_KEY;
  const { query } = event.queryStringParameters || {};

	if (!query) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Missing 'query' parameter (e.g., USD)" }),
    };
  }

	return axios.get(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${query}`)
		.then((response) => ({
			statusCode: response.status,
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*"
			},
			body: JSON.stringify(response.data)
		}))
		.catch((error) => {
			const statusCode = error.response?.status || 500
			const errorMsg = error.response?.data?.message || 'Failed to fetch data'

			return {
				statusCode: statusCode,
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*"
				},
				body: JSON.stringify({ error: errorMsg }),
			}
		})
}