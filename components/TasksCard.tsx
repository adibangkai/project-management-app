import { getUserFromCookie } from "@/lib/auth";
import { db } from "@/lib/db";
import { TASK_STATUS } from "@prisma/client";
import { cookies } from "next/headers";
import { formatDate, dateDay } from "@/lib/async";
import Card from "./Card";
import UpdateTask from "./UpdateTask";
import NewTask from "./NewTask";
import { cva, VariantProps } from "class-variance-authority";
import {
  Calendar,
  ArrowRight,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "react-feather";

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

const TaskCard = async ({ tasks, title, id, intent, className }) => {
  const data = tasks || (await getData());
  const completed = data.filter((task) => task.status === "COMPLETED");
  const started = data.filter((task) => task.status === "STARTED");
  const not_started = data.filter((task) => task.status === "NOT_STARTED");
  return (
    <Card className={"min-h-screen"}>
      <div className="flex justify-between items-center">
        <div>
          <span className="text-3xl text-gray-600">
            {title ? title : "Latest Task"}
          </span>
        </div>
        <div>
          <NewTask id={id} />
        </div>
      </div>
      <div className="flex gap-8 justify-between">
        <div>
          <div className="flex gap-2 items-center">
            <XCircle size={18} className={"stroke-rose-400 "} />
            <p className="text-bold text-lg">Not Started</p>
          </div>
          {not_started && not_started.length ? (
            <>
              {not_started.map((task) => (
                <Card
                  key={task.id}
                  className={taskClasses({ intent: task.status, className })}
                >
                  <div className="py-2 ">
                    <div className="flex gap-2 justify-between">
                      <span className="text-gray-800 text-xl font-bold">
                        {task.name}
                      </span>
                      <UpdateTask task={task} />
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
            </>
          ) : (
            <div className="mt-10 text-gray-400 text-2xl">no tasks</div>
          )}
        </div>
        <div>
          <div className="flex gap-2 items-center">
            <RefreshCw size={18} className={"stroke-sky-400 "} />
            <p className="text-bold text-lg">Started</p>
          </div>
          {started && started.length ? (
            <>
              {started.map((task) => (
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
            </>
          ) : (
            <div className="mt-10 text-gray-400 text-2xl">no tasks</div>
          )}
        </div>
        <div>
          <div className="flex gap-2 items-center">
            <CheckCircle size={18} className={"stroke-teal-400 "} />
            <p className="text-bold text-lg">Completed</p>
          </div>
          {completed && completed.length ? (
            <>
              {completed.map((task) => (
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
            </>
          ) : (
            <div className="mt-10 text-gray-400 text-2xl">no tasks</div>
          )}
        </div>
      </div>
    </Card>
  );
};
export default TaskCard;
