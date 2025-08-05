import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { AnimatePresence } from "motion/react";
import type { Profile } from "@/interfaces/profile";

interface HorizontalProfileListProps {
  profiles: Profile[];
  onEdit?: (profile: Profile) => void;
  onDelete?: (profileId: string) => void;
  CardComponent: React.ElementType;
  disabled?: boolean;
}

export const HorizontalProfileList = ({
  profiles,
  onEdit,
  onDelete,
  CardComponent,
  disabled = false,
}: HorizontalProfileListProps) => {
  if (profiles.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
        No hay perfiles en esta sección.
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        gap: 3,
        overflowX: "auto",
        py: 2,
        px: 2,
        "&::-webkit-scrollbar": {
          height: 8,
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "rgba(0,0,0,0.1)",
          borderRadius: 4,
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "primary.main",
          borderRadius: 4,
          "&:hover": {
            backgroundColor: "primary.dark",
          },
        },
      }}
    >
      <AnimatePresence>
        {profiles.map((profile) => (
          <CardComponent key={profile.id} profile={profile} onEdit={onEdit} onDelete={onDelete} disabled={disabled} />
        ))}
      </AnimatePresence>
    </Box>
  );
};


