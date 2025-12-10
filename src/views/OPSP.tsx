import React, { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { dataService } from '../services/data.service';
import { OnePageStrategicPlan } from '../types';

export function OPSP() {
  const [opsp, setOPSP] = useState<OnePageStrategicPlan | null>(null);

  useEffect(() => {
    setOPSP(dataService.getOPSP());
  }, []);

  if (!opsp) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header
        title="One Page Strategic Plan"
        subtitle="Your complete strategic framework on a single page (Verne Harnish - Scaling Up)"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Core Values</h3>
            <ul className="list-disc list-inside space-y-2">
              {opsp.coreValues.map((value, i) => (
                <li key={i} className="text-gray-700">{value}</li>
              ))}
            </ul>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Core Purpose</h3>
            <p className="text-gray-700">{opsp.corePurpose}</p>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">BHAG (Big Hairy Audacious Goal)</h3>
            <p className="text-gray-700 font-medium">{opsp.bhag}</p>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">3-Year Picture</h3>
            <p className="text-gray-700">{opsp.threeYearPicture}</p>
          </Card>

          <div className="grid grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Annual Theme</h3>
              <p className="text-xl text-indigo-600 font-semibold">{opsp.annualTheme}</p>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quarterly Theme</h3>
              <p className="text-xl text-indigo-600 font-semibold">{opsp.quarterlyTheme}</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
