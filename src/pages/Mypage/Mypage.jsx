// /pages/Mypage/Mypage.jsx
import { useState } from "react";
import MypageHeader from "./MypageHeader";
import MypageContent from "./MypageContent";
import MypageFooter from "./MypageFooter";
import ProfileBox from "./ProfileBox";
import MyPostsPage from "./history/MyPostsPage";
import CommunityTab from "./history/community/CommunityTab";
import MountainTab from "./history/mountain/MountainTab";
import RestaurantTab from "./history/restaurant/RestaurantTab";
import DefaultLayout from "../../layouts/DefaultLayout";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ContentContainer from "../../layouts/ContentContainer";
import "../../css/Mypage.css";
import { useNavigate } from "react-router-dom";

const Mypage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");

  return (
    <>
      <header className="header-container">
        <ContentContainer>
          <Header
            title="하이펜타"
            showBack={true}
            showIcons={{ search: true }}
            menuItems={[
              { label: "커뮤니티", onClick: () => navigate("/communities") },
              {
                label: "등산 후기",
                onClick: () => navigate("/hiking-reviews"),
              },
              {
                label: "맛집 후기",
                onClick: () => navigate("/restaurant-reviews"),
              },
              { label: "모임", onClick: () => navigate("/clubs") },
            ]}
          />
        </ContentContainer>
      </header>

      <DefaultLayout>
        <div className="mypage-layout">
          <aside className="mypage-sidebar">
            <div className="sidebar-profile">
              <MypageHeader />
            </div>
            <div className="sidebar-menu">
              <MypageContent setActiveTab={setActiveTab} />
            </div>
            <div className="sidebar-footer">
              <MypageFooter />
            </div>
          </aside>

          <main className="mypage-main-content">
            {activeTab === "home" && <ProfileBox />}
            {activeTab === "community" && <CommunityTab />}
            {activeTab === "mountain" && <MountainTab />}
            {activeTab === "restaurant" && <RestaurantTab />}
          </main>
        </div>
      </DefaultLayout>
    </>
  );
};

export default Mypage;
