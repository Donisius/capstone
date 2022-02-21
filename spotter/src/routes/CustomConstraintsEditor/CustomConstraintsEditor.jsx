import { useState } from 'react';
import {
  Button,
  DataTable,
  Table,
  TableBatchAction,
  TableBatchActions,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableSelectAll,
  TableSelectRow,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
} from 'carbon-components-react';
import { Delete16 as Delete, Edit16 as Edit } from '@carbon/icons-react';

import { CustomConstraintsModal } from './CustomConstraintsModal';
import { SvgEmptystateDefaultIcon } from '../../static/EmptyStateDefaultIcon';
import './CustomConstraintsEditor.css';

const headers = [
  {
    key: 'exercise',
    header: 'Exercise',
  },
  {
    key: 'dateAdded',
    header: 'Date added',
  },
  {
    key: 'edit',
    header: '',
  },
];

export const CustomConstraintsEditor = ({ constraints, setConstraints }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedConstraint, setSelectedConstraint] = useState(null);

  return (
    <>
      <CustomConstraintsModal
        isOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        constraint={selectedConstraint}
        constraints={constraints}
        setConstraints={setConstraints}
        setSelectedConstraint={setSelectedConstraint}
      />
      <div className='wrapper'>
        <DataTable
          rows={constraints
            .filter(constraint => constraint.type === 'custom')
            .map(constraint => ({
              id: constraint.exercise,
              exercise: constraint.exercise,
              dateAdded: constraint.dateAdded,
              edit: (
                <Button
                  onClick={() => {
                    setSelectedConstraint(constraint);
                    setIsModalOpen(true);
                  }}
                  hasIconOnly
                  renderIcon={Edit}
                  kind='ghost'
                  iconDescription='Edit constraint'
                />
              ),
            }))}
          headers={headers}>
          {({
            rows,
            headers,
            getHeaderProps,
            getRowProps,
            getSelectionProps,
            getToolbarProps,
            getBatchActionProps,
            onInputChange,
            selectedRows,
            getTableProps,
            getTableContainerProps,
          }) => {
            const batchActionProps = getBatchActionProps();

            return (
              <TableContainer
                style={{ width: '100%' }}
                title='Custom constraints'
                {...getTableContainerProps()}>
                <TableToolbar {...getToolbarProps()}>
                  <TableBatchActions {...batchActionProps}>
                    <TableBatchAction
                      tabIndex={
                        batchActionProps.shouldShowBatchActions ? 0 : -1
                      }
                      renderIcon={Delete}
                      onClick={() => {
                        setConstraints(
                          constraints.filter(
                            constraint =>
                              constraint.type === 'core' ||
                              !selectedRows
                                .map(row => row.id)
                                .includes(constraint.exercise)
                          )
                        );
                      }}>
                      Delete
                    </TableBatchAction>
                  </TableBatchActions>
                  <TableToolbarContent
                    aria-hidden={batchActionProps.shouldShowBatchActions}>
                    <TableToolbarSearch
                      persistent={true}
                      tabIndex={
                        batchActionProps.shouldShowBatchActions ? -1 : 0
                      }
                      onChange={onInputChange}
                    />
                    <Button
                      tabIndex={
                        batchActionProps.shouldShowBatchActions ? -1 : 0
                      }
                      size='small'
                      kind='primary'
                      onClick={() => {
                        setIsModalOpen(true);
                      }}>
                      Add new constraint
                    </Button>
                  </TableToolbarContent>
                </TableToolbar>
                <Table {...getTableProps()}>
                  <TableHead>
                    <TableRow>
                      <TableSelectAll {...getSelectionProps()} />
                      {headers.map((header, i) => (
                        <TableHeader key={i} {...getHeaderProps({ header })}>
                          {header.header}
                        </TableHeader>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.length ? (
                      rows.map((row, i) => (
                        <TableRow key={i} {...getRowProps({ row })}>
                          <TableSelectRow {...getSelectionProps({ row })} />
                          {row.cells.map(cell => (
                            <TableCell key={cell.id}>{cell.value}</TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={headers.length + 1}>
                          <div className='empty-state'>
                            <SvgEmptystateDefaultIcon className='empty-state-icon' />
                            <h3 className='empty-state-title'>
                              You currently have no custom constraints
                            </h3>
                            <p className='empty-state-text'>
                              Click on 'Add new constraint' to add one.
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            );
          }}
        </DataTable>
      </div>
    </>
  );
};
