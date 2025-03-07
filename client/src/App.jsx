import { HashRouter, Route, Routes } from 'react-router-dom';

import StoriesList from './pages/StoriesList';

function App() {

  return (
    <HashRouter>
      <Routes>
        <Route
          path="/test"
          element={<h1>Test</h1>} />
        <Route
          path="/"
          element={<StoriesList />} />
      </Routes>
    </HashRouter>
  )
}

export default App
