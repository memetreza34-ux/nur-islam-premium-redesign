import { useCallback, useEffect, useRef, useState } from 'react';
import {
  applyPrayerSnapshotToSharedSchedule,
  createFallbackPrayerSnapshot,
  fetchPrayerTimes,
  getInitialPrayerTimesSnapshot,
  loadCachedPrayerTimes,
  loadFollowingPrayerDay,
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
  const [snapshot, setSnapshot] = useState<PrayerTimesSnapshot>(getInitialPrayerTimesSnapshot);
  const [status, setStatus] = useState<PrayerTimesStatus>(snapshot.source);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestCounter = useRef(0);

  const load = useCallback(async (
    location: PrayerLocation,
    preferences: PrayerTimesPreferences,
  ) => {
    const requestId = requestCounter.current + 1;
    requestCounter.current = requestId;
    const pending = loadCachedPrayerTimes(new Date(), location, preferences)
      ?? createFallbackPrayerSnapshot(location, preferences);
    setSnapshot(pending);
    applyPrayerSnapshotToSharedSchedule(pending);
    setRefreshing(true);
    setStatus('loading');
    setError(null);

    try {
      const live = await fetchPrayerTimes(location, preferences);
      if (requestCounter.current !== requestId) return 'ignored' as const;
      applyPrayerSnapshotToSharedSchedule(live);
      void loadFollowingPrayerDay(live);
      setSnapshot(live);
      setStatus('live');
      return 'live' as const;
    } catch (reason) {
      if (requestCounter.current !== requestId) return 'ignored' as const;
      const message = reason instanceof Error ? reason.message : 'Gebetszeiten konnten nicht geladen werden.';
      const stored = loadCachedPrayerTimes(new Date(), location, preferences);
      const unavailable = createFallbackPrayerSnapshot(location, preferences);
      applyPrayerSnapshotToSharedSchedule(stored ?? unavailable);
      if (stored) void loadFollowingPrayerDay(stored);
      if (stored) {
        setSnapshot(stored);
        setStatus('cache');
      } else {
        setSnapshot(unavailable);
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
    return () => { requestCounter.current += 1; };
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
