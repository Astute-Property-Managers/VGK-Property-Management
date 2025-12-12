import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardLayout } from './components/DashboardLayout';

// Import views as they're created
import { DashboardOverview } from './views/DashboardOverview';
import { PropertiesView } from './views/PropertiesView';
import { TenantsView } from './views/TenantsView';
import { CashflowView } from './views/CashflowView';
import { FinancialOverview } from './views/FinancialOverview';
import { RocksView } from './views/RocksView';
import { KPIsView } from './views/KPIsView';
import { CriticalNumbersView } from './views/CriticalNumbersView';
import { HuddlesView } from './views/HuddlesView';
import { MaintenanceView } from './views/MaintenanceView';
import { VendorsView } from './views/VendorsView';

// Placeholder component for views not yet implemented
const ComingSoon: React.FC<{ title: string }> = ({ title }) => (
  <div className="max-w-4xl mx-auto">
    <div className="bg-white rounded-lg shadow-md p-8 text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
      <p className="text-gray-600 mb-6">
        This module is part of the VGK Property Command system.
      </p>
      <p className="text-sm text-gray-500">
        The full implementation includes all features discussed in the requirements.
      </p>
    </div>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<DashboardOverview />} />

        {/* Strategic Planning */}
        <Route path="opsp" element={<ComingSoon title="One Page Strategic Plan" />} />
        <Route path="rocks" element={<RocksView />} />
        <Route path="kpis" element={<KPIsView />} />
        <Route path="critical-numbers" element={<CriticalNumbersView />} />
        <Route path="huddles" element={<HuddlesView />} />

        {/* Property Operations */}
        <Route path="properties" element={<PropertiesView />} />
        <Route path="tenants" element={<TenantsView />} />
        <Route path="maintenance" element={<MaintenanceView />} />
        <Route path="vendors" element={<VendorsView />} />

        {/* Financials */}
        <Route path="cashflow" element={<CashflowView />} />
        <Route path="chart-of-accounts" element={<ComingSoon title="Chart of Accounts" />} />
        <Route path="ledger" element={<ComingSoon title="Transaction Ledger" />} />
        <Route path="financial-overview" element={<FinancialOverview />} />
      </Route>
    </Routes>
  );
}

export default App;
