"use server";

import prisma from "@/lib/prisma";
import { ExerciseDetails, WorkoutDetails } from "@/types/type";
import { createClient } from "@/utils/supabase/server";

export async function getWorkoutDetails(workoutId: string) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!workoutId || !user) {
    return { error: "Your not allowed to do this.", data: null };
  }

  const workoutDetails = await prisma.workout.findUnique({
    where: {
      id: workoutId,
    },
  });

  const exercises = await prisma.exercise.findMany({
    where: {
      workout_id: workoutId,
    },
  });

  let finaleExercises: ExerciseDetails[] = [];

  for (const exercise of exercises) {
    const sets = await prisma.set.findMany({
      where: {
        exercise_id: exercise.id,
      },
    });

    finaleExercises.push({ ...exercise, sets });
  }

  if (!workoutDetails) {
    return { data: null, error: "Workout not found" };
  }

  const finalWorkoutDetails: WorkoutDetails = { ...workoutDetails, exercises: finaleExercises };

  return { data: finalWorkoutDetails, error: null };
}
