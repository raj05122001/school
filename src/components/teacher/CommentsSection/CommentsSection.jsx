import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  InputBase,
  Typography,
  Divider,
  IconButton,
  Button,
} from "@mui/material";
import { FaPaperPlane } from "react-icons/fa";
import { useThemeContext } from "@/hooks/ThemeContext";
import {
  getComments,
  updateLectureDiscussion,
  updateCommentReply,
} from "@/api/apiHelper";
import moment from "moment";
import { decodeToken } from "react-jwt";
import Cookies from "js-cookie";

const ReplyCard = ({ reply, isDarkMode, secondaryColor }) => (
  <Box
    display="flex"
    alignItems="flex-start"
    mb={2}
    // p={1}
    // sx={{
    //   backgroundColor: isDarkMode ? "#1F1F1F" : "#F9F9F9",
    //   borderRadius: "12px",
    //   boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    // }}
  >
    <Avatar
      src={reply.replied_by?.profile_pic || "/default-avatar.jpg"}
      alt={reply.replied_by?.full_name}
      sx={{ width: 36, height: 36, mr: 1.5 }}
    />
    <Box>
      <Typography
        variant="body2"
        fontWeight="bold"
        color={isDarkMode ? "white" : "black"}
      >
        {reply.replied_by?.full_name}
      </Typography>
      <Typography variant="caption" color={secondaryColor}>
        {moment(reply.replied_at).fromNow()}
      </Typography>
      <Typography variant="body2" mt={0.5} color={secondaryColor}>
        {reply.reply_text}
      </Typography>
    </Box>
  </Box>
);

const CommentCard = ({ comment, isDarkMode, secondaryColor }) => {
  const [isShowReplyComment, setIsShowReplyComment] = useState(false);
  const [showRepliesCount, setShowRepliesCount] = useState(3);

  const len = comment.replies?.length - showRepliesCount;
  return (
    <Box display="flex" alignItems="flex-start" mb={3}>
      <Avatar
        src={comment.made_by?.profile_pic || "/default-avatar.jpg"}
        alt={comment?.made_by?.full_name}
        sx={{ width: 48, height: 48, mr: 2 }}
      />
      <Box>
        <Typography
          variant="body1"
          fontWeight="bold"
          color={isDarkMode ? "white" : "black"}
        >
          {comment?.made_by?.full_name}
        </Typography>
        <Typography variant="caption" color={secondaryColor}>
          {moment(comment.created_at).fromNow()}
        </Typography>
        <Typography variant="body2" mt={1} color={secondaryColor}>
          {comment.comment}
        </Typography>
        <Box display="flex" alignItems="center" mt={1}>
          <Button variant="text" color="primary" size="small" sx={{ mr: 1 }}>
            Reply
          </Button>
          {comment.replies?.length > 0 && (
            <Button
              variant="text"
              color="primary"
              size="small"
              onClick={() => setIsShowReplyComment(!isShowReplyComment)}
            >
              {isShowReplyComment ? "Hide Replies" : "View Replies"}
            </Button>
          )}
        </Box>

        {isShowReplyComment && (
          <Box
            mt={2}
            sx={{
              // backgroundColor: isDarkMode ? "#2C2C2C" : "#FAFAFA",
              // borderRadius: "8px",
              // boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              p: 1.5,
            }}
          >
            {comment.replies?.slice(0, showRepliesCount).map((reply) => (
              <ReplyCard
                key={reply.id}
                reply={reply}
                isDarkMode={isDarkMode}
                secondaryColor={secondaryColor}
              />
            ))}

            {comment.replies?.length > showRepliesCount && (
              <Box display="flex" justifyContent="center" mt={1}>
                <Button
                  variant="text"
                  color="primary"
                  size="small"
                  onClick={() => setShowRepliesCount((prev) => prev + 5)}
                >
                  View {len} more replies
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

const CommentsSection = ({ id }) => {
  const { isDarkMode, primaryColor, secondaryColor } = useThemeContext();
  const [commentData, setCommentData] = useState([]);
  const userDetails = decodeToken(Cookies.get("ACCESS_TOKEN"));
  const [text, setText] = useState("");

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await getComments();
      setCommentData(response?.data);
      console.log("response", response);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitComment = async () => {
    let data = {
      comment: text,
      lecture: Number(id),
      made_by: userDetails?.user_id,
    };
    setText("");
    try {
      await updateLectureDiscussion(id, data);
      fetchComments();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitReply = async () => {
    let data = {
      lecture_discussion: commentId,
      replied_by: userDetails?.user_id,
      reply_text: text,
    };
    setText("");
    try {
      await updateCommentReply(data);
      fetchComments();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 450,
        p: 3,
        backdropFilter: "blur(20px)",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
        borderRadius: "24px",
      }}
    >
      <Box display="flex" alignItems="center" pb={2}>
        <Typography
          variant="h6"
          fontWeight="bold"
          color={isDarkMode ? "white" : "black"}
        >
          Comments
        </Typography>
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
            {commentData?.length || 0}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: isDarkMode ? "gray.600" : "gray.300" }} />
      <CardContent sx={{ maxHeight: "400px", overflowY: "auto" }}>
        {commentData?.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            isDarkMode={isDarkMode}
            secondaryColor={secondaryColor}
          />
        ))}
      </CardContent>
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
          onChange={(event) => setText(event?.target?.value)}
        />
        <IconButton
          color="primary"
          sx={{ ml: 1, backgroundColor: isDarkMode ? "#FFD700" : "#E3F2FD" }}
          onClick={() => {
            text && handleSubmitComment();
          }}
        >
          <FaPaperPlane color={isDarkMode ? "#000" : "#0288D1"} />
        </IconButton>
      </Box>
    </Card>
  );
};

export default CommentsSection;
