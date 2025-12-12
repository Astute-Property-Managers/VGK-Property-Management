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
import { OPSPView } from './views/OPSPView';
import { ChartOfAccountsView } from './views/ChartOfAccountsView';
import { LedgerView } from './views/LedgerView';

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<DashboardOverview />} />

        {/* Strategic Planning */}
        <Route path="opsp" element={<OPSPView />} />
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
        <Route path="chart-of-accounts" element={<ChartOfAccountsView />} />
        <Route path="ledger" element={<LedgerView />} />
        <Route path="financial-overview" element={<FinancialOverview />} />
      </Route>
    </Routes>
  );
}

export default App;
