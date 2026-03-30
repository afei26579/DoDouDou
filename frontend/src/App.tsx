import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Templates from './pages/Templates';
import Works from './pages/Works';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/works" element={<Works />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/convert/upload" element={<div className="p-8">图片上传 - 开发中</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
