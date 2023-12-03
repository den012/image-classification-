import React from 'react'
import { BrowserRouter } from 'react-router-dom';
import Hero from './components/Hero';

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Hero/>
      </BrowserRouter>
    </div>
  )
}

export default App;