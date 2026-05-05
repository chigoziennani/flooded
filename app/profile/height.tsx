import { Redirect } from 'expo-router';

/** Height + inseam live on the measurement flow. */
export default function HeightProfileRedirect() {
  return <Redirect href="/profile/measurements" />;
}
