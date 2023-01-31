import { getUserFromCookie } from "@/lib/auth";
import { db } from "@/lib/db";
import { TASK_STATUS } from "@prisma/client";
import { cookies } from "next/headers";
import Button from "./Button";
import Card from "./Card";
import NewTask from "./NewTask";

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

const TaskCard = async ({ tasks, title, id }) => {
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
                className="my-4 rounded-md hover:opacity-70 drop-shadow-md cursor-pointer"
              >
                <div className="py-2 ">
                  <div>
                    <span className="text-gray-800">{task.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">
                      {task.description}
                    </span>
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
