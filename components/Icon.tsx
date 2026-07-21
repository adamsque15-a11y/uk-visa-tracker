import { StyleProp, TextStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../lib/theme';

// A single icon family (Feather — visually equivalent to Lucide, which is a
// fork of it) used everywhere instead of emoji, so the whole app reads as
// one consistent icon set rather than whatever a given emoji font ships.
export type IconName = keyof typeof Feather.glyphMap;

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export default function Icon({ name, size = 20, color = colors.textPrimary, style }: IconProps) {
  return <Feather name={name} size={size} color={color} style={style} />;
}
