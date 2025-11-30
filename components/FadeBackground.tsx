import React, { useEffect } from "react";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { StyleSheet } from "react-native";

export default function FadeBackground({ color, duration = 350, children }) {
  const bg = useSharedValue(color);

  useEffect(() => {
    bg.value = withTiming(color, { duration });
  }, [color]);

  const style = useAnimatedStyle(() => ({
    backgroundColor: bg.value,
  }));

  return <Animated.View style={[styles.container, style]}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
