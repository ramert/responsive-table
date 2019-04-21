import * as React from 'react';
import styled from 'styled-components';
import { Component, Row } from './components/table';

const SApp = styled.div`
  display: flex;
  flex-direction: row;
`;

const LeftPanel = styled.div`
  min-width: 300px;
`;

export interface IWidthColumns {
  key: string;
  width: number;
}

export interface IGenericListColumn<T = {}> {
  /**
   * Optional id for identifying the column in case multiple columns use
   * the same key in original data.
   */
  id?: string;

  /**
   * Column key in the row object
   */
  key: string;

  /**
   * A planned width for the column (this will NOT be the final width!)
   * used for estimating the total width for the row for visible columns
   */
  plannedWidth: number;

  /**
   * Column visibility priority, larger number is higher priority. Used
   * to figure out which column should be dropped if the row doesn't fit
   * in asked width.
   */
  priority: number;

  /**
   * Column label
   */
  label: string;

  /**
   * Column should be always hidden (but visible when row is expanded).
   */
  alwaysHidden?: boolean;

  /**
   * No label is rendered for this column when the claim is expanded
   */
  hideLabel?: boolean;

  /**
   * No label is rendered for this column in main row
   */
  hideMainLabel?: boolean;

  /**
   * If item value is undefined don't render the column/expanded row
   */
  hideColumnIfUndefined?: boolean;

  /**
   * If item value is undefined don't render the label of the column
   */
  hideLabelIfUndefined?: boolean;

  /**
   * Special renderer for the lable.
   * Needed when label (or part of it) needs to come from content
   * E.g. "Weight (kg)" - kg comes from weightUnit in response object
   * TODO: lose the any.
   */
  labelRenderer?: (value: any, row?: T) => string | JSX.Element;

  /**
   * Special renderer for the value. Needed at least for dates and other objects.
   * TODO: lose the any.
   */
  renderer?: (
    value: any,
    row?: T,
    isEditable?: boolean
  ) => string | JSX.Element;

  /**
   * Used to override default styles of the column container
   * Needed at least to create full height buttons in table row
   */
  styleOverride?: object;

  disableSort?: boolean;

  /**
   * In expanded mode show or not to show field if no value
   */
  hideEmptyValues?: boolean;

  /**
   * Return true if this column should be rendered. Useful when there are rows
   * that have a differing set of columns. The unexpanded columns should never
   * have this prop.
   */
  isEnabled?: (item: T | null) => boolean;
}

const columns: IGenericListColumn[] = [
  {
    key: 'subject',
    label: 'Subject',
    plannedWidth: 300,
    priority: 10
  },
  {
    alwaysHidden: true,
    key: 'customerClaimNumber',
    label: 'Customer Claim Number',
    plannedWidth: 50,
    priority: 2,
    hideEmptyValues: true
  },
  {
    key: 'equipmentId',
    label: 'EquipmentId',
    plannedWidth: 200,
    priority: 3,
    hideEmptyValues: true
  },
  {
    alwaysHidden: true,
    key: 'detailedProblemDescription',
    label: 'Description',
    plannedWidth: 200,
    priority: 4,
    hideEmptyValues: true
  },
  {
    alwaysHidden: true,
    key: 'wartsilaOrderNumber',
    label: 'Order number',
    plannedWidth: 150,
    priority: 1,
    hideEmptyValues: true
  },
  {
    alwaysHidden: true,
    key: 'deliveryNumber',
    label: 'Delivery Number',
    plannedWidth: 150,
    priority: 1,
    hideEmptyValues: true
  },

  {
    key: 'installationId',
    label: 'Installation',
    plannedWidth: 200,
    priority: 1,
    hideEmptyValues: true
  },
  {
    alwaysHidden: true,
    key: 'creationDate',
    label: 'Creation date',
    plannedWidth: 200,
    priority: 1
  },
  {
    alwaysHidden: true,
    key: 'claimReason',
    label: 'Reason',
    plannedWidth: 150,
    priority: 1,
    hideEmptyValues: true
  },
  {
    alwaysHidden: true,
    key: 'createdByName',
    label: 'Created By',
    plannedWidth: 200,
    priority: 1
  },
  {
    key: 'status',
    label: 'Status',
    plannedWidth: 200,
    priority: 5
  }
];

export interface IRow {
  id: number;
  subject: string;
  customerClaimNumber: number;
  equipmentId: string;
  detailedProblemDescription: string;
  createdByName: string;
  status: string;
}

export const rows: IRow[] = [
  {
    id: 1,
    subject: 'Subject',
    customerClaimNumber: 1234,
    equipmentId: 'Equip1',
    detailedProblemDescription: 'Details124 Details',
    createdByName: 'Jokke dokke',
    status: 'In progres'
  },
  {
    id: 2,
    subject: 'Subject',
    customerClaimNumber: 1234,
    equipmentId: 'Equip1',
    detailedProblemDescription: 'Details124 Details',
    createdByName: 'Jokke dokke',
    status: 'In progres'
  },
  {
    id: 3,
    subject: 'Subject',
    customerClaimNumber: 1234,
    equipmentId: 'Equip1',
    detailedProblemDescription: 'Details124 Details',
    createdByName: 'Jokke dokke',
    status: 'In progres'
  },
  {
    id: 4,
    subject: 'Subject',
    customerClaimNumber: 1234,
    equipmentId: 'Equip1',
    detailedProblemDescription: 'Details124 Details',
    createdByName: 'Jokke dokke',
    status: 'In progres'
  }
];

export const getVisibleColumns = (columns: IGenericListColumn[]) => {
  return columns.filter(column => !column.alwaysHidden);
};

const getColumnsInWidth = (columns: IGenericListColumn[]): IWidthColumns[] => {
  const offset = 300;
  const columnsToShow = getVisibleColumns(columns);
  columnsToShow.sort((a: IGenericListColumn, b: IGenericListColumn) => {
    return b.priority - a.priority;
  });

  const columnWidths: IWidthColumns[] = [];
  let currentWidth = offset;
  columnsToShow.map(column => {
    currentWidth += column.plannedWidth;
    columnWidths.push({ key: column.key, width: currentWidth });
  });

  return columnWidths;
};

const getTestdata = (amount: number): IRow[] => {
  const dataArray = [];

  for (let i = 0; i < amount; i++) {
    dataArray.push({
      id: i + 1,
      subject: 'Subject',
      customerClaimNumber: 1234 + i,
      equipmentId: 'Equip1',
      detailedProblemDescription: 'Details124 Details',
      createdByName: 'Jokke dokke',
      status: 'In progres'
    });
  }

  return dataArray;
};

class App extends React.Component {
  public columnsInWidth = getColumnsInWidth(columns);
  public rows = getTestdata(1000);

  public render() {
    return (
      <SApp>
        <LeftPanel />
        <Component>
          {this.rows.map(row => {
            return (
              <Row
                key={row.id}
                row={row}
                columns={columns}
                columnWidths={this.columnsInWidth}
              />
            );
          })}
        </Component>
      </SApp>
    );
  }
}

export default App;
