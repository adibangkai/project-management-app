import { getUserFromCookie } from "@/lib/auth";
import { db } from "@/lib/db";
import { TASK_STATUS } from "@prisma/client";
import { cookies } from "next/headers";
import { formatDate } from "@/lib/async";
import Card from "./Card";
import NewTask from "./NewTask";
import { cva, VariantProps } from "class-variance-authority";

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
    "hover:opacity-70",
    "drop-shadow-md",
    "cursor-pointer",
    "border-b-4",
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

  return (
    <Card className={"min-h-screen "}>
      <div className="flex justify-between items-center">
        <div>
          <span className="text-3xl text-gray-600">{title}</span>
        </div>
        <div>
          <NewTask id={id} />
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
                    <span className="text-gray-800">{task.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-800">
                      {formatDate(task.createdAt)}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-400 text-sm">
                      {task.description}
                    </span>
                  </div>
                  <div className="text-right grid">
                    {task.due && (
                      <span className="text-gray-800">
                        {formatDate(task.due)}
                      </span>
                    )}
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
export default TaskCard;
