import * as React from 'react';
import styled from 'styled-components';
import { IGenericListColumn, ISort, IFilter } from 'src/App';
import { Row, IRow } from './Row';

export const TableBlock = styled.div`
  flex-grow: 1;
`;

export interface IWidthColumns {
  key: string;
  width: number;
}
interface ITableProps {
  sort?: ISort;
  filter?: IFilter;
  rows: IRow[];
  columns: IGenericListColumn[];
}

export class Table extends React.Component<ITableProps> {
  public columnsInWidth: IWidthColumns[];

  constructor(props: ITableProps) {
    super(props);
    this.columnsInWidth = this.getColumnsInWidth(this.props.columns);
  }

  public render() {
    const { rows, columns, sort, filter } = this.props;
    const filteredAndSortedRows = this.sortAndFilter(rows, sort, filter);

    return (
      <TableBlock>
        {filteredAndSortedRows.map(row => {
          return (
            <Row
              key={row.id}
              row={row}
              columns={columns}
              columnWidths={this.columnsInWidth}
            />
          );
        })}
      </TableBlock>
    );
  }

  public getVisibleColumns(columns: IGenericListColumn[]) {
    return columns.filter(column => !column.alwaysHidden);
  }

  public getColumnsInWidth(columns: IGenericListColumn[]): IWidthColumns[] {
    const offset = 300;
    const columnsToShow = this.getVisibleColumns(columns);
    const sortedColumns = columnsToShow.sort(
      (a: IGenericListColumn, b: IGenericListColumn) => {
        return b.priority - a.priority;
      }
    );

    const columnWidths: IWidthColumns[] = [];
    let currentWidth = offset;
    sortedColumns.map(column => {
      currentWidth += column.plannedWidth;
      columnWidths.push({ key: column.key, width: currentWidth });
    });

    const columnWidthsInOrder: IWidthColumns[] = [];
    this.getVisibleColumns(columns).map(column => {
      const cW = columnWidths.find(sc => sc.key === column.key);
      if (cW) {
        columnWidthsInOrder.push({ key: column.key, width: cW.width });
      }
    });

    return columnWidthsInOrder;
  }

  public sortAndFilter(rows: IRow[], sort?: ISort, filter?: IFilter): IRow[] {
    let returnArray = rows;

    if (filter) {
      returnArray = rows.filter(row => {
        return row[filter.key] === filter.value;
      });
    }

    if (sort) {
      returnArray = returnArray.sort(this.createSortPredicate(sort));
    }

    return returnArray;
  }

  private createSortPredicate(sort: ISort) {
    const sortColumn = (
      aValue: string | Date | number,
      bValue: string | Date | number
    ): number => {
      let order = 0;

      if (aValue < bValue) {
        order = -1;
      }

      if (aValue > bValue) {
        order = 1;
      }

      if (!sort.asc) {
        order = -order;
      }

      return order;
    };

    return (row1: IRow, row2: IRow): number => {
      const aContent = row1[sort.key];
      const bContent = row2[sort.key];
      const aValue = aContent || '';
      const bValue = bContent || '';

      return sortColumn(aValue, bValue);
    };
  }
}
