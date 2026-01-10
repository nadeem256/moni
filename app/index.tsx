import { Redirect } from 'expo-router';

export default function Index() {
  // Skip onboarding and go directly to main app
  return <Redirect href="/(tabs)" />;
}