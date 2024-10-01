import { getWorkoutDetails } from "@/app/actions/getWorkoutDetails";
import { H1 } from "@/app/components/H1";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { AddExerciseButton } from "./components/AddExerciseButton";
import { AddExerciseModal } from "./components/AddExerciseModal";
import { getUser } from "@/utils/supabase/server";
import { EditWorkoutDetailsButton } from "./components/EditWorkoutDetailsButton";
import { EditWorkoutDetailsModal } from "./components/EditWorkoutDetailsModal";
import ExerciseList from "./components/ExerciseList";

type Props = {
  params: { id: string };
};

export default async function WorkoutDetails({ params }: Props) {
  if (!params.id) {
    redirect("/dashboard");
  }

  const { error, data: workoutDetails } = await getWorkoutDetails(params.id);

  if (error || !workoutDetails) {
    redirect("/dashboard");
  }

  // check if the user is the author of the workout
  const user = await getUser();

  if (user!.id !== workoutDetails.author_id) {
    redirect("/dashboard");
  }

  return (
    <div className="main-bg fixed inset-0 min-h-screen w-screen overflow-scroll p-4 text-white">
      <Link href={"/dashboard"}>Go Back</Link>
      <div>
        <H1>{workoutDetails.name}</H1>
        <p className="text-secondary">{workoutDetails.description}</p>
      </div>

      <ExerciseList workoutId={params.id} />

      <div className="absolute right-4 top-4 flex gap-2 text-sm">
        <EditWorkoutDetailsButton />
        <AddExerciseButton />
      </div>

      <AddExerciseModal workoutId={params.id} />
      <EditWorkoutDetailsModal workoutDetails={workoutDetails} />
    </div>
  );
}
