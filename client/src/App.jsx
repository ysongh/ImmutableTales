import { HashRouter, Route, Routes } from 'react-router-dom';

import { ETHProvider } from './ETHContext';
import Navbar from './components/Navbar';
import StoriesList from './pages/StoriesList';
import CreateStory from './pages/CreateStory';
import StoryDetail from './pages/StoryDetail';
import UserProfile from './pages/UserProfile';

function App() {

  return (
    <ETHProvider>
      <HashRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<StoriesList />} />
          <Route path="/create-story" element={<CreateStory />} />
          <Route path="/story/:storyId" element={<StoryDetail />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </HashRouter>
    </ETHProvider>
  )
}

export default App
