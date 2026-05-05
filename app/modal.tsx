import { StatusBar } from "expo-status-bar";
import { useMemo } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { FloodedColors } from "@/constants/Theme";
import { Space } from "@/constants/Theme";
import { useTheme } from "@/context/ThemeContext";

export default function AboutModal() {
  const { colors, Type, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.heroImgWrap}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&q=80",
            }}
            style={styles.heroImg}
            resizeMode="cover"
          />
        </View>
        <Text style={Type.wordmarkDisplay}>FLOODED</Text>
        <Text style={[styles.lead, Type.body]}>
          Tall-first fit: a light, minimal interface that puts inseam, torso,
          and proportions before hype. This prototype is for class presentation
          — demo data only.
        </Text>
        <Text style={[styles.h, Type.caption]}>PROBLEM</Text>
        <Text style={[styles.p, Type.body]}>
          Filters skip inseam, torso, and hip-to-waist. Shoppers tab between
          sites and eat return fees when proportions are wrong.
        </Text>
        <Text style={[styles.h, Type.caption]}>PROTOTYPE</Text>
        <Text style={[styles.p, Type.body]}>
          Home with search and categories. Profile for measurements and sample
          sign-in. Alerts for restock simulation. Product detail with fit
          feedback.
        </Text>
        <Text style={[styles.footer, Type.caption]}>
          Chigozie Nnani, Chichi Ogbuebile, Ade Adeniyi · Spring 2026 · INLS 382
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(colors: FloodedColors) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    scroll: { paddingHorizontal: 20, paddingBottom: 48 },
    heroImgWrap: {
      borderRadius: 8,
      overflow: "hidden",
      marginBottom: 22,
      marginTop: 8,
      height: 150,
      backgroundColor: colors.imagePlate,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.divider,
    },
    heroImg: { width: "100%", height: "100%" },
    lead: { marginTop: Space.md, maxWidth: 360 },
    h: { marginTop: 28 },
    p: { marginTop: 8, maxWidth: 360 },
    footer: { marginTop: 36, letterSpacing: 0.2 },
  });
}
