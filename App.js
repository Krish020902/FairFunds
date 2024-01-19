import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import ContributionApp from "./Contribute";
// import ContributionApp from "./temp";
export default function App() {
  return (
    <View style={styles.container}>
      {/* <ContributionApp /> */}
      <ContributionApp />
      {/* <Text>Open up App.js to start working on your app!</Text> */}
      {/* <StatusBar style="auto" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
