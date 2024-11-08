import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  InputBase,
  Typography,
  Divider,
  IconButton,
  Button,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import { FaPaperPlane } from "react-icons/fa";
import { useThemeContext } from "@/hooks/ThemeContext";
import {
  getComments,
  updateLectureDiscussion,
  updateCommentReply,
  getLectureDiscussion,
} from "@/api/apiHelper";
import { formatDistanceToNow } from "date-fns";
import { decodeToken } from "react-jwt";
import Cookies from "js-cookie";
import UserImage from "@/commonComponents/UserImage/UserImage";

// ReplyCard Component with Skeleton Loader
const ReplyCard = ({ reply, isDarkMode, secondaryColor, loading }) => {
  if (loading) {
    return (
      <Box display="flex" alignItems="flex-start" mb={2}>
        <Skeleton variant="circular" width={36} height={36} />
        <Box ml={1.5} flex={1}>
          <Skeleton width="50%" height={20} />
          <Skeleton width="30%" height={20} />
          <Skeleton width="80%" height={20} />
        </Box>
      </Box>
    );
  }

  const repliedBy = reply.replied_by || {};
  return (
    <Box display="flex" alignItems="flex-start" mb={2}>
      <Box sx={{ mr: 1.5 }}>
        <UserImage
          profilePic={repliedBy.profile_pic}
          name={repliedBy.full_name}
          width={36}
          height={36}
        />
      </Box>
      <Box>
        <Typography
          variant="body2"
          fontWeight="bold"
          color={isDarkMode ? "white" : "black"}
        >
          {repliedBy.full_name || "Anonymous"}
        </Typography>
        <Typography variant="caption" color={secondaryColor}>
          {formatDistanceToNow(new Date(reply.replied_at), { addSuffix: true })}
        </Typography>
        <Typography variant="body2" mt={0.5} color={secondaryColor}>
          {reply.reply_text}
        </Typography>
      </Box>
    </Box>
  );
};

// CommentCard Component with Skeleton Loader
const CommentCard = ({
  comment,
  isDarkMode,
  secondaryColor,
  handleSubmitReply,
  loading,
}) => {
  const [isShowReplyComment, setIsShowReplyComment] = useState(false);
  const [showRepliesCount, setShowRepliesCount] = useState(3);
  const [isReply, setIsReply] = useState(false);
  const [text, setText] = useState("");

  const replies = comment.replies || [];
  const remainingReplies = replies.length - showRepliesCount;

  const handleComment = () => {
    if (text.trim()) {
      handleSubmitReply(comment.id, text);
      setText("");
      setIsReply(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" alignItems="flex-start" mb={3}>
        <Skeleton variant="circular" width={48} height={48} />
        <Box ml={2} flex={1}>
          <Skeleton width="50%" height={20} />
          <Skeleton width="30%" height={20} />
          <Skeleton width="80%" height={20} />
          <Skeleton width="40%" height={20} />
        </Box>
      </Box>
    );
  }

  return (
    <Box display="flex" alignItems="flex-start" mb={3}>
      <Box sx={{ mr: 2 }}>
        <UserImage
          profilePic={comment.made_by?.profile_pic}
          name={comment.made_by?.full_name}
          width={48}
          height={48}
        />
      </Box>
      <Box flex={1}>
        <Typography
          variant="body1"
          fontWeight="bold"
          color={isDarkMode ? "white" : "black"}
        >
          {comment.made_by?.full_name || "Anonymous"}
        </Typography>
        <Typography variant="caption" color={secondaryColor}>
          {formatDistanceToNow(new Date(comment.created_at), {
            addSuffix: true,
          })}
        </Typography>
        <Typography variant="body2" mt={1} color={secondaryColor}>
          {comment.comment}
        </Typography>
        <Box display="flex" alignItems="center" mt={1}>
          <Button
            variant="text"
            color="primary"
            size="small"
            sx={{ mr: 1 }}
            onClick={() => setIsReply(!isReply)}
          >
            {isReply ? "Cancel" : "Reply"}
          </Button>
          {replies.length > 0 && (
            <Button
              variant="text"
              color="primary"
              size="small"
              onClick={() => setIsShowReplyComment(!isShowReplyComment)}
            >
              {isShowReplyComment
                ? "Hide Replies"
                : `View Replies (${replies.length})`}
            </Button>
          )}
        </Box>

        {isReply && (
          <Box display="flex" alignItems="center" pt={2}>
            <InputBase
              placeholder="Write a reply..."
              fullWidth
              sx={{
                ml: 1,
                color: isDarkMode ? "white" : "black",
                backgroundColor: isDarkMode ? "#3A3A3A" : "#FFFFFF",
                borderRadius: "24px",
                padding: "8px 16px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              }}
              value={text}
              onChange={(event) => setText(event.target.value)}
            />
            <IconButton
              color="primary"
              sx={{
                ml: 1,
                backgroundColor: isDarkMode ? "#FFD700" : "#E3F2FD",
              }}
              onClick={handleComment}
              aria-label="Send reply"
            >
              <FaPaperPlane color={isDarkMode ? "#000" : "#0288D1"} />
            </IconButton>
          </Box>
        )}

        {isShowReplyComment && (
          <Box mt={2} pl={1}>
            {replies.slice(0, showRepliesCount).map((reply) => (
              <ReplyCard
                key={reply.id}
                reply={reply}
                isDarkMode={isDarkMode}
                secondaryColor={secondaryColor}
                loading={loading}
              />
            ))}

            {remainingReplies > 0 && (
              <Box display="flex" justifyContent="center" mt={1}>
                <Button
                  variant="text"
                  color="primary"
                  size="small"
                  onClick={() => setShowRepliesCount((prev) => prev + 5)}
                >
                  View {remainingReplies} more{" "}
                  {remainingReplies > 1 ? "replies" : "reply"}
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

// CommentsSection Component with updated layout for divider and centered message
const CommentsSection = ({ id }) => {
  const { isDarkMode, primaryColor, secondaryColor } = useThemeContext();
  const [commentData, setCommentData] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const userDetails = decodeToken(Cookies.get("ACCESS_TOKEN"));

  useEffect(() => {
    setLoading(true);
    fetchComments();
  }, [id]);

  const fetchComments = async () => {
    try {
      const response = await getComments(id);
      setCommentData(response?.data || []);
    } catch (error) {
      console.error(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (text.trim()) {
      const data = {
        comment: text,
        lecture: Number(id),
        made_by: userDetails?.user_id,
      };
      try {
        await updateLectureDiscussion(id, data);
        setText("");
        fetchComments();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSubmitReply = async (commentId, textMessage) => {
    if (textMessage.trim()) {
      const data = {
        lecture_discussion: commentId,
        replied_by: userDetails?.user_id,
        reply_text: textMessage,
      };
      try {
        await updateCommentReply(data);
        fetchComments();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 450,
        height: "100%",
        minHeight: 450,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: 3,
        backdropFilter: "blur(20px)",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
        borderRadius: "24px",
      }}
    >
      <Box>
        <Box display="flex" alignItems="center" pb={2}>
          <Typography
            variant="h6"
            fontWeight="bold"
            color={isDarkMode ? "white" : "black"}
          >
            Comments
          </Typography>
          {commentData.length > 0 && (
            <Box
              sx={{
                backgroundColor: isDarkMode ? primaryColor : "#FFD700",
                width: 34,
                height: 34,
                marginLeft: 1,
                borderRadius: "50%",
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography
                variant="subtitle2"
                color={isDarkMode ? "black" : "white"}
                sx={{ fontSize: "18px" }}
              >
                {commentData.length}
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ borderColor: isDarkMode ? "gray.600" : "gray.300" }} />

        <CardContent sx={{ maxHeight: "400px", overflowY: "auto" }}>
          {loading ? (
            Array.from(new Array(3)).map((_, index) => (
              <CommentCard
                key={index}
                comment={{}}
                isDarkMode={isDarkMode}
                secondaryColor={secondaryColor}
                handleSubmitReply={handleSubmitReply}
                loading={loading}
              />
            ))
          ) : commentData.length > 0 ? (
            commentData.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                isDarkMode={isDarkMode}
                secondaryColor={secondaryColor}
                handleSubmitReply={handleSubmitReply}
                loading={false}
              />
            ))
          ) : (
            <Typography
              variant="body2"
              color={secondaryColor}
              textAlign="center"
              my={14}
            >
              No comments yet. Be the first to comment!
            </Typography>
          )}
        </CardContent>
      </Box>

      <Box mt="auto" pt={2}>
        <Divider sx={{ borderColor: isDarkMode ? "gray.600" : "gray.300" }} />

        <Box display="flex" alignItems="center" pt={2}>
          <InputBase
            placeholder="Write a comment..."
            fullWidth
            sx={{
              ml: 1,
              color: isDarkMode ? "white" : "black",
              backgroundColor: isDarkMode ? "#3A3A3A" : "#FFFFFF",
              borderRadius: "24px",
              padding: "8px 16px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            }}
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
          <IconButton
            color="primary"
            sx={{
              ml: 1,
              backgroundColor: isDarkMode ? "#FFD700" : "#E3F2FD",
            }}
            onClick={handleSubmitComment}
            aria-label="Send comment"
          >
            <FaPaperPlane color={isDarkMode ? "#000" : "#0288D1"} />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
};

export default CommentsSection;
