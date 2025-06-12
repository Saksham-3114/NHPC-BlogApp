import { cn } from "@/lib/utils";
import { IconHeart } from '@tabler/icons-react';
import Link from "next/link";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid max-w-full grid-cols-2 gap-4 md:auto-rows-[18rem] md:grid-cols-6",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  id,
  title,
  description,
  header,
  likes
}: {
  className?: string;
  id?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  likes?: number | React.ReactNode;
  header?: React.ReactNode;
}) => {
  return (
    
      <div
      className={cn(
        "group/bento shadow-input row-span-1 flex flex-col justify-between space-y-4 rounded-xl border border-neutral-200 bg-white p-4 transition duration-200 hover:shadow-xl  dark:shadow-none",
        className,
      )}
    >
      {header}
      <div className="transition duration-200 group-hover/bento:translate-x-2">
        <span className="flex gap-0.5"><IconHeart stroke={1} /> {likes}</span>
        <div className=" mb-2 font-sans font-bold text-neutral-600 hover:underline cursor-pointer">
          <Link href={`/blog/${id}`}>{title}</Link>
        </div>
        <div className="font-sans text-xs font-normal text-neutral-600 cursor-pointer">
          {description}
        </div>
      </div>
    </div>
    
  );
};
