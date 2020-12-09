function client(endpoint, customConfig = {
  method: 'GET'
}) {
  return window
    .fetch(`${process.env.REACT_APP_API_URL}/${endpoint}`, customConfig)
    .then(response => response.json())
    .catch(error => error)
}

export { client };
