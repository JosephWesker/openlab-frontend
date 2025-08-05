import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { motion } from "motion/react";

interface CurrentTeamMemberCardProps {
  member: { id: number; name: string; profilePic: string };
  onClick: () => void;
}

const CurrentTeamMemberCard = ({ member, onClick }: CurrentTeamMemberCardProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    whileHover={{ y: -4 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <Paper
      elevation={2}
      onClick={onClick}
      sx={{
        p: 1,
        px: 2,
        borderRadius: "50px",
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        cursor: "pointer",
        transition: "all 0.2s ease",
        "&:hover": {
          boxShadow: 4,
          backgroundColor: "action.hover",
        },
      }}
    >
      <Avatar src={member.profilePic} sx={{ width: 40, height: 40 }} />
      <Typography variant="body2" fontWeight={600} noWrap>
        {member.name}
      </Typography>
    </Paper>
  </motion.div>
);

export default CurrentTeamMemberCard;

