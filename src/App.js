import { useState } from 'react';
import { Form } from './components/Form';
import { Room } from './components/Room';

function App() {
  const [data, setData] = useState('');
  return (
    <div className="App">
      <div className="Main">
        {data ? <Room data={data}/> : <Form setData={setData}/> }
      </div>
    </div>
  );
}

export default App;
