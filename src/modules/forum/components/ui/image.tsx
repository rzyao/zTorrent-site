import * as React from "react";

const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==";

function resolveForumAssetUrl(src?: string): string | undefined {
  if (!src) return src;
  if (src.startsWith("data:") || src.startsWith("blob:")) return src;

  try {
    const url = new URL(src, window.location.origin);
    if (url.pathname.startsWith("/uploads/")) {
      return `${url.pathname}${url.search}${url.hash}`;
    }
    return src;
  } catch {
    return src;
  }
}

export const ForumImage = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ src, referrerPolicy, onError, ...rest }, ref) => {
  const [didError, setDidError] = React.useState(false);

  React.useEffect(() => {
    setDidError(false);
  }, [src]);

  const safeSrc = resolveForumAssetUrl(typeof src === "string" ? src : undefined);
  const invalidSrc = !safeSrc || safeSrc.trim() === "";

  if (didError || invalidSrc) {
    return <img ref={ref} src={ERROR_IMG_SRC} alt="" {...rest} />;
  }

  return (
    <img
      ref={ref}
      referrerPolicy={referrerPolicy ?? "no-referrer"}
      src={safeSrc}
      {...rest}
      onError={(e) => {
        setDidError(true);
        onError?.(e);
      }}
    />
  );
});

ForumImage.displayName = "ForumImage";

