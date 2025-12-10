import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';

// Views
import { Dashboard } from './views/Dashboard';
import { OPSP } from './views/OPSP';
import { Rocks } from './views/Rocks';
import { KPIs } from './views/KPIs';
import { CriticalNumbers } from './views/CriticalNumbers';
import { Huddles } from './views/Huddles';
import { Properties } from './views/Properties';
import { Tenants } from './views/Tenants';
import { Maintenance } from './views/Maintenance';
import { Vendors } from './views/Vendors';
import { Accounts } from './views/Accounts';
import { Ledger } from './views/Ledger';
import { Cashflow } from './views/Cashflow';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Dashboard */}
          <Route path="/" element={<Dashboard />} />

          {/* Strategic Planning */}
          <Route path="/opsp" element={<OPSP />} />
          <Route path="/rocks" element={<Rocks />} />
          <Route path="/kpis" element={<KPIs />} />
          <Route path="/critical-numbers" element={<CriticalNumbers />} />
          <Route path="/huddles" element={<Huddles />} />

          {/* Property Management */}
          <Route path="/properties" element={<Properties />} />
          <Route path="/tenants" element={<Tenants />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/vendors" element={<Vendors />} />

          {/* Financial */}
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/ledger" element={<Ledger />} />
          <Route path="/cashflow" element={<Cashflow />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
