import logo from './logo.svg';
import './App.css';
import {useState} from 'react';
import ContactForm from './components/ContactForm';
import Contacts from './components/Contacts';

function App() {
  return (
    <div class="row">
      <div class="col-md-10 offset-md-1">
        <Contacts/>        
      </div>
    </div>
  );
}

export default App;
