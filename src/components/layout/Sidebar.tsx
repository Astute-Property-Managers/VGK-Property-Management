import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  name: string;
  path: string;
  icon?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navigation: NavSection[] = [
  {
    title: 'Overview',
    items: [{ name: 'Dashboard', path: '/' }],
  },
  {
    title: 'Strategic Planning',
    items: [
      { name: 'One Page Strategic Plan', path: '/opsp' },
      { name: 'Rocks (Quarterly Goals)', path: '/rocks' },
      { name: 'KPIs', path: '/kpis' },
      { name: 'Critical Numbers', path: '/critical-numbers' },
      { name: 'Huddles', path: '/huddles' },
    ],
  },
  {
    title: 'Property Management',
    items: [
      { name: 'Properties', path: '/properties' },
      { name: 'Tenants', path: '/tenants' },
      { name: 'Maintenance', path: '/maintenance' },
      { name: 'Vendors', path: '/vendors' },
    ],
  },
  {
    title: 'Financial',
    items: [
      { name: 'Chart of Accounts', path: '/accounts' },
      { name: 'General Ledger', path: '/ledger' },
      { name: 'Cashflow', path: '/cashflow' },
    ],
  },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-gray-900 min-h-screen">
      {/* Logo */}
      <div className="px-6 py-8">
        <h1 className="text-2xl font-bold text-white">VGK</h1>
        <p className="text-sm text-gray-400 mt-1">Property Command</p>
      </div>

      {/* Navigation */}
      <nav className="px-3 space-y-8">
        {navigation.map((section) => (
          <div key={section.title}>
            <h2 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {section.title}
            </h2>
            <div className="mt-2 space-y-1">
              {section.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}
