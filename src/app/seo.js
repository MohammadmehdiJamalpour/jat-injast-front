export const siteName = "جات اینجاست";

export function getSiteUrl() {
  const value =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    "http://localhost:3000";

  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  return withProtocol.replace(/\/+$/, "");
}

export function absoluteUrl(path = "/") {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${cleanPath}`;
}

export function createPageMetadata({
  path,
  title,
  description,
  image = "/assets/images/app-icons-dark-tile/app-icon-dark-navy-512.png",
  type = "website",
}) {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);
  const socialTitle =
    typeof title === "string" ? title : title?.absolute || title?.default || siteName;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: socialTitle,
      description,
      url,
      siteName,
      locale: "fa_IR",
      type,
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [imageUrl],
    },
  };
}

export function jsonLdScript(data) {
  return {
    __html: JSON.stringify(data).replace(/</g, "\\u003c"),
  };
}
