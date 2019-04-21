import * as React from 'react';
import styled from 'styled-components';
import {
  IRow,
  IGenericListColumn,
  IWidthColumns,
  getVisibleColumns
} from '../../App';

interface IRowProps {
  row: IRow;
  columns: IGenericListColumn[];
  columnWidths: IWidthColumns[];
}

interface IRowState {
  expanded: boolean;
}

const RowElement = styled.div`
  display: block;
  margin: 6px 0;
  padding: 6px;
  border-radius: 3px;
  border: 1px solid grey;
  background: lightblue;
`;

const VisibleRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  cursor: pointer;
`;

const SubRow = styled.div`
  display: block;
`;

interface ISubRow {
  $widthToShow?: number;
}

const ExpandedRow = styled.div<ISubRow>`
  ${(props: ISubRow) => {
    if (props.$widthToShow) {
      return `display: none;
        @media (max-width: ${props.$widthToShow}px) {
        display: block;
      }`;
    } else {
      return 'display: block;';
    }
  }}
`;

interface IColumn {
  $widthToShow: number;
  $width: number;
}

const Column = styled.div<IColumn>`
  display: flex;
  flex-basis: ${(props: IColumn) => props.$width}px;

  @media (max-width: ${(props: IColumn) => props.$widthToShow}px) {
    display: none;
  }
`;

export class Row extends React.Component<IRowProps, IRowState> {
  public visibleColumnsWidth: IGenericListColumn[];

  constructor(props: IRowProps) {
    super(props);
    this.state = { expanded: false };
    this.visibleColumnsWidth = getVisibleColumns(props.columns);
  }

  public render() {
    const { row, columnWidths } = this.props;
    const { expanded } = this.state;

    return (
      <RowElement
        key={row.id}
        onClick={() => {
          this.setState({ expanded: !this.state.expanded });
        }}
      >
        <VisibleRow>
          {this.getVisibleColumns(this.visibleColumnsWidth, columnWidths, row)}
        </VisibleRow>
        {expanded && (
          <SubRow>
            {this.getHiddenColumns(this.visibleColumnsWidth, columnWidths, row)}
          </SubRow>
        )}
      </RowElement>
    );
  }

  private getVisibleColumns(
    columns: IGenericListColumn[],
    columnWidths: IWidthColumns[],
    row: IRow
  ): JSX.Element[] {
    return columnWidths.map(columnWidth => {
      const column = columns.find(column => column.key === columnWidth.key);
      if (column) {
        return (
          <Column $widthToShow={columnWidth.width} $width={column.plannedWidth}>
            {row[columnWidth.key]}
          </Column>
        );
      } else {
        return <div />;
      }
    });
  }

  private getHiddenColumns(
    columns: IGenericListColumn[],
    columnWidths: IWidthColumns[],
    row: IRow
  ): JSX.Element[] {
    return Object.keys(row).map(key => {
      const column = columns.find(column => column.key === key);

      if (column) {
        const columnWidthColumn = columnWidths.find(c => c.key === column.key);

        const columnWidth = columnWidthColumn
          ? columnWidthColumn.width
          : undefined;

        return <ExpandedRow $widthToShow={columnWidth}>{row[key]}</ExpandedRow>;
      } else {
        return <ExpandedRow>{row[key]}</ExpandedRow>;
      }
    });
  }
}
