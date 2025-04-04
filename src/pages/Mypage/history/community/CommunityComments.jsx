import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";

const CommunityComments = () => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true); // 로딩 표시
  const [error, setError] = useState(null); // 에러 처리

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(
          `http://localhost:8088/api/communities/comments/my/${user.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // 세션 유지용
          }
        );

        if (!res.ok) throw new Error("댓글 불러오기 실패");

        const data = await res.json();
        console.log("받은 데이터", data);
        setComments(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchComments();
    }
  }, [user]);

  if (loading) return <p>불러오는 중...</p>;
  if (error) return <p>에러: {error}</p>;

  return (
    <div>
      <h4>내가 쓴 커뮤니티 댓글</h4>
      {comments.length === 0 ? (
        <p>작성한 댓글이 없습니다.</p>
      ) : (
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              <Link to={`/communities/${comment.communities_id}`}>
                <p>{comment.content}</p>
                <span className="post-meta">
                  {comment.update_date.slice(0, 16)}
                </span>
                <span className="post-title">{comment.communityTitle}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CommunityComments;
