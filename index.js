import { crawler } from "./crawler.js";

crawler((res = []) => {
  console.log(res.length);
});
