import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { type User } from "next-auth";
import { db } from "@/lib/db";
import { compare } from "bcrypt";
 
export const { handlers, signIn, signOut, auth } = NextAuth({
    session: {
        strategy: "jwt",
    },
  providers: [
    CredentialsProvider({
        async authorize(credentials): Promise<User | null> {
            if(credentials===null) return null;
            try{
                const user = await db.user.findUnique({
                    where: {email: credentials?.email as string},
                });
                if(user){
                    const isValid = await compare(credentials?.password as string, user.password);
                    if(isValid){
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const { password, ...userWithoutPassword } = user;
                        return userWithoutPassword as User;
                    }else{
                        throw new Error("Invalid password");
                    }
                }else{
                    throw new Error("User not found");
                }
            }catch(e){
                throw new Error("Invalid credentials", { cause: e });
            }
        }
    }),
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        authorization: {
            params: {
                prompt: "consent",
                access_type: "offline",
                response_type: "code",
            }
        }
    })
  ],
})