import { createColumn } from 'src/components/Column/create';

export function Column({ name, items }: ReturnType<typeof createColumn>) {
  return (
    <div>
      <h2>{name}</h2>
    </div>
  );
}
