import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/convert" element={<div className="p-8">转图页面 - 开发中</div>} />
        <Route path="/templates" element={<div className="p-8">模板库 - 开发中</div>} />
        <Route path="/works" element={<div className="p-8">我的作品 - 开发中</div>} />
        <Route path="/profile" element={<div className="p-8">我的 - 开发中</div>} />
      </Routes>
    </Router>
  );
}

export default App;
