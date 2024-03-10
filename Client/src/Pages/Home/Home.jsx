import OurServices from "../../Components/HomeComponents/OurServices";
import Header from "../../Components/HomeComponents/Header/Header";
import Companies from "../../Components/HomeComponents/companies/Companies";
import Customer from "../../Components/HomeComponents/customer/customer";
import Footer from "../../Shared/Footer/Footer";
import OurLatestProjects from "../../Components/HomeComponents/latestprojects/OurLatestProjects.jsx";
import OurClients from "../../Components/HomeComponents/ourClients/OurClients.jsx";
import AboutUs from "../../Components/HomeComponents/aboutUs/AboutUs.jsx";
import Contact from "../../Shared/Contact/Contact";
import Our_Portfolio from "./../../Components/HomeComponents/Our-Portfolio/Our_Portfolio";
import { useEffect } from "react";
import SEO from "../../utils/Seo.jsx";

function Home() {
  const {
    VITE_HOME_TITLE,
    VITE_HOME_DESCRIPTION,
    VITE_HOME_OG_TITLE,
    VITE_HOME_OG_DESCRIPTION,
    VITE_HOME_OG_TYPE,
    VITE_HOME_OG_IMAGE,
    VITE_HOME_OG_URL,
    VITE_HOME_SITE_NAME,
  } = import.meta.env;
  useEffect(() => {
    const topOfPage = document.documentElement;
    topOfPage.scrollIntoView({ behavior: "smooth" });
  }, []);
  return (
    <>
      <SEO
        title={VITE_HOME_TITLE}
        description={VITE_HOME_DESCRIPTION}
        ogTitle={VITE_HOME_OG_TITLE}
        ogDescription={VITE_HOME_OG_DESCRIPTION}
        ogType={VITE_HOME_OG_TYPE}
        ogImage={VITE_HOME_OG_IMAGE}
        ogUrl={VITE_HOME_OG_URL}
        siteName={VITE_HOME_SITE_NAME}
      />
      <Header />
      <div className="relative z-[1] bg-white pb-0 overflow-hidden">
        <OurServices />
        <div
          style={{
            background: "linear-gradient(to bottom, #ffffff, #e9f2f9)",
          }}
        >
          <OurLatestProjects />
        </div>
        <OurClients />
        <div
          style={{
            background: "linear-gradient(to bottom, #ffffff, #e9f2f9)",
          }}
        >
          <AboutUs />
        </div>
        <Our_Portfolio />
        <Customer />
        <Companies />
        <Contact />
      </div>
      <Footer />
    </>
  );
}

export default Home;
