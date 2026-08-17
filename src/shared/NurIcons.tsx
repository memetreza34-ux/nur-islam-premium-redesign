import type { CSSProperties } from 'react';
import {
  BookOpen,
  BookOpenCheck,
  Bookmark,
  CalendarDays,
  CircleDot,
  CircleHelp,
  Clock3,
  Compass,
  Heart,
  Landmark,
  MessageSquare,
  Star,
} from 'lucide-react';

/**
 * Semantic shortcut icons used across the premium UI.
 *
 * The app keeps one coherent vector language, but deliberately avoids the
 * stereotypical "AI" symbols (sparkles, brain/circuit glyphs, novelty marks)
 * for ordinary navigation. Each symbol should explain the destination before
 * decoration: book for Quran, clock for prayer, compass for Qibla, and so on.
 */

type IconProps = {
  size?: number;
  className?: string;
  style?: CSSProperties;
};

function sharedProps({ size = 24, className = '', style }: IconProps) {
  return {
    size,
    className: `nur-icon ${className}`.trim(),
    style,
    strokeWidth: 1.9,
    'aria-hidden': true as const,
  };
}

export function NurQuranIcon(props: IconProps) {
  return <BookOpen {...sharedProps(props)} />;
}

export function NurMihrabIcon(props: IconProps) {
  return <BookOpenCheck {...sharedProps(props)} />;
}

export function NurTasbihIcon(props: IconProps) {
  return <CircleDot {...sharedProps(props)} />;
}

export function NurQiblaIcon(props: IconProps) {
  return <Compass {...sharedProps(props)} />;
}

export function NurDuaIcon(props: IconProps) {
  return <Heart {...sharedProps(props)} />;
}

export function NurRosetteIcon(props: IconProps) {
  return <Star {...sharedProps(props)} />;
}

export function NurMosqueIcon(props: IconProps) {
  return <Landmark {...sharedProps(props)} />;
}

export function NurCalendarIcon(props: IconProps) {
  return <CalendarDays {...sharedProps(props)} />;
}

export function NurBookmarkIcon(props: IconProps) {
  return <Bookmark {...sharedProps(props)} />;
}

export function NurPrayerTimesIcon(props: IconProps) {
  return <Clock3 {...sharedProps(props)} />;
}

export function NurQuizIcon(props: IconProps) {
  return <CircleHelp {...sharedProps(props)} />;
}

export function NurAssistantIcon(props: IconProps) {
  return <MessageSquare {...sharedProps(props)} />;
}

export type NurIcon = (props: IconProps) => React.JSX.Element;
