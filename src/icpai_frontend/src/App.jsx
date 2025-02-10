import { useState } from 'react';
import { icpai_backend } from 'declarations/icpai_backend';
import Home from './pages/home';

function App() {
  const [greeting, setGreeting] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const name = event.target.elements.name.value;
    icpai_backend.greet(name).then((greeting) => {
      setGreeting(greeting);
    });
    return false;
  }

  return (
    <main>
      <img src="/logo2.svg" alt="DFINITY logo" />
      <Home />
    </main>
  );
}

export default App;
