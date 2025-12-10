import React, { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { dataService } from '../services/data.service';
import { CriticalNumber } from '../types';
import { formatCurrency } from '../utils/formatting';

export function CriticalNumbers() {
  const [numbers, setNumbers] = useState<CriticalNumber[]>([]);

  useEffect(() => {
    setNumbers(dataService.getAllCriticalNumbers());
  }, []);

  return (
    <div>
      <Header
        title="Critical Numbers"
        subtitle="The vital 20% of metrics that drive 80% of results (Richard Koch's 80/20 Principle)"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {numbers.map((cn) => (
            <Card key={cn.id}>
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{cn.name}</h3>
                  <Badge variant="info" size="sm">Vital 20%</Badge>
                </div>
                <p className="text-sm text-gray-600">{cn.description}</p>
              </div>

              <div className="mb-4">
                <p className="text-4xl font-bold text-indigo-600">
                  {cn.unit === 'UGX' ? formatCurrency(cn.currentValue) : `${cn.currentValue} ${cn.unit}`}
                </p>
              </div>

              {cn.history.length > 1 && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">Recent Trend</p>
                  <div className="flex items-end gap-1 h-16">
                    {cn.history.slice(-6).map((entry, i) => {
                      const maxValue = Math.max(...cn.history.map(h => h.value));
                      const height = (entry.value / maxValue) * 100;
                      return (
                        <div key={i} className="flex-1 flex flex-col justify-end">
                          <div
                            className="bg-indigo-500 rounded-t"
                            style={{ height: `${height}%` }}
                            title={`${entry.value} ${cn.unit}`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {numbers.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-500">No critical numbers configured.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
