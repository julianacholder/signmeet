'use client';

import { useEffect, useState } from 'react';

interface Stats {
  totalMeetings: number;
  rescheduledMeetings: number;
  cancelledMeetings: number;
}

export function useStats() {
  const [stats, setStats] = useState<Stats>({
    totalMeetings: 0,
    rescheduledMeetings: 0,
    cancelledMeetings: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/stats');
      
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      
      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load statistics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, isLoading, error, refetch: fetchStats };
}