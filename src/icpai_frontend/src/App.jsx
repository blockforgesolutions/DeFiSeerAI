import { useState } from 'react';
import { icpai_backend } from 'declarations/icpai_backend';
import Home from './pages/home';
import { AuthProvider, useAuth } from "./auth/AuthProvider";
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";

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
    <AuthProvider> 
      <LoginButton />
    <main>
      <img src="/logo2.svg" alt="DFINITY logo" />
      <LogoutButton />
      <Home />
    
    </main>
    </AuthProvider>
  );
}

export default App;
