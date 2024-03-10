import Contact from "../../Shared/Contact/Contact";
import Footer from "../../Shared/Footer/Footer";
import MotionWrap from "../../Wrapper/MotionWrap";
import SEO from "../../utils/Seo.jsx";
import { useEffect } from 'react';

const ContactUs = () => {
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
      <div className="mt-16">
        <Contact />
        <Footer />
      </div>
    </>
  );
};
export default MotionWrap(ContactUs);
