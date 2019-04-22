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

interface ITableState {
  offset: number;
  columnWidths: IWidthColumns[];
}

export class Table extends React.Component<ITableProps, ITableState> {
  public ref: React.RefObject<any>;

  constructor(props: ITableProps) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      offset: 0,
      columnWidths: this.getColumnsInWidth(this.props.columns, 0)
    };
  }

  public componentDidMount() {
    window.addEventListener('resize', this.resize.bind(this));
    this.resize();
  }

  public resize() {
    if (this.ref && this.ref.current.offsetWidth > 0) {
      const newOffset = window.innerWidth - this.ref.current.offsetWidth;

      if (newOffset !== this.state.offset) {
        this.setState({
          offset: newOffset,
          columnWidths: this.getColumnsInWidth(this.props.columns, newOffset)
        });
      }
    }
  }

  public render() {
    const { rows, columns, sort, filter } = this.props;
    const filteredAndSortedRows = this.sortAndFilter(rows, sort, filter);

    return (
      <TableBlock ref={this.ref}>
        {filteredAndSortedRows.map(row => {
          return (
            <Row
              key={row.id}
              row={row}
              columns={columns}
              columnWidths={this.state.columnWidths}
            />
          );
        })}
      </TableBlock>
    );
  }

  public getVisibleColumns(columns: IGenericListColumn[]) {
    return columns.filter(column => !column.alwaysHidden);
  }

  public getColumnsInWidth(
    columns: IGenericListColumn[],
    offset: number
  ): IWidthColumns[] {
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
