import React from "react";
import { Helmet } from "react-helmet-async";

const SEO = ({
  title,
  description,
  ogTitle,
  ogDescription,
  ogType,
  ogImage,
  ogUrl,
  siteName,
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {/* Open Graph Tags */}
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:site_name" content={siteName} />

      {/* Meta Viewport Tag */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Helmet>
  );
};

export default SEO;
