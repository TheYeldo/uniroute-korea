import { Skeleton } from "@/components/ui/skeleton";
export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl space-y-5 px-4 py-10">
      <Skeleton className="h-10 w-80 max-w-full" />
      <Skeleton className="h-5 w-[32rem] max-w-full" />
      <div className="grid gap-5 pt-5 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton className="h-72 rounded-xl" key={index} />
        ))}
      </div>
    </div>
  );
}
