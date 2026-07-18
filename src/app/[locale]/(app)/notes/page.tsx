import { NotesWorkspace } from "@/components/notes/notes-workspace";
import { Suspense } from "react";
export default function Page() {
  return (
    <Suspense>
      <NotesWorkspace />
    </Suspense>
  );
}
