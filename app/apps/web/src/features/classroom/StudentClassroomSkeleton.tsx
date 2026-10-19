import { Button } from "../../ui/Button.tsx";
import { Icon } from "../../ui/Icon.tsx";
import { SkeletonOf } from "../../ui/SkeletonOf.tsx";
import { DownloadButton } from "../materials/DownloadButton.tsx";
import { materialExamples } from "../materials/material-examples.ts";
import { MaterialList } from "../materials/MaterialList.tsx";
import { AppHeader } from "../me/AppHeader.tsx";
import { BackButton } from "../me/BackButton.tsx";
import { pollExamples } from "../polls/poll-examples.ts";
import { PollCard } from "../polls/PollCard.tsx";
import { pollMeta } from "../polls/poll-meta.ts";
import { VoteForm } from "../polls/VoteForm.tsx";
import { questionExamples } from "../questions/question-examples.ts";
import { QuestionList } from "../questions/QuestionList.tsx";
import { VoteCount } from "../questions/VoteCount.tsx";
import { sessionExamples } from "../sessions/session-examples.ts";
import { ClassroomLayout } from "./ClassroomLayout.tsx";
import { ClassroomPanel } from "./ClassroomPanel.tsx";
import { SlideStage } from "./SlideStage.tsx";

// The student's classroom while the web does not know the session yet. Its
// parts take no session, so it asks the API for nothing; the whole panel is
// skeleton, its tabs included.
export const StudentClassroomSkeleton = () => (
  <ClassroomLayout
    header={
      <AppHeader
        leading={<BackButton to="/" label="Volver a las sesiones" />}
        title={
          <SkeletonOf>
            <span>{sessionExamples[0].title}</span>
          </SkeletonOf>
        }
      />
    }
    stage={
      <SkeletonOf>
        <SlideStage
          html={null}
          position={{ slide: 1, step: 1 }}
          controls={
            <>
              <span className="ml-auto" />
              <Button variant="pill">
                <Icon name="hand" size={18} />
                <span className="max-[600px]:hidden">Levantar la mano</span>
              </Button>
            </>
          }
        />
      </SkeletonOf>
    }
    panel={
      <SkeletonOf>
        <ClassroomPanel
          people={undefined}
          meId={undefined}
          hideable
          renderHand={() => null}
          tabs={[
            {
              id: "polls",
              label: "Encuestas",
              icon: "chart-bar",
              content: (
                <PollCard
                  poll={pollExamples[0]}
                  meta={pollMeta(pollExamples[0])}
                  showResults={false}
                  body={<VoteForm poll={pollExamples[0]} />}
                />
              ),
            },
            {
              id: "questions",
              label: "Preguntas",
              icon: "chat-messages",
              content: (
                <QuestionList
                  questions={questionExamples}
                  renderVotes={(question) => <VoteCount question={question} />}
                  renderActions={() => null}
                />
              ),
            },
            {
              id: "material",
              label: "Material",
              icon: "download",
              content: (
                <MaterialList
                  materials={materialExamples}
                  renderActions={(material) => <DownloadButton material={material} />}
                />
              ),
            },
          ]}
        />
      </SkeletonOf>
    }
  />
);
