export const moduleKey = "tasks";
export const moduleTitle = "Tasks";
export function byPriority(list, priority) {
  if (!priority || priority === "All") return list;
  return list.filter(t => t.priority === priority);
}
export function openTasks(list) {
  return list.filter(t => t.status !== "Done" && t.status !== "Cancelled");
}
