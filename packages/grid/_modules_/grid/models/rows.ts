export type RowsProp = RowData[];
export type Rows = RowModel[];

/**
 * The key value object representing the data of a row.
 */
export interface RowData extends ObjectWithId {
  [key: string]: any;
}

/**
 * The type of Id supported by the grid.
 */
export type RowId = string | number;

export interface ObjectWithId {
  id: RowId;
}

/**
 * The internal model of a row containing its state and data.
 */
export interface RowModel {
  id: RowId;
  data: RowData;
}

/**
 * An helper function allowing to create [[RowModel]] from [[RowData]].
 *
 * @param rowData Row as [[RowData]].
 * @returns A row as [[RowModel]].
 */
export function createRowModel(rowData: RowData): RowModel {
  if (rowData.id == null) {
    throw new Error(
      [
        'Material-UI: The data grid component requires all rows to have a unique id property.',
        'A row was provided without in the rows prop:',
        JSON.stringify(rowData),
      ].join('\n'),
    );
  }

  const row: RowModel = {
    id: rowData.id,
    data: rowData,
  };
  return row;
}
