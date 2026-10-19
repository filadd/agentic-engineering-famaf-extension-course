import type { Session } from "@kurasu/contract/sessions";
import type { Position } from "@kurasu/slides/messages";
import { samePosition } from "@kurasu/slides/navigation";
import { useState } from "react";

import { SkeletonOf } from "../../ui/SkeletonOf.tsx";
import { HandButton } from "../hands/HandButton.tsx";
import { useMaterials } from "../materials/useMaterials.ts";
import { useSlidesMaterial } from "../materials/useSlidesMaterial.ts";
import { FollowTeacherToggle } from "./FollowTeacherToggle.tsx";
import { SlideStage } from "./SlideStage.tsx";

interface Props {
  session: Session;
  teacherPresent: boolean;
}

interface Own {
  slidesId: string;
  position: Position;
}

// The student follows the teacher from the start; navigating by hand stops
// following, and reaching the teacher's position follows again. Without the
// teacher, the student moves alone from the saved position.
export const StudentSlides = ({ session, teacherPresent }: Props) => {
  const materials = useMaterials(session.id);
  const slides = useSlidesMaterial(materials.data);

  const [following, setFollowing] = useState(true);
  const [own, setOwn] = useState<Own | null>(null);

  const teacherPosition = { slide: session.currentSlide, step: session.currentStep };
  const ownPosition = own != null && own.slidesId === slides?.id ? own.position : teacherPosition;
  const position = teacherPresent && following ? teacherPosition : ownPosition;

  const controls = (
    <>
      {teacherPresent ? (
        <FollowTeacherToggle
          following={following}
          onToggle={() => {
            setOwn({ slidesId: slides?.id ?? "", position });
            setFollowing(!following);
          }}
        />
      ) : (
        <span className="ml-auto" />
      )}
      <HandButton sessionId={session.id} />
    </>
  );

  return materials.data == null || (slides != null && slides.html == null) ? (
    <SkeletonOf>
      <SlideStage html={null} position={position} controls={controls} />
    </SkeletonOf>
  ) : (
    <SlideStage
      html={slides?.html ?? null}
      position={position}
      onNavigate={(next) => {
        setOwn({ slidesId: slides?.id ?? "", position: next });
        setFollowing(samePosition(next, teacherPosition));
      }}
      controls={controls}
    />
  );
};
