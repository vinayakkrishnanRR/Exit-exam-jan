import { Route, Routes } from 'react-router-dom';
import Mailer from './components/Mailer.jsx'
import Welcome from './components/Welcome.jsx'
import Main from '../src/pages/Main.jsx'

function App() {
  return (
    <Routes>
      <Route path={'/'} element={<Main child={<Mailer/>}/>}/>
      <Route path={'/welcome'} element={<Main child={<Welcome/>}/>}/>
    </Routes>
  );
}

export default App;
