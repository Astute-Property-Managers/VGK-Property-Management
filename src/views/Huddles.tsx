import React, { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { dataService } from '../services/data.service';
import { HuddleEntry } from '../types';
import { formatDate, formatStatus } from '../utils/formatting';

export function Huddles() {
  const [huddles, setHuddles] = useState<HuddleEntry[]>([]);

  useEffect(() => {
    setHuddles(dataService.getAllHuddles());
  }, []);

  return (
    <div>
      <Header
        title="Huddles"
        subtitle="Team meetings and communication rhythm (Daily, Weekly, Monthly, Quarterly)"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Meeting History</h2>
          <Button>Schedule Huddle</Button>
        </div>

        {huddles.length === 0 ? (
          <Card>
            <EmptyState
              title="No huddles recorded"
              description="Start tracking your team meetings and maintain consistent communication rhythm."
              actionLabel="Schedule First Huddle"
              onAction={() => alert('Huddle creation coming soon!')}
            />
          </Card>
        ) : (
          <div className="space-y-6">
            {huddles.map((huddle) => (
              <Card key={huddle.id}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{formatStatus(huddle.type)} Huddle</h3>
                    <p className="text-sm text-gray-500">{formatDate(huddle.date)}</p>
                  </div>
                  <p className="text-sm text-gray-600">{huddle.attendees.length} attendees</p>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-green-700 mb-2">Wins</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {huddle.wins.map((win, i) => (
                        <li key={i} className="text-sm text-gray-700">{win}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-red-700 mb-2">Stucks / Issues</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {huddle.stucks.map((stuck, i) => (
                        <li key={i} className="text-sm text-gray-700">{stuck}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-indigo-700 mb-2">Priorities</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {huddle.priorities.map((priority, i) => (
                        <li key={i} className="text-sm text-gray-700">{priority}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {huddle.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-700">{huddle.notes}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
