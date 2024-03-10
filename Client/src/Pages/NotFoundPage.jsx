import { images } from "../constants";
import SEO from "../utils/Seo.jsx";
export default function NotFoundPage() {
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
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h1 style={{ fontSize: "3rem" }}>404 Not Found</h1>
        <p style={{ fontSize: "1.5rem" }}>
          The page you are looking for does not exist.
        </p>
        <img
          src={images.ntfPage}
          alt="404 Not Found"
          style={{
            width: "300px",
            height: "auto",
            marginTop: "100px",
            margin: "auto",
          }}
        />
      </div>
    </>
  );
}
