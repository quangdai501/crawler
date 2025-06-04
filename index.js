import { crawler } from "./crawler.js";

crawler((res = []) => {
  const initArr = res.slice(0, 21);
  const numbers = [];
  initArr.forEach((item) => numbers.push(...item.numbers));

  const appearancesOfEachNumber = {};
  numbers.forEach((number) => {
    if (appearancesOfEachNumber[number]) {
      appearancesOfEachNumber[number] += 1;
    } else {
      appearancesOfEachNumber[number] = 1;
    }
  });

  const sortedArr = Object.entries(appearancesOfEachNumber).sort((a, b) => a[1] - b[1]);
  const result = sortedArr.slice(-3);
  console.log(Object.fromEntries(result));
});
