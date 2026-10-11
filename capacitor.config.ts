import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.resonance.neuralnet",
  appName: "Resonance Neural Net",
  webDir: "dist/public",
  bundledWebRuntime: false,
  android: {
    allowMixedContent: false,
  },
};

export default config;
