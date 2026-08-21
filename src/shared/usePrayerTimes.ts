import { useCallback, useEffect, useRef, useState } from 'react';
import {
  applyPrayerSnapshotToSharedSchedule,
  fetchPrayerTimes,
  getFallbackPrayerTimesSnapshot,
  loadCachedPrayerTimes,
  loadPrayerLocation,
  loadPrayerPreferences,
  savePrayerLocation,
  savePrayerPreferences,
} from '../services/prayerTimesService';
import type {
  PrayerLocation,
  PrayerTimesPreferences,
  PrayerTimesSnapshot,
} from '../services/prayerTimesService';

export type PrayerTimesStatus = 'loading' | 'live' | 'cache' | 'fallback' | 'location-denied';

function requestDeviceCoordinates(): Promise<PrayerLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Standort wird auf diesem Gerät nicht unterstützt.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        label: 'Aktueller Gerätestandort',
        source: 'device',
      }),
      (error) => reject(error),
      { enableHighAccuracy: true, timeout: 9000, maximumAge: 300000 },
    );
  });
}

export function usePrayerTimes() {
  const initialLocation = loadPrayerLocation();
  const initialPreferences = loadPrayerPreferences();
  const cached = loadCachedPrayerTimes();
  const fallback = getFallbackPrayerTimesSnapshot();
  const [snapshot, setSnapshot] = useState<PrayerTimesSnapshot>(cached ?? fallback);
  const [status, setStatus] = useState<PrayerTimesStatus>(cached ? 'cache' : 'fallback');
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestCounter = useRef(0);

  const load = useCallback(async (
    location: PrayerLocation,
    preferences: PrayerTimesPreferences,
  ) => {
    const requestId = requestCounter.current + 1;
    requestCounter.current = requestId;
    setRefreshing(true);
    setStatus('loading');
    setError(null);

    try {
      const live = await fetchPrayerTimes(location, preferences);
      if (requestCounter.current !== requestId) return 'ignored' as const;
      setSnapshot(live);
      applyPrayerSnapshotToSharedSchedule(live);
      setStatus('live');
      return 'live' as const;
    } catch (reason) {
      if (requestCounter.current !== requestId) return 'ignored' as const;
      const message = reason instanceof Error ? reason.message : 'Gebetszeiten konnten nicht geladen werden.';
      const stored = loadCachedPrayerTimes();
      if (stored) {
        setSnapshot(stored);
        applyPrayerSnapshotToSharedSchedule(stored);
        setStatus('cache');
      } else {
        const nextFallback = getFallbackPrayerTimesSnapshot();
        setSnapshot(nextFallback);
        applyPrayerSnapshotToSharedSchedule(nextFallback);
        setStatus('fallback');
      }
      setError(message);
      return stored ? 'cache' as const : 'fallback' as const;
    } finally {
      if (requestCounter.current === requestId) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load(snapshot.location, snapshot.preferences);
    // Der erste Abruf soll nur einmal pro Mount mit dem gespeicherten Ausgangszustand erfolgen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load]);

  const refresh = useCallback(() => load(snapshot.location, snapshot.preferences), [load, snapshot.location, snapshot.preferences]);

  const requestLocation = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const location = await requestDeviceCoordinates();
      savePrayerLocation(location);
      return await load(location, snapshot.preferences);
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : 'Standort wurde nicht freigegeben.';
      setStatus('location-denied');
      setError(message);
      setRefreshing(false);
      return 'location-denied' as const;
    }
  }, [load, snapshot.preferences]);

  const updatePreferences = useCallback(async (preferences: PrayerTimesPreferences) => {
    savePrayerPreferences(preferences);
    setSnapshot((current) => ({ ...current, preferences }));
    return load(snapshot.location, preferences);
  }, [load, snapshot.location]);

  return {
    schedule: snapshot.schedule,
    meta: snapshot.meta,
    location: snapshot.location,
    preferences: snapshot.preferences,
    source: snapshot.source,
    fetchedAt: snapshot.fetchedAt,
    status,
    refreshing,
    error,
    refresh,
    requestLocation,
    updatePreferences,
  };
}
