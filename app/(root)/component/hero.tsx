import React from "react";
import { HeroParallax } from "@/components/ui/hero-parallax";
import {db} from "@/lib/db";
 

type Posts=({
    _count: {
        likes: number;
    };
} & {
    id: string;
    createdAt: Date;
    content: string;
    authorId: string;
    title: string;
    published: boolean;
    Category: string[];
})[]

export async function HeroParallaxDemo() {
  const posts : Posts = await db.post.findMany({
    where:{published: true},
    orderBy:{createdAt: "desc"},
    take: 10,
    include:{
      _count:{
        select:{
          likes:true
        }
      }
    }
  })
  return <HeroParallax products={products} posts={posts} />;
}
export const products = [
  {
    title: "Chamera-I, Himachal Pradesh",
    link: "/",
    thumbnail:
      "/hero-projects/chamera.jpg",
  },
  {
    title: "Parbati-III, Himachal Pradesh",
    link: "/",
    thumbnail:
      "/hero-projects/parbati3.jpg",
  },
  {
    title: "Loktak, Manipur",
    link: "/",
    thumbnail:
      "/hero-projects/loktak.jpg",
  },

  {
    title: "Teesta Low Dam-III, West Bengal",
    link: "/",
    thumbnail:
      "/hero-projects/tld3.jpg",
  },
  {
    title: "Rangit, Sikkim",
    link: "/",
    thumbnail:
      "/hero-projects/rangit.jpg",
  },
  {
    title: "Nimmo Bazgo, Ladakh",
    link: "/",
    thumbnail:
      "/hero-projects/Nimmo.jpg",
  },

  {
    title: "Tanakpur, Uttarakhand",
    link: "/",
    thumbnail:
      "/hero-projects/tanakpur.jpg",
  },
  {
    title: "Uri-I, Jammu & Kashmir",
    link: "/",
    thumbnail:
      "/hero-projects/uri1.jpg",
  },
  {
    title: "Salal, Jammu & Kashmir",
    link: "/",
    thumbnail:
      "/hero-projects/salal.jpg",
  },
  {
    title: "Dhauliganga, Uttarakhand",
    link: "/",
    thumbnail:
      "/hero-projects/dhauliganga.jpg",
  },
  {
    title: "Chamera-II, Himachal Pradesh",
    link: "/",
    thumbnail:
      "/hero-projects/chamera2.jpg",
  },

  {
    title: "Chutak, Ladakh",
    link: "/",
    thumbnail:
      "/hero-projects/chutak.jpg",
  },
  {
    title: "Dulhasti, Himachal Pradesh",
    link: "/",
    thumbnail:
      "/hero-projects/dulhasti.jpg",
  },
  {
    title: "Rangit, Sikkim",
    link: "/",
    thumbnail:
      "/hero-projects/rangit.jpg",
  },
  {
    title: "Uri-II, Jammu & Kashmir",
    link: "/",
    thumbnail:
      "/hero-projects/uri2.jpg",
  },
];
