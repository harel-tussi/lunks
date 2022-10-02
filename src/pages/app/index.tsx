import React, { useRef } from "react";
import { useRequireAuth } from "../../utils/auth";
import { trpc } from "../../utils/trpc";

type Props = {};

const Index = (props: Props) => {
  const formRef = useRef<HTMLFormElement>(null);
  const session = useRequireAuth();
  const getAllSitesQuery = trpc.useQuery(["site.getAll"]);
  const createSiteMutation = trpc.useMutation(["site.create"]);
  if (!session?.user) return null;
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createSiteMutation.mutateAsync({
      name: (document.getElementById("name") as HTMLInputElement).value,
      description: (document.getElementById("description") as HTMLInputElement)
        .value,
    });
  };

  return (
    <div>
      {JSON.stringify(getAllSitesQuery.data)}
      <form onSubmit={onSubmit} ref={formRef}>
        <input type="text" id="name" name="name" placeholder="Enter name..." />
        <input
          type="text"
          id="description"
          name="description"
          placeholder="Enter description..."
        />
        <button type="submit">Submit</button>
      </form>
      {createSiteMutation.isLoading && <p>Loading...</p>}
    </div>
  );
};

export default Index;
