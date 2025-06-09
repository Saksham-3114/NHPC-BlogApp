import { FC } from "react";
import { Button } from "./button"
import { GoogleLogin } from "@/app/actions";

interface GoogleSignInButtonProps {
  children: React.ReactNode;
}

const GoogleSignInButton: FC<GoogleSignInButtonProps> = ({children}) => {
    // const logInWithGoogle = () => {
    //     // window.location.href = "/api/auth/signin/google";
    //     console.log("Redirecting to Google Sign-In");
    // };
  return (
    <Button className="w-full" onClick={GoogleLogin}>{children}</Button>
  );
}

export default GoogleSignInButton