import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { AnimatePresence } from "motion/react";
import type { Collaborator } from "@/interfaces/initiative";
import CurrentTeamMemberCard from "./CurrentTeamMemberCard";

interface HorizontalTeamListProps {
  members: Collaborator[];
  onMemberClick: (id: number) => void;
}

const HorizontalTeamList = ({ members, onMemberClick }: HorizontalTeamListProps) => {
  if (!members || members.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", fontStyle: "italic" }}>
        No hay miembros en el equipo actual.
      </Typography>
    );
  }
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        overflowX: "auto",
        p: 1.5,
        "&::-webkit-scrollbar": { height: 8 },
        "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
        "&::-webkit-scrollbar-thumb": { bgcolor: "grey.300", borderRadius: 3 },
      }}
    >
      <AnimatePresence>
        {members.map((member) => (
          <CurrentTeamMemberCard key={member.id} member={member} onClick={() => onMemberClick(member.id)} />
        ))}
      </AnimatePresence>
    </Box>
  );
};

export default HorizontalTeamList;

