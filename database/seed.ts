import { PrismaClient } from "./generated/prisma";

const prisma = new PrismaClient();

async function main() {
    // Delete existing data
    await prisma.user.deleteMany();
    await prisma.post.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.like.deleteMany();

    // Create users
    const user1=await prisma.user.create({
        data: {
            email: "user1@nhpc.com",
            password: "password1",
            name: "user1",
        },
    });

    const user2=await prisma.user.create({
        data: {
            email: "user2@nhpc.com",
            password: "password2",
            name: "user2",
        },
    });

    const user3=await prisma.user.create({
        data: {
            email: "user3@nhpc.com",
            password: "password3",
            name: "user3",
        },
    });

    // Create posts
    const post1=await prisma.post.create({
        data:{
            title: "Post 1",
            content: "Content of post 1",
            published: true,
            author:{
                connect: { id: user1.id },
            },
        },
    });
    const post2=await prisma.post.create({
        data:{
            title: "Post 2",
            content: "Content of post 2",
            published: true,
            author:{
                connect: { id: user2.id },
            },
        },
    });
    const post3=await prisma.post.create({
        data:{
            title: "Post 3",
            content: "Content of post 3",
            author:{
                connect: { id: user1.id },
            },
        },
    });

    // Create comments
    await prisma.comment.createMany({
        data: [
            {
                content: "Comment on post 1 by user 2",
                postId: post1.id,
                authorId: user2.id,
            },
            {
                content: "Comment on post 2 by user 3",
                postId: post2.id,
                authorId: user3.id,
            },
            {
                content: "Another comment on post 1 by user 3",
                postId: post1.id,
                authorId: user3.id,
            },
        ],
    });

    // Create likes
    await prisma.like.createMany({
        data: [
            {
                postId: post3.id,
                authorId: user2.id,
            },
            {
                postId: post2.id,
                authorId: user3.id,
            },
            {
                postId: post1.id,
                authorId: user3.id,
            },
        ],
    });
}

main()
.then(async()=>{
    await prisma.$disconnect();
    console.log("seeded successfully");
})
.catch(async(e)=>{
    console.error("Error seeding database:", e);
    await prisma.$disconnect();
    process.exit(1);
})