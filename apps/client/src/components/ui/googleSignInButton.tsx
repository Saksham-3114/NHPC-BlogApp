import { FC } from "react";
import { Button } from "./button"

interface GoogleSignInButtonProps {
  children: React.ReactNode;
}

const GoogleSignInButton: FC<GoogleSignInButtonProps> = ({children}) => {
    const logInWithGoogle = () => {
        // window.location.href = "/api/auth/signin/google";
        console.log("Redirecting to Google Sign-In");
    };
  return (
    <Button className="w-full" onClick={logInWithGoogle}>{children}</Button>
  );
}

export default GoogleSignInButton