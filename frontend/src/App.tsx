import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Create from './pages/Create';
import Editor from './pages/Editor';
import Follow from './pages/Follow';
import Community from './pages/Community';
import Templates from './pages/Templates';
import Works from './pages/Works';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/editor/:id" element={<Editor />} />
          <Route path="/follow/:id" element={<Follow />} />
          <Route path="/community" element={<Community />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/templates/:id" element={<div className="p-8">模板详情 - 开发中</div>} />
          <Route path="/works" element={<Works />} />
          <Route path="/works/:id" element={<div className="p-8">作品详情 - 开发中</div>} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/tutorial" element={<div className="p-8">新手教程 - 开发中</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
