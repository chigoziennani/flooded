/**
 * DrumPicker — vertical scroll-snap picker (iOS UIPicker-style).
 */
import { useEffect, useMemo, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Font } from '@/constants/fonts';
import type { FloodedColors } from '@/constants/Theme';
import { useTheme } from '@/context/ThemeContext';

const ITEM_H = 46;
const VISIBLE = 5;
const CONTAINER_H = ITEM_H * VISIBLE;
const PADDING = ITEM_H * 2;

type Props<T extends string | number> = {
  values: T[];
  selected: T;
  onChange: (v: T) => void;
  renderLabel?: (v: T) => string;
  width?: number;
};

export function DrumPicker<T extends string | number>({
  values,
  selected,
  onChange,
  renderLabel,
  width = 90,
}: Props<T>) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const scrollRef = useRef<ScrollView>(null);
  const selectedIdx = values.indexOf(selected as never);
  const lastScrolledIdx = useRef(selectedIdx);

  useEffect(() => {
    const idx = values.indexOf(selected as never);
    if (idx >= 0) {
      scrollRef.current?.scrollTo({ y: idx * ITEM_H, animated: false });
      lastScrolledIdx.current = idx;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onScrollEnd = (e: { nativeEvent: { contentOffset: { y: number } } }) => {
    const y = e.nativeEvent.contentOffset.y;
    const rawIdx = Math.round(y / ITEM_H);
    const idx = Math.max(0, Math.min(rawIdx, values.length - 1));
    if (idx !== lastScrolledIdx.current) {
      lastScrolledIdx.current = idx;
      onChange(values[idx]);
    }
  };

  return (
    <View style={[styles.outer, { width }]}>
      <View style={[styles.fade, styles.fadeTop]} pointerEvents="none" />
      <View style={[styles.fade, styles.fadeBottom]} pointerEvents="none" />
      <View style={styles.rail} pointerEvents="none" />

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_H}
        decelerationRate="fast"
        onMomentumScrollEnd={onScrollEnd}
        onScrollEndDrag={onScrollEnd}
        contentContainerStyle={{ paddingVertical: PADDING }}
        style={{ height: CONTAINER_H }}
      >
        {values.map((v, i) => {
          const isSelected = i === selectedIdx;
          return (
            <View key={String(v)} style={styles.item}>
              <Text
                style={[
                  styles.itemText,
                  isSelected ? styles.itemTextSelected : styles.itemTextDim,
                ]}>
                {renderLabel ? renderLabel(v) : String(v)}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

function createStyles(colors: FloodedColors) {
  return StyleSheet.create({
    outer: {
      height: CONTAINER_H,
      overflow: 'hidden',
      position: 'relative',
    },
    fade: {
      position: 'absolute',
      left: 0,
      right: 0,
      height: ITEM_H * 2,
      zIndex: 2,
    },
    fadeTop: {
      top: 0,
      backgroundColor: colors.pickerFade,
    },
    fadeBottom: {
      bottom: 0,
      backgroundColor: colors.pickerFade,
    },
    rail: {
      position: 'absolute',
      top: ITEM_H * 2,
      left: 4,
      right: 4,
      height: ITEM_H,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.accent,
      zIndex: 1,
    },
    item: {
      height: ITEM_H,
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemText: {
      fontFamily: Font.medium,
      fontSize: 17,
    },
    itemTextSelected: { color: colors.text },
    itemTextDim: { color: colors.muted },
  });
}
