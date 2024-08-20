import LoginPage from "../pages/LoginPage/LoginPage";
import NavigationLayout from "./NavigationLayout";


export default function MainOrLoginRoute() {
  const isSignedIn = false;

  if (isSignedIn) {
    return <NavigationLayout />;
  } else {
    return <LoginPage />;
  }
}
