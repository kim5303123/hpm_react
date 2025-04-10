import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ContentContainer from "../../layouts/ContentContainer";
import Header from "../../components/Header/Header";
import DefaultLayout from "../../layouts/DefaultLayout";
import "../../css/DefaultLayout.css";
import RestaurantReviewCard from "../restaurantReview/RestaurantReviewCard";
import "../../css/MountainReview.css";
import Footer from "../../components/Footer/Footer";

const RestaurantReviewList = () => {
  const API_URL = "http://localhost:8088/api/restaurant-reviews";

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
      const response = await fetch("http://localhost:8088/api/users/session", {
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
      alert("로그인이 필요합니다!");
      navigate("/login");
      return;
    }
    navigate("/restaurant-reviews/new");
  };

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 2000);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // const [searchQuery, setSearchQuery] = useState("");

  // 검색어로 필터링된 게시글
  const filteredPosts = posts.filter((post) =>
    post.mountainName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <ContentContainer>
        <Header title="하이펜타" showLogo={true} showIcons={{ search: true }} />
      </ContentContainer>

      <DefaultLayout>
        <div className="mReview-feed-page">
          <button
            onClick={goToPostCreate}
            className="create-mReview-post-button-fixed"
            data-text="작성하기"
          >
            <span>작성하기</span>
          </button>

          {/* 검색창 */}
          <div className="mReview-search-container">
            <input
              type="text"
              placeholder="산 이름으로 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mReview-search-input"
            />
          </div>
          {/* 게시글 리스트 */}
          <div className="mReview-post-list">
            {filteredPosts.length === 0 ? (
              <div className="no-posts-container">
                <img
                  src="/post-images/noPosts.png"
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

          {/* 상단 이동 버튼 */}
          {showScrollTop && (
            <button
              className="mReview-scroll-top-button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <MdArrowUpward />
            </button>
          )}
        </div>
      </DefaultLayout>
      <Footer />
    </div>
  );
};

export default RestaurantReviewList;
