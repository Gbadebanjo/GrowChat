import Register from './components/Register'
import axios from 'axios';

function App() {
  axios.defaults.baseURL = 'http://localhost:3003';
  axios.defaults.withCredentials = true;

  return (
   <Register />
  )
}

export default App