"use client";
import { createNewTask } from "@/lib/api";
import { useState, useTransition } from "react";
import Modal from "react-modal";
import Button from "./Button";
import Input from "./Input";
import { useRouter } from "next/navigation";

Modal.setAppElement("#modal");

const initial = {
  name: "",
  createdAt: "",
  due: "",
  description: "",
  duePicker: "",
  createPicker: "",
};

const NewTask = ({ id }) => {
  const router = useRouter();
  const [modalIsOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const [formState, setFormState] = useState({ ...initial, projectId: id });
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createNewTask(formState);
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
      className="px-6 py-8 hover:scale-105 transition-all ease-in-out duration-200 flex justify-center items-center"
    >
      <Button
        onClick={() => openModal()}
        intent="text"
        className="text-violet-600"
      >
        {isPending ? "loading" : "+ New Task"}
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
                createdAt: dateToString(e.target.value),
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
          <Input
            placeholder="Description"
            value={formState.description}
            onChange={(e) =>
              setFormState((s) => ({ ...s, description: e.target.value }))
            }
            className="rounded-md"
          />
          <Button type="submit">Create</Button>
        </form>
      </Modal>
    </div>
  );
};

export default NewTask;
