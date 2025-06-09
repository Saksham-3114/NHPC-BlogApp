import { HeroParallaxDemo } from "@/app/(root)/component/hero";
import { auth } from "@/auth";

export default async function Home() {
  const session =await auth();
  console.log("Session:", session);
  return (
    <HeroParallaxDemo/>
  );
}
