import { SkeletonOf } from "../../ui/SkeletonOf.tsx";
import { meExample } from "./me-example.ts";
import { useMe } from "./useMe.ts";

export const Greeting = () => {
  const me = useMe();

  return (
    <>
      Hola,{" "}
      {me.data == null ? (
        <SkeletonOf>
          <span className="skeleton-block">{meExample.name}</span>
        </SkeletonOf>
      ) : (
        me.data.name
      )}
    </>
  );
};
