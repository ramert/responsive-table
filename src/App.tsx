import * as React from 'react';
import styled from 'styled-components';
import { Table, IRow } from './components/table';
import { Label } from './components/table/Row';

const SApp = styled.div`
  display: flex;
  flex-direction: column;
  @media (min-width: 640px) {
    flex-direction: row;
  }
`;

const LeftPanel = styled.div`
  position: relative;
  top: 0;
  min-width: 200px;

  @media (min-width: 640px) {
    position: fixed;
  }
`;

const RightPanel = styled.div`
  display: flex;
  flex: 1 0 auto;
  @media (min-width: 640px) {
    margin-left: 200px;
  }
`;

const Button = styled.button`
  border: 1px solid blue;
  padding: 12px;
  background: lightgray;
`;

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
    label: string,
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

  alwaysShow?: boolean;
}

const columns: IGenericListColumn[] = [
  {
    key: 'subject',
    label: 'Subject',
    plannedWidth: 200,
    priority: 10,
    alwaysShow: true
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
    key: 'nickName',
    label: 'Nick name',
    plannedWidth: 200,
    priority: 1,
    renderer: (label, value) => {
      return (
        <>
          <Label style={{ color: 'red' }}>{label}</Label>
          <span>CUSTOM {value}</span>
          <button>Edit</button>
        </>
      );
    }
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
    plannedWidth: 120,
    priority: 5,
    alwaysShow: true
  }
];

const statuses = ['Draft', 'In progress', 'Completed'];

const getTestdata = (startNum: number, amount: number): IRow[] => {
  const dataArray = [];

  for (let i = 0; i < amount; i++) {
    dataArray.push({
      id: startNum + (i + 1),
      subject: 'Subject' + (startNum + i),
      customerClaimNumber: 1234 - i,
      equipmentId: 'Equip1',
      nickName: 'Nickname' + (startNum + i),
      detailedProblemDescription: 'Details details, its all in the details',
      createdByName: 'Jokke dokke',
      status: statuses[Math.floor(Math.random() * statuses.length - 1) + 1]
    });
  }

  return dataArray;
};

export interface ISort {
  key: string;
  asc: boolean;
}

export interface IFilter {
  key: string;
  value: string;
}

interface IAppState {
  sort?: ISort;
  filter?: IFilter;
  rows: IRow[];
}

class App extends React.Component<{}, IAppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      filter: undefined,
      sort: { key: 'id', asc: true },
      rows: getTestdata(0, 100)
    };

    this.filter = this.filter.bind(this);
    this.sort = this.sort.bind(this);
    this.addRows = this.addRows.bind(this);
  }

  public filter() {
    if (this.state.filter) {
      this.setState({ filter: undefined });
    } else {
      this.setState({
        filter: {
          key: 'status',
          value: 'Draft'
        }
      });
    }
  }

  public sort() {
    if (this.state.sort && this.state.sort.key === 'status') {
      this.setState({ sort: { key: 'id', asc: true } });
    } else {
      this.setState({
        sort: {
          key: 'status',
          asc: true
        }
      });
    }
  }

  public addRows() {
    const currentRows = this.state.rows;
    const plusRows = getTestdata(currentRows.length, 50);
    const moreRows = currentRows.concat(plusRows);
    this.setState({ rows: moreRows });
  }

  public render() {
    return (
      <SApp>
        <LeftPanel>
          <div>
            <h4>Filter</h4>
            <Button onClick={this.filter}>Filter only drafts</Button>
          </div>
          <div>
            <h4>Sort</h4>
            <Button onClick={this.sort}>Sort with status</Button>
          </div>
          <div>
            <h4>Test data</h4>
            <Button onClick={this.addRows}>Add +50 random rows</Button>
          </div>
        </LeftPanel>
        <RightPanel>
          <Table
            rows={this.state.rows}
            columns={columns}
            filter={this.state.filter}
            sort={this.state.sort}
          />
        </RightPanel>
      </SApp>
    );
  }
}

export default App;
