import Greetings from "@/components/Greetings";
import GreetingsSkeleton from "@/components/GreetingSkeletons";
import { delay } from "@/lib/async";
import { getUserFromCookie } from "@/lib/auth";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";
import ProjectCard from "@/components/ProjectCard";
import TaskCard from "@/components/TasksCard";
import NewProject from "@/components/NewProject";

const getData = async () => {
  await delay(500);
  const user = await getUserFromCookie(cookies());

  const projects = await db.project.findMany({
    where: {
      ownerId: user?.id,
    },
    include: {
      tasks: true,
    },
  });
  return { projects };
};

export default async function Page() {
  const { projects } = await getData();

  return (
    <div className="h-full overflow-y-auto pr-6 w-full ml-4">
      <div className=" h-full  items-stretch justify-center min-h-[content]">
        <div className="flex-1 grow flex">
          <Suspense fallback={<GreetingsSkeleton />}>
            <Greetings />
          </Suspense>{" "}
        </div>
        <div className="flex flex-2 grow items-center flex-wrap mt-3 -m-3 ">
          {
            /** projects map here */
            projects.map((project) => (
              <div className="w-1/3 p-3" key={project.id}>
                <Link href={`/project/${project.id}`}>
                  <ProjectCard project={project} />
                </Link>
              </div>
            ))
          }

          <div className="w-1/3 p-3">{<NewProject />}</div>
        </div>
        <div className="mt-6 flex-2 grow w-full flex">
          <div className="w-full">{<TaskCard />}</div>
        </div>
      </div>
    </div>
  );
}
