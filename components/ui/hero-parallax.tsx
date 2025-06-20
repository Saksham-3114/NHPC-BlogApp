/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "motion/react";
import HomeBlogList from "../HomeBlogList";

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
    published: "true" | "false" | "reject";
    Category: string[];
})[]


export const HeroParallax = ({
  products, posts
}: {
  products: {
    title: string;
    link: string;
    thumbnail: string;
  }[];
  posts: Posts
}) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-2200, 250]),
    springConfig
  );
  return (
    <div
      ref={ref}
      className="h-[500vh] py-40 overflow-hidden  antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header />
      <div className="max-w-7xl relative mx-auto py-10 px-4 w-full  left-0 top-20">
      <h1 className="text-2xl md:text-7xl font-bold text-blue-900">
        Recent Blogs <br />
      </h1>
    </div>
      <div className="relative -z-10 min-h-screen flex items-center justify-center flex-wrap overflow-auto">
          <HomeBlogList posts={posts}/>
      </div>
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className=""
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row  mb-20 space-x-20 ">
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  return (
    <>
    <div className="max-w-7xl relative mx-auto py-10 md:py-20 px-4 w-full  left-0 top-0">
      <h1 className="text-2xl md:text-7xl font-bold text-blue-900">
        NHPC Ltd. <br /> India&apos;s Premier Hydro Power Utility
      </h1>
      <p className="max-w-2xl text-base md:text-xl mt-8 text-blue-500">
        Welcome to the official blog of NHPC Ltd., where we share stories of innovation, sustainability, and national development.
Explore articles, project updates, and behind-the-scenes insights from India&apos;s leading hydropower enterprise.
      </p>
    </div>
    {/* <div className="max-w-7xl relative mx-auto my-auto py-20 md:py-40 px-4 w-full left-0 top-0 bg-blue-500">
      <h1>For You</h1>
    </div> */}
    </>
      
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
  };
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className="group/product h-96 w-[30rem] relative shrink-0"
    >
      <a
        href={product.link}
        className="block group-hover/product:shadow-2xl "
      >
        <img
          src={product.thumbnail}
          height="600"
          width="600"
          className="object-cover object-left-top absolute h-full w-full inset-0"
          alt={product.title}
        />
      </a>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none"></div>
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white">
        {product.title}
      </h2>
    </motion.div>
  );
};
