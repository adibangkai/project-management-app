"use client";
import { createNewProject } from "@/lib/api";
import { useState, useTransition } from "react";
import Modal from "react-modal";
import Button from "./Button";
import Input from "./Input";
import { useRouter } from "next/navigation";
Modal.setAppElement("#modal");

const NewProject = () => {
  const router = useRouter();
  const [modalIsOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const [name, setName] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createNewProject(name);
    closeModal();
    setName("");

    startTransition(() => {
      // Refresh the current route and fetch new data from the server without
      // losing client-side browser or React state.
      router.refresh();
    });
  };

  return (
    <div
      style={{ opacity: !isPending ? 1 : 0.7 }}
      className="px-6 py-8 hover:scale-105 transition-all ease-in-out duration-200 flex justify-center items-center"
    >
      <Button onClick={() => openModal()}>
        {isPending ? "loading" : "+ New Project"}
      </Button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        overlayClassName="bg-[rgba(0,0,0,.4)] flex justify-center items-center absolute top-0 left-0 h-screen w-screen"
        className="w-3/4 bg-white rounded-xl p-8"
      >
        <h1 className="text-3xl mb-6">New Project</h1>
        <form className="flex items-center" onSubmit={handleSubmit}>
          <Input
            placeholder="project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button type="submit">Create</Button>
        </form>
      </Modal>
    </div>
  );
};

export default NewProject;
