import { uniqueId } from 'lodash';
import { ColumnType } from 'src/components/Column/create';
import { categories } from 'src/model';

export type UserPanelType = ReturnType<typeof createUserPanel>;
export type ControlGroupType = ReturnType<typeof createControlGroup>;
export interface ControlElementType {
  [key: string]: any;
  type: string;
}

const createControlGroup = ({
  label,
  controls,
}: {
  label: string;
  controls: ControlElementType[];
}) => ({
  label,
  controls,
});

export const createUserPanel = (column: ColumnType) => {
  return {
    id: uniqueId('panel'),
    columnId: column.id,
    controlGroups: [
      createControlGroup({
        label: 'Kategorien',
        controls: categories.map(({ label, bgColor }) => ({
          type: 'slider',
          label,
          bgColor,
          minValue: 0,
          maxValue: 10,
        })),
      }),
    ],
  };
};
