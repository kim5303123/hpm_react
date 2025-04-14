import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ContentContainer from "../../layouts/ContentContainer";
import { MdArrowUpward } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import Header from "../../layouts/Header/Header";
import DefaultLayout from "../../layouts/DefaultLayout";
import RestaurantReviewCard from "./RestaurantReviewCard";
import "../../styles/pages/restaurantReview.css";
import StickyButton from "../../Components/Map/StickyButton";

const RestaurantReviewList = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const API_URL = `${BASE_URL}/api/restaurant-reviews`;

  // 산 전체목록에서 특정산 이동시 검색어 별도관리를 위한 코드 ( 잠시 주석처리 )
  const location = useLocation(); // 라우터 location 정보 가져오기
  const [searchQuery, setSearchQuery] = useState(
    location.state?.mountainName || "" // 초기값에 산 이름 자동 설정
  );

  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState([]); //  login 부분
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부

  const navigate = useNavigate();

  // 로그인 상태 확인 함수
  const checkLoginStatus = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/users/session`, {
        method: "GET",
        credentials: "include", // 쿠키를 포함하여 요청
      });

      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        setUser(data); // 로그인된 사용자 정보 저장
        console.log(data);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("로그인 상태 확인 중 오류 발생:", error);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkLoginStatus(); // 컴포넌트가 마운트될 때 로그인 상태 확인
  }, []);

  // 게시글 불러오기
  const fetchPosts = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      const postData = Object.values(data).map((rReview) => ({
        id: rReview.id,
        name: rReview.name,
        nickname: rReview.nickname,
        location: rReview.location,
        mountainName: rReview.mountain_name,
        rate: rReview.rate,
        content: rReview.content,
        updateDate: rReview.update_date,
        usersId: rReview.users_id,
        mountainsId: rReview.mountains_id,
        likes: rReview.likes,
        commentCount: rReview.comment_count,
      }));

      setPosts(postData); // 상태 업데이트
    } catch (error) {
      console.error("게시글 불러오기 실패:", error);
    }
  };

  // 컴포넌트 마운트 시 게시글 조회
  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCommentChange = () => {
    fetchPosts(); // 댓글 변경 시 전체 게시글 다시 불러오기
  };

  // 작성하기 버튼 클릭 시
  const goToPostCreate = () => {
    if (!isLoggedIn) {
      alert("로그인 후 사용 가능합니다");
      return;
    }
    navigate("/restaurant-reviews/new");
  };

  // 검색어로 필터링된 게시글
  const filteredPosts = posts.filter((post) =>
    post.mountainName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <header className="header-container">
        <ContentContainer>
          <Header
            title="하이펜타"
            showBack={false}
            showLogo={true}
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
      <br />

      <DefaultLayout>
        <div className="rReview-feed-page">
          {/* 검색창 */}
          <div className="rReview-search-form">
            <div className="rReview-search-wrapper">
              <input
                type="text"
                placeholder="산 이름으로 게시물 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rReview-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="rReview-search-clear-button"
                >
                  ✕
                </button>
              )}
              <button type="button" className="rReview-search-icon-button">
                <FiSearch />
              </button>
            </div>
          </div>

          {/* 게시글 리스트 */}
          <div className="rReview-post-list">
            {filteredPosts.length === 0 ? (
              <div className="no-posts-container">
                <img
                  src="/images/noPosts.png"
                  alt="게시물이 없습니다"
                  className="no-posts-image"
                />
              </div>
            ) : (
              filteredPosts.map((post) => (
                <RestaurantReviewCard
                  key={post.id}
                  post={post}
                  currentUser={user}
                  onCommentChange={handleCommentChange}
                />
              ))
            )}
          </div>
        </div>
      </DefaultLayout>
      <StickyButton
        className="no-style"
        showHome={true}
        showBack={true}
        showWrite={true}
        showMap={false}
        showList={false}
        showScrollTop={true}
        homePath="/"
        backPath="/previous"
        onWriteClick={goToPostCreate}
      />
    </>
  );
};

export default RestaurantReviewList;
