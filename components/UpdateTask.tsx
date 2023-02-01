"use client";
import { createNewTask } from "@/lib/api";
import { useState, useTransition } from "react";
import Modal from "react-modal";
import Button from "./Button";
import Input from "./Input";
import { useRouter } from "next/navigation";
import { Edit } from "react-feather";

Modal.setAppElement("#modal");

const initial = {
  name: "",
  createdAt: "",
  due: "",
  description: "",
  duePicker: "",
  createPicker: "",
};

const UpdateTask = ({ task }) => {
  const router = useRouter();
  const [modalIsOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const [formState, setFormState] = useState({
    ...task,
    createPicker: task.createdAt,
  });
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formState);
    closeModal();
    setFormState(initial);

    startTransition(() => {
      // Refresh the current route and fetch new data from the server without
      // losing client-side browser or React state.
      router.refresh();
    });
  };

  const dateToString = (val) => {
    const event = new Date(val);

    return event.toISOString();
  };

  return (
    <div
      style={{ opacity: !isPending ? 1 : 0.7 }}
      className=" hover:scale-105 transition-all ease-in-out duration-200 flex justify-center items-center"
    >
      <Button
        onClick={() => openModal()}
        intent="text"
        className="text-violet-600 px-0 py-0"
      >
        <Edit size={14} />
      </Button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        overlayClassName="bg-[rgba(0,0,0,.4)] flex justify-center items-center absolute top-0 left-0 h-screen w-screen"
        className="w-3/4 bg-white rounded-xl p-8"
      >
        <h1 className="text-3xl mb-6">New Task's</h1>
        <form className=" items-center grid gap-2" onSubmit={handleSubmit}>
          <Input
            placeholder="project name"
            value={formState.name}
            onChange={(e) =>
              setFormState((s) => ({ ...s, name: e.target.value }))
            }
            className="rounded-md"
          />
          <Input
            placeholder="Date"
            type="date"
            value={formState.createPicker}
            onChange={(e) =>
              setFormState((s) => ({
                ...s,
                createPicker: e.target.value,
                updatedAt: dateToString(e.target.value),
              }))
            }
            className="rounded-md"
          />
          <Input
            placeholder="Due Date"
            type="date"
            value={formState.duePicker}
            onChange={(e) =>
              setFormState((s) => ({
                ...s,
                duePicker: e.target.value,
                due: dateToString(e.target.value),
              }))
            }
            className="rounded-md"
          />
          <select
            name="status"
            id="status"
            className="border-solid border-gray border-2 px-6 py-2 text-lg rounded-3xl w-full"
          >
            <option value="">NOT STARTED</option>
            <option value=""> STARTED</option>
            <option value="">COMPLETED </option>
          </select>
          <textarea
            placeholder="Description"
            type="textarea"
            value={formState.description}
            onChange={(e) =>
              setFormState((s) => ({ ...s, description: e.target.value }))
            }
            className="rounded-md border-solid border-gray border-2 px-6 py-2 text-lg  w-full"
            rows="3"
          ></textarea>
          <Button type="submit">Create</Button>
        </form>
      </Modal>
    </div>
  );
};

export default UpdateTask;
