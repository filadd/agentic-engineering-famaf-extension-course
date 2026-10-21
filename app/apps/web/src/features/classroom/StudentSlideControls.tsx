import type { ReactNode } from "react";

import { FollowTeacherToggle } from "./FollowTeacherToggle.tsx";

interface Props {
  teacherPresent: boolean;
  following: boolean;
  onToggle: () => void;
  hand: ReactNode;
}

// The student's controls right of the slide's position. Following the teacher
// only makes sense while the teacher is in the classroom.
export const StudentSlideControls = ({ teacherPresent, following, onToggle, hand }: Props) => (
  <>
    {teacherPresent ? (
      <FollowTeacherToggle following={following} onToggle={onToggle} />
    ) : (
      <span className="ml-auto" />
    )}
    {hand}
  </>
);
