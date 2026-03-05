import { OpaqueColorValue, StyleProp, ViewStyle, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { ARROW_SVG } from './arrow';
import { CODE_SVG } from './code';
import { HEART_SVG } from './heart';
import { HOME_SVG } from './home';
import { NOTIFICATION_SVG } from './notification';
import { PROFILE_SVG } from './profile';
import { SEARCH_SVG } from './search';
import { SEND_SVG } from './send';
import { SETTINGS_SVG } from './settings';
import { STAR_SVG } from './star';

export type IconName =
  | 'home'
  | 'send'
  | 'code'
  | 'settings'
  | 'search'
  | 'people'
  | 'profile'
  | 'lock'
  | 'chevron.right'
  | 'chevron.left'
  | 'checkmark'
  | 'star.fill'
  | 'exclamationmark.triangle'
  | 'arrow.down.circle.fill'
  | 'magnifyingglass'
  | 'lock.fill'
  | 'heart'
  | string;

const ICON_SVG: Record<string, string> = {
  'home': HOME_SVG,
  'send': SEND_SVG,
  'code': CODE_SVG,
  'settings': SETTINGS_SVG,
  'search': SEARCH_SVG,
  'magnifyingglass': SEARCH_SVG,
  'people': PROFILE_SVG,
  'profile': PROFILE_SVG,
  'lock': CODE_SVG, // Using code as fallback for lock
  'lock.fill': CODE_SVG,
  'chevron.right': ARROW_SVG,
  'chevron.left': ARROW_SVG, // Rotated dynamically below
  'checkmark': SEND_SVG, // Using send as checkmark substitute
  'star.fill': STAR_SVG,
  'exclamationmark.triangle': NOTIFICATION_SVG,
  'arrow.down.circle.fill': ARROW_SVG, // Rotated dynamically below
  'heart': HEART_SVG,
};

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconName;
  size?: number;
  color?: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle>;
}) {
  const rawSvg = ICON_SVG[name as string] || STAR_SVG; // Fallback to star if not found
  const svg = rawSvg ? rawSvg.substring(rawSvg.indexOf('<svg')) : '';
  
  // Handle simple rotations for reused icons
  let additionalStyle: StyleProp<ViewStyle> = {};
  if (name === 'chevron.left') {
    additionalStyle = { transform: [{ rotate: '180deg' }] };
  } else if (name === 'arrow.down.circle.fill') {
    additionalStyle = { transform: [{ rotate: '90deg' }] };
  }
  
  // Note: the SVGs have hardcoded styles/colors so the `color` prop is 
  // intentionally not applied directly to the SvgXml for the time being.

  return (
    <View style={[style, additionalStyle, { width: size, height: size, justifyContent: 'center', alignItems: 'center' }]}>
      <SvgXml
        xml={svg}
        width={size}
        height={size}
      />
    </View>
  );
}
