import { HashRouter, Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar';
import StoriesList from './pages/StoriesList';
import CreateStory from './pages/CreateStory';

function App() {

  return (
    <HashRouter>
      <Navbar />
      <Routes>
        <Route
          path="/create-story"
          element={<CreateStory />} />
        <Route
          path="/"
          element={<StoriesList />} />
      </Routes>
    </HashRouter>
  )
}

export default App
