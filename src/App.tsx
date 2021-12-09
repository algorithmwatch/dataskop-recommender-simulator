import _ from 'lodash';
import React, { useEffect, useRef, MutableRefObject, createRef } from 'react';
import { Column } from 'src/components/Column';
import { Header } from 'src/components/Header';
import { OnCategoryChangeCallback, UserPanel } from 'src/components/Panel';
import {
  ColumnItem,
  ControlElement,
  useColumnStore,
  useUserPanelStore,
} from 'src/stores';

import { distance, multiply } from 'mathjs';

const orderByDistance = (items: any[], selection: any[]) => {
  // const selectionKeys = Object.keys(_.pickBy(selection, (v) => v !== '0'));
  const selectionKeys = selection.map(({ label }: { label: any }) => label);

  // const dataKeys = Object.keys(items[0]);
  // const keys = _.intersection(selectionKeys, dataKeys);

  // if (!keys.length) return items;

  // const selectionValues = keys.map((x) => selection[x]);
  // console.log(selection);
  // console.log(selectionKeys);
  const selectionValues = selection.map(
    ({ value, maxValue }: { value: number; maxValue: number }) =>
      value / maxValue
  );
  // weightVector(selectionKeys, keys, selectionValues, selection);

  const orderedData = items.map((item) => {
    // const subset = keys.map((x) => item[x]);

    const itemCat = item.category.label;
    const catIndex = selectionKeys.indexOf(itemCat);
    const itemValues = _.fill(Array(selectionValues.length), 0);
    itemValues[catIndex] = 1;

    // weightVector(selectionKeys, keys, subset, selection);
    // console.log(selectionValues, itemValues);
    const dist = distance(selectionValues, itemValues);
    return { ...item, dist };
  });

  return _(orderedData)
    .orderBy('dist')
    .map((x) => _.pick(x, Object.keys(items[0])))
    .value();
};

function App() {
  const columns = useColumnStore((state) => state.columns);
  const columnItems = useColumnStore((state) => state.items);
  const setColumnItems = useColumnStore((state) => state.setItems);
  const addColumn = useColumnStore((state) => state.add);
  const removeColumn = useColumnStore((state) => state.remove);
  const userPanels = useUserPanelStore((state) => state.panels);
  const addUserPanel = useUserPanelStore((state) => state.add);
  const setControlValue = useUserPanelStore((state) => state.setControlValue);
  const removeUserPanelByColumnId = useUserPanelStore(
    (state) => state.removeByColumnId
  );
  const columnRefs: MutableRefObject<{ [key: string]: HTMLDivElement }> =
    useRef(
      columns.reduce((acc, cur) => ({ ...acc, [cur.id]: createRef() }), {})
    );
  const maxColumns = 3;
  const canAddColumn = columns.length < maxColumns;
  const onCategoryChange = ({
    columnId,
    label,
    value,
    minValue,
    maxValue,
  }: OnCategoryChangeCallback) => {
    const allCategories = userPanels.flatMap((panel) =>
      panel.controlGroups.categories.controls.map(
        ({ label, value, minValue, maxValue }: ControlElement) => ({
          label,
          value,
          minValue,
          maxValue,
        })
      )
    );
    console.warn('allCategories', allCategories);
    /*
      0: {label: 'Film & Animation', value: 0, minValue: 0, maxValue: 10}
      1: {label: 'Gaming', value: 0, minValue: 0, maxValue: 10}
      2: {label: 'Musik, Tiere, Sport', value: 0, minValue: 0, maxValue: 10}
      3: {label: 'Menschen & Blogs', value: 0, minValue: 0, maxValue: 10}
      4: {label: 'Nachrichten & Politik', value: 0, minValue: 0, maxValue: 10
    */

    const oldItems = columnItems[columnId];
    const selection = allCategories
      .filter((x: any) => x.label !== label)
      .concat({ label, value, minValue, maxValue });

    const newItems = orderByDistance(oldItems, selection);
    console.warn('oldItems', oldItems);
    console.warn('newItems', newItems);

    setColumnItems(columnId, newItems as ColumnItem[]);
    setControlValue(columnId, 'categories', label, value);
  };

  // add one column at start
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(addColumn, []);

  return (
    <div>
      <Header addColumn={addColumn} canAddColumn={canAddColumn}></Header>
      {/* Columns */}
      <div className="stripes flex justify-evenly mt-28">
        {columns.map(({ id, name }, index) => (
          <Column
            key={id}
            ref={(el: HTMLDivElement) => (columnRefs.current[id] = el)}
            id={id}
            name={name}
            items={columnItems[id]}
            onRemove={() => removeColumn(id)}
            hasPanel={userPanels.some((panel) => panel.columnId === id)}
            onShowPanel={() => addUserPanel(id)}
            onHidePanel={() => removeUserPanelByColumnId(id)}
          ></Column>
        ))}
      </div>

      {/* Floating panels */}
      {userPanels.map(({ id, columnId, controlGroups }, index) => {
        const column = columns.find((col) => col.id === columnId);

        return (
          column && (
            <UserPanel
              key={id}
              id={id}
              columnId={columnId}
              column={column}
              columnElement={columnRefs.current[columnId]}
              controlGroups={controlGroups}
              onCategoryChange={onCategoryChange}
            />
          )
        );
      })}
    </div>
  );
}

export default App;
