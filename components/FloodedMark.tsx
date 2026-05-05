/**
 * FloodedMark — brand logo mark using pure View components.
 */
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/context/ThemeContext';

type Props = {
  size?: number;
  /** Tint colour for the bars. Defaults to theme accent. */
  color?: string;
};

export function FloodedMark({ size = 16, color }: Props) {
  const { colors } = useTheme();
  const tint = color ?? colors.accent;
  const unit = size / 10;
  return (
    <View style={styles.wrap}>
      <View
        style={{
          width: unit * 10,
          height: unit * 1.5,
          borderRadius: unit * 0.5,
          backgroundColor: tint,
          marginBottom: unit * 1.5,
        }}
      />
      <View
        style={{
          width: unit * 7,
          height: unit * 1.5,
          borderRadius: unit * 0.5,
          backgroundColor: tint,
          marginBottom: unit * 1.5,
        }}
      />
      <View
        style={{
          width: unit * 4.5,
          height: unit * 1.5,
          borderRadius: unit * 0.5,
          backgroundColor: tint,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'flex-start', justifyContent: 'flex-start' },
});
