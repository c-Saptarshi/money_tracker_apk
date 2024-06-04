import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [name, setName] = useState('');
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');
  const [transactions, setTranscations] = useState([]);

  useEffect(() => {
    getTransactions()
      .then(setTranscations)
      .catch(error => console.error('Error fetching transactions:', error));
  }, []);

  async function getTransactions() {
    const apiUrl = process.env.REACT_APP_API_URL;
    if (!apiUrl) {
      console.error('REACT_APP_API_URL is not defined in the .env file');
      return;
    }
    const url = `${apiUrl}/transactions`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  }

  const addNewTransaction = (ev) => {
    ev.preventDefault();

    const apiUrl = process.env.REACT_APP_API_URL;
    if (!apiUrl) {
      console.error('REACT_APP_API_URL is not defined in the .env file');
      return;
    }

    const url = `${apiUrl}/transaction`;

    if (!name) {
      console.error('Name is not defined');
      return;
    }

    const price = name.split(' ')[0];
    if (!price) {
      console.error('Name does not contain a valid price');
      return;
    }

    const adjustedName = name.substring(price.length + 1);

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price, name: adjustedName, description, datetime })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(json => {
        console.log('result', json);
        // Handle success (e.g., clear form, update UI, etc.)
        setName('');
        setDatetime('');
        setDescription('');
      })
      .catch(error => {
        console.error('Error adding transaction:', error.message);
        // Handle error (e.g., show error message to user)
      });
  };
  function formatDateTime(datetime) {
    const date = new Date(datetime);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }

  let balance = 0;
  for(const transaction of transactions){
      balance = balance + transaction.price;
  }

  return (
    <main>
      <h1 className={`${balance >= 0 ? 'green' : 'red'}`}>{balance}<span>.00</span></h1>
      <form onSubmit={addNewTransaction}>
        <div className='basics'>
          <input
            type="text"
            value={name}
            onChange={ev => setName(ev.target.value)}
            placeholder={'+200 ice-cream'}
          />
          <input
            value={datetime}
            onChange={ev => setDatetime(ev.target.value)}
            type="datetime-local"
          />
        </div>
        <div className='description'>
          <input
            type="text"
            value={description}
            onChange={ev => setDescription(ev.target.value)}
            placeholder='description'
          />
        </div>
        <button type="submit">Add new Transaction</button>
      </form>
      <div className='transactions'>
        {transactions.length > 0 && transactions.map(transaction => (
          <div className='transaction' key={transaction.id}>
            <div className='left'>
              <div className='name'>{transaction.name}</div>
              <div className='description'>{transaction.description}</div>
            </div>
            <div className='right'>
              <div className={`price ${transaction.price > 0 ? 'green' : 'red'}`}>
                {transaction.price}
              </div>
              <div className='datetime'>{formatDateTime(transaction.datetime)}</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;
