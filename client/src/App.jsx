import { useState } from 'react'
import './App.css'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import Home from './components/Home';
import CreateAvatar from './components/CreateAvatar';



function App() {
  const [count, setCount] = useState(0)
  const [avatarMode, setAvatarMode] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState('');
  return (
  <>
  <Router>
    <Routes>
    <Route excat path='/' element={<CreateAvatar/>}/>
      <Route exact path='/home' element={<Home/>}/>
    </Routes>
  </Router>
  </>
  )
}

export default App
