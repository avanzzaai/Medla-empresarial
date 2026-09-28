export function journeyStage(value, issue = "none") {
  const numeric = Number(value);
  const stage = Number.isFinite(numeric) ? Math.max(0, Math.min(3, Math.floor(numeric))) : 0;
  return issue === "open" ? Math.min(stage, 2) : stage;
}

export function journeyView(journey, value, issue = "none") {
  const stage = journeyStage(value, issue);
  const step = journey.stages[stage];
  const blocked = issue === "open" && stage === 2;
  return {
    stage, blocked, complete: stage === 3 && issue !== "open",
    title: step.title,
    action: blocked ? journey.exception.explanation : step.action,
    evidence: blocked ? journey.exception.trigger : step.evidence,
    owner: step.owner,
  };
}
