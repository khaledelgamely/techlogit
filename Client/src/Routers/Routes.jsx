import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import NestedProductRoute from "../Components/HomeComponents/productDescription/NestedProductRoute";
import NestedDescComponent from "../Components/HomeComponents/productDescription/NestedDescComponent";
import NestedOldWorkComp from "../Components/HomeComponents/productDescription/NestedOldWorkComp";
import ProductDescription from "../Components/HomeComponents/productDescription/ProductDescription";

const Home = lazy(() => import("../Pages/Home/Home"));
const OurProjects = lazy(() => import("../Pages/OurLProject/OurProjects"));
const ContactUs = lazy(() => import("../Pages/Contact Us/ContactUs"));
const ThankYou = lazy(() => import("../Components/thankYou/ThankYou"));
const OrderRecieved = lazy(() => import("../Components/OrderRecieved/index"));
const Services = lazy(() => import("../Pages/Services/Services"));
const NestedRouteComp = lazy(() =>
  import("../Components/purshaseServices/NestedRouteComp")
);
const HowItWork = lazy(() => import("../Pages/HowItWork/HowItWork"));
const OrderPage = lazy(() => import("../Pages/order page/OrderPage"));
const OrderDetails = lazy(() =>
  import("../Pages/order details page/OrderPage")
);
const ChatPage = lazy(() => import("../Pages/Chat/ChatPage"));

const PaymentPage = lazy(() => import("../Pages/Payment/PaymentPage"));
const ForgetPassword = lazy(() =>
  import("../Pages/forget_password/ForgetPassword")
);
const ChangePassword = lazy(() =>
  import("../Pages/Change_password/ChangePassword")
);
const ChangePasswordWithCode = lazy(() =>
  import("../Pages/Change_password/ChangePasswordWithcode")
);
const UserGuard = lazy(() => import("../Gurd/UserGurd"));
const Profile = lazy(() => import("../Pages/profile/Profile"));
const OrderTracker = lazy(() =>
  import("../Components/orderTracker/OrderTracker")
);
const SignIn = lazy(() => import("../Pages/signIn/signIn"));
const SignUp = lazy(() => import("../Pages/signUp/signUp"));
const NotFoundPage = lazy(() => import("../Pages/NotFoundPage"));

import React from "react";
import { IsAuthenticated } from "../utils/isAuthenticated.jsx";
export default function AppRoutes() {
  return (
    <Suspense>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/OurProjects" element={<OurProjects />} />
        <Route path="/ContactUs" element={<ContactUs />} />
        <Route path="/thank_you/:id" element={<ThankYou />} />
        <Route path="/orderRecieved/:id" element={<OrderRecieved />} />
        <Route path="/services" element={<Services />}>
          <Route index element={<NestedRouteComp />} />
          <Route path=":id" element={<NestedRouteComp />} />
        </Route>
        <Route
          path="/product-description"
          element={
            <>
              <ProductDescription />
              <NestedProductRoute />
            </>
          }
        >
          <Route index element={<NestedDescComponent />} />
          <Route path=":id" element={<NestedDescComponent />} />
          <Route
            path="/product-description/oldWork/:id"
            element={<NestedOldWorkComp />}
          />
        </Route>

        <Route
          path="signUp"
          element={
            <IsAuthenticated>
              <SignUp />
            </IsAuthenticated>
          }
        />
        <Route path="how-it-work" element={<HowItWork />} />
        <Route path="profile" element={<Profile />} />
        <Route
          path="chat"
          element={
            <UserGuard>
              <ChatPage />
            </UserGuard>
          }
        />
        <Route
          path="signIn"
          element={
            <IsAuthenticated>
              <SignIn />
            </IsAuthenticated>
          }
        />
        <Route path="*" element={<NotFoundPage />} />

        <Route
          path="orders"
          element={
            <UserGuard>
              <OrderPage />
            </UserGuard>
          }
        />
        <Route
          path="order/:id"
          element={
            <UserGuard>
              <OrderDetails />
            </UserGuard>
          }
        />
        <Route
          path="track_order/:id"
          element={
            <UserGuard>
              <OrderTracker />
            </UserGuard>
          }
        />
        <Route
          path="payment/:id"
          element={
            <UserGuard>
              <PaymentPage />
            </UserGuard>
          }
        />
        <Route path="forget_password" element={<ForgetPassword />} />
        <Route path="forget_password/:email" element={<ChangePassword />} />
        <Route
          path="forget_password/:email/:code"
          element={<ChangePasswordWithCode />}
        />
      </Routes>
    </Suspense>
  );
}
