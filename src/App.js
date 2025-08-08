import React from 'react';
import MultiStepForm from './components/MultiStepForm';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="figma-header">
  <div className="figma-logo">DNV Healthcare</div>
  <div className="figma-user-info">
    <div className="figma-user-circle">KM</div>
    <span className="figma-profile">Katherine Martinez</span>
  </div>
</header>

      <main>
        <MultiStepForm />
      </main>
    
    </div>
  );
}

export default App;

