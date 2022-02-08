import { sample, random, times, orderBy, pick, fill } from "lodash";
import {
  faCameraMovie,
  faGamepadAlt,
  faMusic,
  faUserFriends,
  faNewspaper,
  IconDefinition,
} from "@fortawesome/pro-solid-svg-icons";
import { distance } from "mathjs";
import { ColumnItem } from "src/stores";

export const defaultAge = "month";
export type AgeType = { label: any; itemsCount: Function; value: number };
export const ageTypes: { [key: string]: AgeType } = {
  today: {
    label: "Heute",
    itemsCount: () => random(1, 5),
    value: 1,
  },
  week: {
    label: "Diese Woche",
    itemsCount: () => random(10, 16),
    value: 2,
  },
  month: {
    label: "Diesen Monat",
    itemsCount: () => random(18, 30),
    value: 3,
  },
  year: {
    label: "Dieses Jahr",
    itemsCount: () => random(40, 60),
    value: 4,
  },
};

export type Category = {
  label: string;
  bgColor: string;
  icon: IconDefinition;
};

export const categories: Category[] = [
  {
    label: "Film & Animation",
    bgColor: "bg-blue-800",
    icon: faCameraMovie,
  },
  {
    label: "Gaming",
    bgColor: "bg-red-800",
    icon: faGamepadAlt,
  },
  {
    label: "Musik, Tiere, Sport",
    bgColor: "bg-green-900",
    icon: faMusic,
  },
  {
    label: "Menschen & Blogs",
    bgColor: "bg-yellow-800",
    icon: faUserFriends,
  },
  {
    label: "Nachrichten & Politik",
    bgColor: "bg-gray-600",
    icon: faNewspaper,
  },
];

export const createColumnItems = () => {
  const createItem = (id: number, age: number) => {
    return {
      id,
      baseRank: random(1, true),
      category: sample(categories) as Category,
      hasAd: random(0, 10) < 5,
      hasPublicSource: random(0, 10) < 5,
      age,
      isVisible: true,
    };
  };
  const usedIds: number[] = [];
  const createUniqueItemId = () => {
    while (true) {
      let id = random(100, 1000);
      if (usedIds.includes(id)) {
        continue;
      }
      usedIds.push(id);
      return id;
    }
  };

  const items = Object.keys(ageTypes).flatMap((key) => {
    const { itemsCount, value } = ageTypes[key];
    return times(itemsCount(), () => createItem(createUniqueItemId(), value));
  });

  return orderByDistance(items, []);
};

export type CategorySelection = {
  type: "category";
  label: string;
  value: number;
  minValue: number;
  maxValue: number;
};

export const orderByDistance = (
  items: ColumnItem[],
  categorySelection: CategorySelection[],
  monetarisation: number = 0,
  hasPublicSource?: boolean,
  ageSelection?: string,
  hasAdSelection?: boolean
) => {
  const age = ageSelection || defaultAge;

  items = items.map((item) => {
    item.isVisible =
      (hasPublicSource === true ? item.hasPublicSource === true : true) &&
      item.age <= ageTypes[age].value &&
      !(item.hasAd && hasAdSelection === true && monetarisation === 0);

    return item;
  });

  const catSelection = categorySelection.filter((x) => x.type === "category");

  const catSelectionKeys = catSelection.map(
    ({ label }: { label: any }) => label
  );
  const catSelectionValues = catSelection.map(
    ({ value, maxValue }: { value: number; maxValue: number }) =>
      value / maxValue
  );

  let adFactor = 0.005;

  const monValue = [0];
  monValue.push(Math.pow(adFactor, -Math.abs(monetarisation / 10)));

  const selectionValues = catSelectionValues.concat(monValue);
  // weightVector(catSelectionKeys, keys, catSelectionValues, selection);

  const orderedData = items.map((item) => {
    // const subset = keys.map((x) => item[x]);

    const itemCat = item.category.label;
    const catIndex = catSelectionKeys.indexOf(itemCat);
    const catValues = fill(Array(catSelection.length), 0);
    catValues[catIndex] = 1;

    const monValue2 = [item.baseRank];
    monValue2.push(item.hasAd ? 1 * adFactor : 0);

    const itemValues = catValues.concat(monValue2);
    // weightVector(selectionKeys, keys, subset, selection);
    // console.log(catSelectionValues, itemValues);
    const dist = distance(selectionValues, itemValues);
    return { ...item, dist };
  });

  const orderedCategoties = orderBy(
    orderedData,
    ["isVisible", "dist", "age"],
    ["desc", "asc", "asc"]
  ).map((item) => pick(item, Object.keys(items[0]))) as ColumnItem[];

  // orderedCategoties.sort((a, b) => (a.isVisible ? 0 : 1));

  return orderedCategoties;
};
