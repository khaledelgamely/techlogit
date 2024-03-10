import OurServicePurchase from "../../Components/purshaseServices/OurServicePurchase.jsx";
import NavBar from "../../Shared/NavBar/NavBar.jsx";
import Footer from "../../Shared/Footer/Footer.jsx";
import Contact from "./../../Shared/Contact/Contact";
import { useDispatch, useSelector } from "react-redux";
import {
  addFirstServices,
  fetchCategories,
  fetchServices,
} from "../../store/Slices/servicesSlice.jsx";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../Shared/Loader/Loader.jsx";
import SEO from "../../utils/Seo.jsx";

function Services() {
  const categories = useSelector((state) => state.services.categories);
  const dispatch = useDispatch();
  // const [firstCategoryId, setFirstCategoryId] = useState();
  // const [fetchedService, setFetchedService] = useState(null);
  // const { id } = useParams();

  useEffect(() => {
    dispatch(fetchCategories())
      // .then((res) => setFirstCategoryId(res.payload[0]?._id))
      // .catch((err) => console.log(err + "aaaaaaaaaaaaaaa"));
  }, []);

  // useEffect(() => {
  //   if (id !== undefined) {
  //     dispatch(fetchServices(id)).then((res) => setFetchedService(res.payload));
  //   } else {
  //     if (firstCategoryId) {
  //       dispatch(fetchServices(firstCategoryId)).then((res) => {
  //         addFirstServices(res.payload);
  //       });
  //     }
  //   }
  // }, [firstCategoryId]);

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
      <NavBar />
      <div className="relative z-[1] pt-10">
        {!categories ? (
          <Loader />
        ) : (
          <>
            {<OurServicePurchase categories={categories} />}
            <Contact />
            <Footer />
          </>
        )}
      </div>
    </>
  );
}

export default Services;
