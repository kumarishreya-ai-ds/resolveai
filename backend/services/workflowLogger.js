import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logDir = path.resolve(__dirname, "../logs");
const logFile = path.join(logDir, "workflow.log");

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const appendLog = (entry) => {
  const line = `${new Date().toISOString()} ${JSON.stringify(entry)}\n`;
  fs.appendFileSync(logFile, line, "utf8");
};

export const logWorkflow = (workflowId, payload) => {
  appendLog({ workflowId, ...payload });
};

export const readWorkflowLogs = () => {
  if (!fs.existsSync(logFile)) {
    return [];
  }

  return fs.readFileSync(logFile, "utf8").trim().split("\n").filter(Boolean).map((line) => JSON.parse(line.split(" ").slice(1).join(" ")));
};
