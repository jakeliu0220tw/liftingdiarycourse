export const dynamic = "force-dynamic"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getWorkoutsForDate } from "@/data/workouts"
import DatePicker from "./DatePicker"

type Props = {
  searchParams: Promise<{ date?: string }>
}

function todayString() {
  return format(new Date(), "yyyy-MM-dd")
}

export default async function DashboardPage({ searchParams }: Props) {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const { date = todayString() } = await searchParams

  const workoutList = await getWorkoutsForDate(userId, new Date(date + "T00:00:00"))

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center gap-4">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <DatePicker value={date} />
      </div>

      {workoutList.length === 0 ? (
        <p className="text-muted-foreground">No workouts logged for this date.</p>
      ) : (
        <div className="space-y-4">
          {workoutList.map((workout) => (
            <Card key={workout.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">
                  {workout.name ?? "Unnamed Workout"}
                </CardTitle>
                <span
                  className={
                    workout.completedAt
                      ? "rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
                      : "rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                  }
                >
                  {workout.completedAt ? "Completed" : "In progress"}
                </span>
              </CardHeader>
              <CardContent>
                <p className="mb-3 text-sm text-muted-foreground">
                  {format(workout.startedAt, "h:mm a")}
                  {workout.completedAt && ` — ${format(workout.completedAt, "h:mm a")}`}
                </p>
                {workout.exercises.length > 0 && (
                  <ul className="space-y-1">
                    {workout.exercises.map((name) => (
                      <li key={name} className="text-sm">
                        {name}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
