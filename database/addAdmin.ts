import { db } from "@/lib/db";
import { hash } from "bcrypt"


async function main() {
    // Create Admin
    const pass = "adminPassword";
    const hashedPass = await hash(pass,10)
    const admin=await db.user.create({
        data: {
            email: "admin3@nhpc.com",
            password: hashedPass,
            role: "admin",
            name: "admin3",
        },
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {password, ...Admin} = admin
    console.log(Admin)
}

main()
.then(async()=>{
    await db.$disconnect();
    console.log("Admin added successfully");
})
.catch(async(e)=>{
    console.error("Error seeding database:", e);
    await db.$disconnect();
    process.exit(1);
})