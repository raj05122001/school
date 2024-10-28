import React from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  InputBase,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";
import { FaHeart, FaRegHeart, FaTimes, FaPaperPlane } from "react-icons/fa";
import { useThemeContext } from "@/hooks/ThemeContext";

const comments = [
  {
    id: 1,
    name: "Donald Rice",
    time: "5 min ago",
    text: "Christian spirit passion virtues suicide morality. Pinnacle moral pinnacle hope abstract right disgust joy.",
    likes: 24,
    liked: true,
  },
  {
    id: 2,
    name: "Victoria Alexander",
    time: "15 min ago",
    text: "War moral madness enlightenment aversion oneself. Inexpedient ascetic eternal-return dead suicide. Overcome society noble love.",
    likes: 13,
    liked: false,
  },
  {
    id: 3,
    name: "Elmer Roberts",
    time: "25 min ago",
    text: "Value salvation intentions overcome value merciful. Spirit god christian contradict.",
    likes: 4,
    liked: false,
  },
  {
    id: 4,
    name: "Leah Horton",
    time: "45 min ago",
    text: "Revaluation grandeur hope chaos christian grandeur convictions passion merciful pious.",
    likes: 17,
    liked: false,
  },
];

const CommentCard = ({ comment }) => (
  <Box display="flex" alignItems="flex-start" mb={2}>
    <Avatar
      src="/path-to-avatar.jpg"
      alt={comment.name}
      sx={{ width: 48, height: 48, mr: 2 }}
    />
    <Box>
      <Typography variant="body1" fontWeight="bold">
        {comment.name}
      </Typography>
      <Typography variant="caption" color="textSecondary">
        {comment.time}
      </Typography>
      <Typography variant="body2" mt={1}>
        {comment.text}
      </Typography>
      <Box display="flex" alignItems="center" mt={1}>
        <Typography
          variant="body2"
          color="primary"
          sx={{ mr: 1, cursor: "pointer" }}
        >
          Reply
        </Typography>
        <Typography
          variant="body2"
          color="primary"
          sx={{ mr: 1, cursor: "pointer" }}
        >
          Like?
        </Typography>
        <IconButton size="small" color="error">
          {comment.liked ? <FaHeart color="red" /> : <FaRegHeart />}
        </IconButton>
        <Typography variant="body2" ml={1}>
          {comment.likes}
        </Typography>
      </Box>
    </Box>
  </Box>
);

const CommentsSection = () => {
  const { isDarkMode, primaryColor, secondaryColor } = useThemeContext();
  return (
    <Card
      sx={{ maxWidth: 400, p: 2, boxShadow: 3 }}
      className="blur_effect_card"
    >
      <Box display="flex" alignItems="center" pb={1}>
        <Typography variant="h6" fontWeight="bold">
          Comments
        </Typography>
        <Box
          sx={{
            backgroundColor: "#FFEA00",
            width: 30,
            height: 30,
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
            color="black"
            sx={{ fontSize: "18px" }}
          >
            34
          </Typography>
        </Box>
        {/* <IconButton size="small">
              <FaTimes />
            </IconButton> */}
      </Box>

      <Divider />
      <CardContent sx={{ maxHeight: "400px", overflowY: "auto" }}>
        {comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </CardContent>
      <Divider />
      <Box display="flex" alignItems="center" p={1}>
        <InputBase placeholder="Type a comment..." fullWidth sx={{ ml: 1 }} />
        <IconButton color="primary" sx={{ ml: 1, backgroundColor: "#E0F7FA" }}>
          <FaPaperPlane color="#0288D1" />
        </IconButton>
      </Box>
    </Card>
  );
};

export default CommentsSection;
