import { HashRouter, Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar';
import StoriesList from './pages/StoriesList';
import CreateStory from './pages/CreateStory';
import StoryDetail from './pages/StoryDetail';

function App() {

  return (
    <HashRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<StoriesList />} />
        <Route path="/create-story" element={<CreateStory />} />
        <Route path="/story/:storyId" element={<StoryDetail />} />
      </Routes>
    </HashRouter>
  )
}

export default App
