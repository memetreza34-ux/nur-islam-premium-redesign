import type { CSSProperties } from 'react';
import {
  BookOpen,
  BrainCircuit,
  CalendarDays,
  CircleDot,
  Compass,
  GraduationCap,
  HandHeart,
  MapPin,
  MessageCircleQuestion,
  Sparkles,
  SunMedium,
  Bookmark,
} from 'lucide-react';

/**
 * Semantic shortcut icons used across the premium UI.
 *
 * Release rule: interactive UI uses one real vector icon system. These wrappers
 * intentionally keep the existing Nur* API so screens do not need risky
 * structural changes during the final release pass, while the actual glyphs
 * now come from lucide-react instead of hand-drawn app-specific SVG paths.
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
    strokeWidth: 1.75,
    'aria-hidden': true as const,
  };
}

export function NurQuranIcon(props: IconProps) {
  return <BookOpen {...sharedProps(props)} />;
}

export function NurMihrabIcon(props: IconProps) {
  return <GraduationCap {...sharedProps(props)} />;
}

export function NurTasbihIcon(props: IconProps) {
  return <CircleDot {...sharedProps(props)} />;
}

export function NurQiblaIcon(props: IconProps) {
  return <Compass {...sharedProps(props)} />;
}

export function NurDuaIcon(props: IconProps) {
  return <HandHeart {...sharedProps(props)} />;
}

export function NurRosetteIcon(props: IconProps) {
  return <Sparkles {...sharedProps(props)} />;
}

export function NurMosqueIcon(props: IconProps) {
  return <MapPin {...sharedProps(props)} />;
}

export function NurCalendarIcon(props: IconProps) {
  return <CalendarDays {...sharedProps(props)} />;
}

export function NurBookmarkIcon(props: IconProps) {
  return <Bookmark {...sharedProps(props)} />;
}

export function NurPrayerTimesIcon(props: IconProps) {
  return <SunMedium {...sharedProps(props)} />;
}

export function NurQuizIcon(props: IconProps) {
  return <BrainCircuit {...sharedProps(props)} />;
}

export function NurAssistantIcon(props: IconProps) {
  return <MessageCircleQuestion {...sharedProps(props)} />;
}

export type NurIcon = (props: IconProps) => React.JSX.Element;
