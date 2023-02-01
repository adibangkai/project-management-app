import { getUserFromCookie } from "@/lib/auth";
import { db } from "@/lib/db";
import { TASK_STATUS } from "@prisma/client";
import { cookies } from "next/headers";
import { formatDate, dateDay } from "@/lib/async";
import Card from "./Card";
import NewTask from "./NewTask";
import { cva, VariantProps } from "class-variance-authority";
import { Calendar, ArrowRight } from "react-feather";

const getData = async () => {
  const user = await getUserFromCookie(cookies());
  const tasks = await db.task.findMany({
    where: {
      ownerId: user.id,
      NOT: {
        status: TASK_STATUS.COMPLETED,
        deleted: false,
      },
    },
    take: 5,
    orderBy: {
      due: "asc",
    },
  });
  return tasks;
};

const taskClasses = cva(
  [
    "my-4",
    "rounded-md",
    "drop-shadow-md",
    "cursor-pointer",
    "border-b-4",
    "hover:opacity-80",
  ],
  {
    variants: {
      intent: {
        STARTED: ["border-sky-400", "text-sky-500"],
        NOT_STARTED: ["border-rose-400", "text-rose-500"],
        COMPLETED: ["border-teal-400", "text-teal-600"],
      },
    },
    defaultVariants: {
      intent: "NOT_STARTED",
    },
  }
);

export interface TaskProps extends VariantProps<typeof taskClasses> {}

const LatestTask = async ({ tasks, title, id, intent, className }) => {
  const data = await getData();

  return (
    <Card className={"min-h-screen"}>
      <div className="flex justify-between items-center">
        <div>
          <span className="text-3xl text-gray-600">Latest Task</span>
        </div>
      </div>
      <div>
        {data && data.length ? (
          <div>
            {data.map((task) => (
              <Card
                key={task.id}
                className={taskClasses({ intent: task.status, className })}
              >
                <div className="py-2 ">
                  <div>
                    <span className="text-gray-800 text-xl font-bold">
                      {task.name}
                    </span>
                  </div>
                  <div>
                    <div className="text-gray-400 flex gap-2 items-center">
                      <Calendar
                        size={16}
                        className={
                          " stroke-gray-400 hover:stroke-violet-600 transition duration-200 ease-in-out"
                        }
                      />
                      {dateDay(task.createdAt)}
                      {task.due && (
                        <>
                          <ArrowRight
                            size={16}
                            className={
                              "stroke-gray-400 hover:stroke-violet-600 transition duration-200 ease-in-out"
                            }
                          />{" "}
                          {dateDay(task.due)}
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">
                      {task.description}
                    </span>
                  </div>
                  <div className="text-right grid">
                    <span className="font-bold">{task.status}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div>no tasks</div>
        )}
      </div>
    </Card>
  );
};
export default LatestTask;
