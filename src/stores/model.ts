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
const today = new Date();
export type AgeType = { label: any; itemsCount: Function; dateFrom: Date };
export const ageTypes: { [key: string]: AgeType } = {
  today: {
    label: "Heute",
    itemsCount: () => random(1, 5),
    dateFrom: new Date(today.setHours(0, 0, 0, 0)),
  },
  week: {
    label: "Diese Woche",
    itemsCount: () => random(10, 16),
    dateFrom: new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 7
    ),
  },
  month: {
    label: "Diesen Monat",
    itemsCount: () => random(18, 30),
    dateFrom: new Date(today.setMonth(new Date().getMonth() - 1)),
  },
  year: {
    label: "Dieses Jahr",
    itemsCount: () => random(40, 60),
    dateFrom: new Date(
      today.getFullYear() - 1,
      today.getMonth(),
      today.getDate()
    ),
  },
};
// export const sourceTypes = {
//   public: 'öffentlich rechtlich',
//   private: 'privat',
//   other: 'unbestimmt',
// };

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

function randomDate(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function dateCheck(from: Date, to: Date, check: Date) {
  return check <= to && check >= from;
}

export const createColumnItems = () => {
  const createItem = (id: number, age: Date) => {
    return {
      id,
      baseRank: random(1, true),
      category: sample(categories) as Category,
      hasAd: random(0, 10) < 5,
      hasPublicSource: random(0, 10) < 5,
      age,
      fav: random(30, 99),
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
    const { itemsCount, dateFrom } = ageTypes[key];
    return times(itemsCount(), () =>
      createItem(createUniqueItemId(), randomDate(dateFrom, new Date()))
    );
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
  ageSelection?: string,
  hasAdSelection?: boolean
) => {
  const age = ageSelection || defaultAge;

  items = items.map((item) => {
    // filter old items (age)
    item.isVisible =
      dateCheck(ageTypes[age].dateFrom, new Date(), item.age) &&
      !(item.hasAd && hasAdSelection === true);

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

  const selectionValues = catSelectionValues.concat([0]);
  // weightVector(catSelectionKeys, keys, catSelectionValues, selection);

  const orderedData = items.map((item) => {
    // const subset = keys.map((x) => item[x]);

    const itemCat = item.category.label;
    const catIndex = catSelectionKeys.indexOf(itemCat);
    const catValues = fill(Array(catSelection.length), 0);
    catValues[catIndex] = 1;

    const itemValues = catValues.concat([item.baseRank]);
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
