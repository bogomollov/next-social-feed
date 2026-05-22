import * as React from "react";
import Image from "next/image";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

const avatarVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted text-secondary-foreground",
  {
    variants: {
      size: {
        sm: "size-8 text-xs",
        default: "size-10 text-sm",
        lg: "size-12 text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

function Avatar({
  className,
  size,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof avatarVariants>) {
  return <div data-slot="avatar" className={cn(avatarVariants({ size }), className)} {...props} />;
}

function AvatarImage({
  className,
  alt = "",
  sizes = "40px",
  ...props
}: Omit<React.ComponentProps<typeof Image>, "fill">) {
  return (
    <Image
      data-slot="avatar-image"
      alt={alt}
      fill
      sizes={sizes}
      className={cn("object-cover", className)}
      {...props}
    />
  );
}

function AvatarFallback({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-fallback"
      className={cn("flex size-full items-center justify-center bg-accent/70 text-foreground", className)}
      {...props}
    />
  );
}

export { Avatar, AvatarFallback, AvatarImage };
