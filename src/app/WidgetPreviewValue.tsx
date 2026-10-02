import type { PremiumWidgetId } from '../services/premiumLocalService';

export function splitWidgetValue(id: PremiumWidgetId, value: string) {
  const pattern = id === 'islamic-date'
    ? /^(\d+)\.\s+(.+)$/
    : ['dhikr', 'favorites', 'reminders', 'weekly-prayers', 'routine'].includes(id)
      ? /^(\d+(?:\/\d+)?)\s+(.+)$/
      : null;
  const match = pattern?.exec(value);
  return match ? { number: match[1], label: match[2] } : null;
}

export function WidgetPreviewValue({ id, value }: { id: PremiumWidgetId; value: string }) {
  const metric = splitWidgetValue(id, value);
  return metric
    ? <strong className="premium-widget-value" aria-label={value}><b aria-hidden="true">{metric.number}</b><span aria-hidden="true">{metric.label}</span></strong>
    : <strong>{value}</strong>;
}
