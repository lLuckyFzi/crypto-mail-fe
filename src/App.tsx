import { Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth';
import Inbox from './pages/Inbox';
import Compose from './pages/Compose';
import DashboardLayout from './layout/DashboardLayout';

function App() {
  return (
    <div className="min-h-screen w-full font-sans text-slate-800">
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route element={<DashboardLayout />}>
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/compose" element={<Compose />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;