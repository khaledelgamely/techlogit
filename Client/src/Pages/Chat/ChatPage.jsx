import Chat from "../../Components/ChatComponents/Chat";
import SEO from "../../utils/Seo.jsx";
import Footer from "./../../Shared/Footer/Footer";

function ChatPage() {
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
      <div className="">
        <Chat />
      </div>
    </>
  );
}

export default ChatPage;
