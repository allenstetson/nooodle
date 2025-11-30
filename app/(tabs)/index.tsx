import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  Button,
  Image,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import FadeBackground from "@/components/FadeBackground";

const API_BASE = "http://10.0.2.2:3000";

export default function HomeScreen() {
      const [input, setInput] = useState("");
      const [output, setOutput] = useState("");
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState<string | null>(null);
      const router = useRouter();


      const send = async () => {
            if (!input.trim()) return;
            setLoading(true);
            setError(null);
            setOutput("");

            try {
                const res = await axios.post(`${API_BASE}/api/generate`, {
                    prompt: input,
                });
                setOutput(res.data.text ?? "(no text)");
            } catch (err: any) {
                setError(err.message ?? "Unknown error");
            } finally {
                setLoading(false);
            }
      };


  return (
      <FadeBackground color="#fdf2d3">
    <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoider}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
        >

          <View style={styles.screen}>
                  {/* Top (logo / menu) */}
                  <View style={styles.header}>
                    {/* Left menu icon, right empty spacer */}
                    <View style={styles.headerSide} />
                    <Image
                      source={require("../../assets/images/nooodle_logo72.png")}
                      style={styles.logo}
                    />
                    <View style={styles.headerSide} />
                  </View>

                  {/* Middle (centered content) */}
                  <View style={styles.centeredContainer}>
                    <Text style={styles.title}>How's your headspace?</Text>

                    <View style={styles.pillRow}>
                      <Pill
                        label="I can't start"
                        style={styles.pillCantStart}
                        onPress={() => router.push("/cant-start")}
                      />
                      <Pill
                        label="Low energy"
                        style={styles.pillLowEnergy}
                        onPress={() => {
                          setInput("I have low energy");
                          send();
                        }}
                      />
                      <Pill
                          label="I'm distracted"
                          style={styles.pillDistracted}
                          onPress={() => {
                            setInput("I'm distracted");
                            send();
                          }}
                      />
                      <Pill
                        label="I feel overwhelmed"
                        style={styles.pillOverwhelmed}
                        onPress={() => {
                          setInput("I feel overwhelmed.");
                          send();
                        }}
                      />
                      <Pill
                        label="I'm anxious"
                        style={styles.pillAnxious}
                        onPress={() => {
                          setInput("I'm anxious.");
                          send();
                        }}
                      />
                      </View>

                    <View style={styles.responseBox}>
                      <Text style={styles.responseLabel}>Response:</Text>

                      {loading && <ActivityIndicator style={{ marginTop: 8 }} />}

                      {!loading && !!output && (
                        <ScrollView style={styles.scroll}>
                          <Text>{output}</Text>
                        </ScrollView>
                      )}

                      {!loading && !output && !error && <Text>�</Text>}

                      {error && <Text style={styles.error}>Error: {error}</Text>}
                    </View>

                  </View>

                  {/* Bottom (input bar) */}
                  <View style={styles.footer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Tell me in your own words..."
                      value={input}
                      onChangeText={setInput}
                      multiline={false}
                      returnKeyType="send"
                      blurOnSubmit={true}
                      onSubmitEditing={() => {
                        if (!loading) {
                          send();
                        }
                      }}
                    />

                  </View>
          </View>
    </KeyboardAvoidingView>
</SafeAreaView>
</FadeBackground>
);
}


type PillProperties = {
  label: string;
  style: object;
  onPress?: () => void;
};

function Pill({ label, style, onPress }: PillProperties) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.pillBase,
        style,
        pressed && styles.pillPressed,
      ]}
    >
      <Text style={styles.pillText}>{label}</Text>
    </Pressable>
  );
}


const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fdf2d3",
  },

  keyboardAvoider: {
    flex: 1,
  },

  screen: {  // Wraps all views in screen space
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  header: {  // Contains views for menu, logo, and space
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 8,
    paddingBottom: 12,
  },

  headerSide: {  // The view that contains menu/logo or space
    flex: 1,
  },

  centeredContainer: {  // Central content
    flex: 1,
    justifyContent: "center",     // << centered vertically
    alignItems: "center",          // << centered horizontally
    padding: 16,
  },

  title: {  // Used for big, black text
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
  },

  logo: {  // Nooodle logo
    width: 150,
    marginBottom: 12,
    resizeMode: "contain",
  },

  footer: {  // Used for text input at the bottom
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
  },

  input: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
    backgroundColor: "#fafafa",
  },

  buttonRow: {
    marginBottom: 24,
    alignSelf: "flex-start",
  },

  pillBase: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 999,
    marginRight: 3,
    marginBottom: 5,
  },

  pillText: {
    fontSize: 14,
    fontWeight: "500",
  },

  pillLowEnergy: { backgroundColor: "#D5C8FF" },
  pillDistracted: { backgroundColor: "#C9E9E7" },
  pillOverwhelmed: { backgroundColor: "#F6C1D1" },
  pillAnxious: { backgroundColor: "#F4E6B8" },
  pillCantStart: { backgroundColor: "#C9CCFF" },

  pillPressed: {
    opacity: 0.6,
  },

  pillRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      columnGap: 8,      // or just use marginRight on pillBase
      rowGap: 8,         // RN 0.71+; otherwise marginBottom on pillBase
      alignItems: "center",
  },


  responseBox: {
    width: "90%",
    alignItems: "flex-start",
  },

  responseLabel: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },

  scroll: {
    maxHeight: 200,
    width: "100%",
  },

  error: {
    color: "red",
    marginTop: 12,
  },
});

