// app/cant-start.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Image,
} from "react-native";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import FadeBackground from "@/components/FadeBackground";
import { LinearGradient } from "expo-linear-gradient";

const API_BASE = "http://10.0.2.2:3000";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

export default function CantStartScreen() {
    const router = useRouter();
    const initialPrompt = "I can't get started.";

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const scrollRef = useRef<ScrollView | null>(null);

    // Kick off the first exchange when we land on the page
    useEffect(() => {
        // Only start if we don't already have messages
        if (messages.length === 0) {
            startInitialConversation(initialPrompt);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const startInitialConversation = async (promptText: string) => {
        const firstUser: Message = {
            id: `user-${Date.now()}`,
            role: "user",
            text: promptText,
        };

        setMessages([firstUser]);
        await sendToBackend([firstUser]);
    };

    const buildConversationPrompt = (history: Message[]): string => {
        const header =
            "You are a gentle, focused coach helping someone who says they can't get started on their work. " +
            "Keep responses short, concrete, and encouraging. Ask one small follow-up question at a time. " +
            "Reply in plain text only — do not use Markdown formatting, *, **, _, backticks, or lists.\n\n" +
            "Conversation so far:\n";

        const body = history
        .map((m) => (m.role === "user" ? `User: ${m.text}` : `Coach: ${m.text}`))
        .join("\n");

        const footer = "\n\nCoach:";

        return header + body + footer;
    };

    const sendToBackend = async (history: Message[]) => {
        setLoading(true);
        setError(null);

        try {
            const prompt = buildConversationPrompt(history);
            const res = await axios.post(`${API_BASE}/api/generate`, {
                prompt,
            });

            const aiText: string = res.data.text ?? "(no response)";

            const aiMessage: Message = {
                id: `assistant-${Date.now()}`,
                role: "assistant",
                text: aiText,
            };

            setMessages((prev) => [...prev, aiMessage]);
        } catch (err: any) {
            setError(err.message ?? "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        const trimmed = input.trim();
        if (!trimmed || loading) return;

        const userMessage: Message = {
            id: `user-${Date.now()}`,
            role: "user",
            text: trimmed,
        };

        setInput("");
        setMessages((prev) => {
            const updated = [...prev, userMessage];
            // fire & forget, but use updated history
            sendToBackend(updated);
            return updated;
        });
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <FadeBackground color="#c9d4ef">
            <SafeAreaView style={styles.safe}>
                <KeyboardAvoidingView
                    style={styles.keyboardAvoider}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
                >

                {/* Header */}
                <View style={styles.customHeader}>
                    <View style={styles.headerLeft}>
                        <View style={styles.avatarWrapper}>
                            <Image
                                source={require("../assets/images/nooodle_avtr.png")}
                                style={styles.avatarImage}
                            />
                        </View>
                        <View style={styles.onlineDot} />
                        <View style={styles.headerTextWrapper}>
                            <Text style={styles.headerName}>Nooodle</Text>
                            <Text style={styles.headerStatus}>Online now</Text>
                        </View>
                    </View>

                    <Pressable onPress={handleBack} style={styles.closeButton}>
                        <Text style={styles.closeText}>✕</Text>
                    </Pressable>
                </View>

                {/* Main Body */}
                <View style={styles.screen}>
                    {/* Conversation */}
                    <View style={styles.chatContainer}>
                        <ScrollView
                            ref={scrollRef}
                            contentContainerStyle={styles.chatContent}
                            onContentSizeChange={() => {
                                if (scrollRef.current) {
                                    scrollRef.current.scrollToEnd({ animated: true });
                                }
                            }}
                        >
                            {messages.map((m) => (
                                <View
                                    key={m.id}
                                    style={[
                                        styles.bubble,
                                        m.role === "user" ? styles.userBubble : styles.aiBubble,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.bubbleText,
                                            m.role === "user" ? styles.userText : styles.aiText,
                                        ]}
                                    >
                                    {m.text}
                                    </Text>
                                </View>
                            ))}

                            {loading && (
                                <View style={[styles.bubble, styles.aiBubble]}>
                                    <ActivityIndicator />
                                </View>
                            )}

                            {error && (
                                <View style={[styles.bubble, styles.errorBubble]}>
                                    <Text style={styles.errorText}>Error: {error}</Text>
                                </View>
                            )}
                        </ScrollView>
                    </View> { /* End chat container */}

                    {/* Input bar */}
                    <View style={styles.footer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Tell me in your own words..."
                            value={input}
                            onChangeText={setInput}
                            multiline={false}
                            returnKeyType="send"
                            blurOnSubmit={true}
                            onSubmitEditing={handleSend}
                        />
                        {/*}
                            <Pressable style={styles.sendButton} onPress={handleSend}>
                                <Text style={styles.sendButtonText}>Send</Text>
                            </Pressable>
                        */}
                    </View> {/* End Footer */}
                </View> {/* End Screen */}
                </KeyboardAvoidingView>
            </SafeAreaView>
        </FadeBackground>
    );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#c9d4ef",
  },
  keyboardAvoider: {
    flex: 1,
  },
  screen: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerSide: {
    width: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  backText: {
    fontSize: 20,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#3A50A0",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#555",
    marginTop: 2,
  },
  chatContainer: {
    flex: 1,
    marginTop: 8,
    marginBottom: 8,
  },
  chatContent: {
    paddingVertical: 8,
  },
  bubble: {
    maxWidth: "80%",
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 4,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#FFFFFF",
    borderTopRightRadius: 0,
  },
  aiBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#a1b6dc",
    borderTopLeftRadius: 0,
  },
  bubbleText: {
    fontSize: 15,
    color: "#1C1C24",
  },
  userText: {
    color: "#000",
  },
  aiText: {
    color: "#333",
  },
  errorBubble: {
    alignSelf: "center",
    backgroundColor: "#ffe5e5",
  },
  errorText: {
    color: "#b00000",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 8,
  },
  input: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#F3EDE3",
    marginRight: 8,
  },
  sendButton: {
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#C9CCFF",
  },
  sendButtonText: {
    fontWeight: "600",
  },

  customHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: "#b0bcdf",
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: "rgba(0,0,0,0.05)",
    },

    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
    },

    avatarWrapper: {
      width: 36,
      height: 36,
      borderRadius: 18,
      overflow: "hidden",
      marginRight: 8,
      justifyContent: "center",
      alignItems: "center",
    },

    avatarImage: {
      width: 40,
      height: 40,
      resizeMode: "contain",
    },

    onlineDot: {
      position: "absolute",
      top: 2,
      left: 25,
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: "#4CAF50", // green
      borderWidth: 1,
      borderColor: "#FFFFFF",
    },

    headerTextWrapper: {
      justifyContent: "center",
    },

    headerName: {
      fontSize: 16,
      fontWeight: "700",
      color: "#3A50A0",
    },

    headerStatus: {
      fontSize: 12,
      color: "#52629B",
    },

    closeButton: {
      padding: 8,
    },

    closeText: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#1C1C24",
    },
});
