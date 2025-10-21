import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { authClient } from "@/lib/auth-client.ts";
import { useMutation } from "convex/react";

import { Check, Pencil } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";

const UserWeightInput = () => {
  const { data: session } = authClient.useSession();
  const [weight, setWeight] = useState<string>("");
  const [changeWeight, setChangeWeight] = useState<boolean>(false);

  const { data: weightData } = useSuspenseQuery(convexQuery(api.userWeights.getUserWeight, {}));
  const addWeight = useMutation(api.userWeights.addUserWeight);
  const editWeight = useMutation(api.userWeights.updateUserWeight);

  const handleAddWeight = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addWeight({ weight });
  }

  const handleChangeWeight = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (weightData?._id !== undefined){
      await editWeight({weightId: weightData?._id, changeWeight: weight})
      setChangeWeight(false);
    }
  }

  if (!session) return null;

  if (!weightData) return (
    <div className="p-2">
      <form className="flex gap-2 items-center" onSubmit={handleAddWeight}>
        <p>Vaše váha (kg):</p>
        <Input
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="max-w-[70px]"
          type="number"
          min="10"
          max="500"
          step="0.01"
          required
        />
        <Button type="submit" className="ml-auto" size="icon">
          <Check />
        </Button>
      </form>
    </div>
  )

  return (
    <>
        <div className="p-2">
          {changeWeight ? (
            <form
              className="flex gap-2 items-center"
              onSubmit={handleChangeWeight}
            >
              <p>Vaše váha (kg):</p>
              <Input
                autoFocus
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="max-w-[70px]"
                type="number"
                min="10"
                max="500"
                step="0.01"
                required
              />
              <Button type="submit" className="ml-auto" size="icon">
                <Check />
              </Button>
            </form>
          ) : (
            <div className="flex gap-2 items-center">
              <p>Vaše váha:</p>
              <p>{weightData.weight}kg</p>
              <Button
                type="button"
                size="icon"
                className="ml-auto"
                onClick={() => setChangeWeight(true)}
              >
                <Pencil />
              </Button>
            </div>
          )}
        </div>
    </>
  );
};

export default UserWeightInput;
