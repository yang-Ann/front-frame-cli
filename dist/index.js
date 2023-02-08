import fg from "fast-glob";
const entries = await fg(["**/**.ejs"], { cwd: "", dot: true });
console.log("entries: ", entries);
