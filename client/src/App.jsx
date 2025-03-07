import { HashRouter, Route, Routes } from 'react-router-dom';

import StoriesList from './pages/StoriesList';
import CreateStory from './pages/CreateStory';

function App() {

  return (
    <HashRouter>
      <Routes>
        <Route
          path="/createstory"
          element={<CreateStory />} />
        <Route
          path="/"
          element={<StoriesList />} />
      </Routes>
    </HashRouter>
  )
}

export default App
