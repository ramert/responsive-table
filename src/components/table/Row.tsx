import * as React from 'react';
import styled from 'styled-components';
import { IGenericListColumn } from '../../App';
import { IWidthColumns } from './Table';

interface IRowProps {
  row: IRow;
  columns: IGenericListColumn[];
  columnWidths: IWidthColumns[];
}

interface IRowState {
  expanded: boolean;
}

const PlusMinus = styled.div<IRowState>`
  position: relative;
  min-width: 30px;
  height: 30px;
  margin: auto 6px auto 0;

  &:hover {
    cursor: pointer;
  }
  ${(props: IRowState) => {
    return (
      props.expanded &&
      `&:after {
      transform: rotate(90deg);
    }`
    );
  }};

  &:before,
  &:after {
    content: '';
    position: absolute;
    background: blue;
    transition: 150ms all ease-out;
  }

  &:before {
    top: 13px;
    left: 6px;
    right: 6px;
    height: 4px;
  }

  &:after {
    top: 6px;
    left: 13px;
    bottom: 6px;
    width: 4px;
  }
`;

export interface IRow {
  id: number;
  subject: string;
  customerClaimNumber: number;
  equipmentId: string;
  nickName: string;
  detailedProblemDescription: string;
  createdByName: string;
  status: string;
}

const RowElement = styled.div`
  display: block;
  margin: 6px 0;
  padding: 6px;
  border-radius: 3px;
  border: 1px solid grey;
  background: #f3f3f3;
`;

const VisibleRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  cursor: pointer;
`;

const SubRow = styled.div`
  display: block;
  margin: 12px 0 0 30px;
`;

const ExpandedRow = styled.div<IColumn>`
  padding: 6px;
  ${(props: IColumn) => {
    if (props.$alwaysShow) {
      return 'display: none';
    } else if (props.$widthToShow) {
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
  $widthToShow?: number;
  $width?: number;
  $alwaysShow?: boolean;
}

const Column = styled.div<IColumn>`
  display: block;
  flex-basis: ${(props: IColumn) => props.$width}px;

  ${(props: IColumn) => {
    return (
      !props.$alwaysShow &&
      `@media(max-width: ${props.$widthToShow}px) {
        display: none;
      }`
    );
  }}
`;

export const Label = styled.div`
  font-size: 0.75em;
  line-height: 1;
  color: darkgray;
`;

interface IValue {
  title: string;
  value: any;
}

const Value: React.FC<IValue> = props => {
  return (
    <>
      <Label>{props.title}</Label>
      <div>{props.value}</div>
    </>
  );
};

export class Row extends React.Component<IRowProps, IRowState> {
  constructor(props: IRowProps) {
    super(props);
    this.state = { expanded: false };
  }

  public render() {
    const { row, columns, columnWidths } = this.props;
    const { expanded } = this.state;

    return (
      <RowElement key={row.id}>
        <VisibleRow
          onClick={() => {
            this.setState({ expanded: !this.state.expanded });
          }}
        >
          <PlusMinus expanded={this.state.expanded} />
          {this.getVisibleColumns(columns, columnWidths, row)}
        </VisibleRow>
        {expanded && (
          <SubRow>{this.getHiddenColumns(columns, columnWidths, row)}</SubRow>
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
          <Column
            key={'vi' + column.key}
            $widthToShow={columnWidth.width}
            $width={column.plannedWidth}
            $alwaysShow={column.alwaysShow}
          >
            <Value title={column.label} value={row[column.key]} />
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

      let columnWidth;

      if (column) {
        const columnWidthColumn = columnWidths.find(c => c.key === column.key);

        columnWidth = columnWidthColumn ? columnWidthColumn.width : undefined;

        return (
          <ExpandedRow
            key={'ex-' + key}
            $widthToShow={columnWidth}
            $alwaysShow={column.alwaysShow}
          >
            {column.renderer ? (
              column.renderer(column ? column.label : key, row[column.key])
            ) : (
              <Value title={column ? column.label : key} value={row[key]} />
            )}
          </ExpandedRow>
        );
      } else {
        return <div />;
      }
    });
  }
}
