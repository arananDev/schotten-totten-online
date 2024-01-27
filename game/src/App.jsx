import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainGame } from './pages/MainGame';
import CreateGameForm from './pages/CreateGameForm';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreateGameForm />} />
        <Route path="/game/:roomID" element={<MainGame />} />
      </Routes>
    </Router>
  );
}

export default App;


  