import { useEffect } from "react";
import OurLatestProjects from "../../Components/HomeComponents/latestprojects/OurLatestProjects";
import Footer from "../../Shared/Footer/Footer";
import SEO from "../../utils/Seo.jsx";

export default function OurProjects() {
  useEffect(() => {
    const topOfPage = document.documentElement;
    topOfPage.scrollIntoView({ behavior: "smooth" });
  }, []);
  return (
    <>
      <SEO
        title="My Page Title"
        description="Description of My Page"
        ogTitle="My Page Title for Sharing"
        ogDescription="My Page Description for Sharing"
        ogType="website"
        ogImage="URL to My Page Image"
        ogUrl="URL of My Page"
        siteName="My Site Name"
      />
      <OurLatestProjects />
      <Footer />
    </>
  );
}
