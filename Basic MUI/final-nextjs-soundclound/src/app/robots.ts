import { MetadataRoute } from "next";

// Mục đích để cho các con bot google hoặc bất kì những thứ liên quan đến tìm kiếm có thể
// đào được thông tin dễ dàng -> phục vụ cho mục đích SEO nhanh chóng
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/private/",
    },
    sitemap: "http://localhost:3000/sitemap.xml",
  };
}
