export const moduleKey = "deals";
export const moduleTitle = "Deals";
export function byStage(list, stage) {
  if (!stage || stage === "All") return list;
  return list.filter(d => d.stage === stage);
}
export function pipelineValue(list) {
  return list.reduce((sum, d) => sum + (Number(d.value)||0), 0);
}
export function stageCounts(list) {
  const counts = {};
  list.forEach(d => { counts[d.stage] = (counts[d.stage]||0)+1; });
  return counts;
}
