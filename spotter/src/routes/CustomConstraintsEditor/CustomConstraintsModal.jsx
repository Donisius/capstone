import { useEffect, useState } from 'react';
import { POSE_LANDMARKS } from '@mediapipe/pose';
import {
  Button,
  ComposedModal,
  ComboBox,
  ModalHeader,
  ModalFooter,
  ModalBody,
  TextInput,
  Dropdown,
} from 'carbon-components-react';
import {
  Delete16 as Delete,
  Save16 as Save,
  Add16 as Add,
} from '@carbon/icons-react';

import './CustomConstraintsModal.css';
import { generateMeetsRestrictionsFunc } from '../../utils/generateMeetsRestrictionsFunc';

const items = Object.keys(POSE_LANDMARKS);

// Used to generate unique ids.
let counter = 0;

export const CustomConstraintsModal = ({
  isOpen,
  setIsModalOpen,
  constraint,
  constraints,
  setConstraints,
  setSelectedConstraint,
}) => {
  const [restrictions, setRestrictions] = useState([]);
  const [constraintName, setConstraintName] = useState('');

  useEffect(() => {
    if (constraint && constraint.type === 'custom') {
      setRestrictions(constraint.restrictions);
      setConstraintName(constraint.exercise);
    }
  }, constraint);

  const handleAddRestriction = () => {
    setRestrictions([
      ...restrictions,
      { landmark1: null, operation: null, landmark2: null, result: null },
    ]);
  };

  const handleSaveConstraint = () => {
    const dateAdded = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
    // Constraint was given, so update the existing constraint.
    if (constraint && constraint.type === 'custom') {
      setConstraints(
        constraints.map(c =>
          c === constraint
            ? {
                ...constraint,
                type: 'custom',
                exercise: constraintName,
                // Needed for editing in the future.
                restrictions,
                meetsRestrictions: generateMeetsRestrictionsFunc(restrictions),
                dateAdded,
              }
            : c
        )
      );
      // Constraint was not given, so add a new constraint.
    } else {
      setConstraints([
        ...constraints,
        {
          type: 'custom',
          exercise: constraintName,
          // Needed for editing in the future.
          restrictions,
          meetsRestrictions: generateMeetsRestrictionsFunc(restrictions),
          dateAdded,
        },
      ]);
    }
    handleClose();
  };

  const handleClose = () => {
    setRestrictions([]);
    setConstraintName('');
    setIsModalOpen(false);
    setSelectedConstraint(null);
  };

  return (
    <ComposedModal
      open={isOpen}
      onClose={() => {
        handleClose();
      }}
      size='lg'>
      <ModalHeader>
        <h3>Add/Edit constraint</h3>
        <Button
          className='add-restriction-btn'
          kind='ghost'
          renderIcon={Add}
          onClick={() => handleAddRestriction()}>
          Add another restriction
        </Button>
      </ModalHeader>
      <ModalBody hasForm style={{ height: '60vh' }}>
        <TextInput
          labelText='Constraint name'
          placeholder='What exercise is this for?'
          onBlur={ev => {
            setConstraintName(ev.target.value);
          }}
          style={{ width: '30%', marginBottom: '2rem' }}
          id={`name-${counter++}`}
        />
        {restrictions.map((restriction, i) => (
          <div className='restriction' key={`restriction-${counter++}`}>
            <div style={{ marginRight: '0.3rem' }}>
              <ComboBox
                light
                onChange={ev => {
                  setRestrictions(
                    restrictions.map((r, j) =>
                      i === j
                        ? { ...restriction, landmark1: ev.selectedItem }
                        : r
                    )
                  );
                }}
                selectedItem={restrictions[i].landmark1}
                id={`combobox-${counter++}`}
                items={items}
                placeholder='Landmark 1'
              />
            </div>
            <Dropdown
              style={{ width: '15rem', marginRight: '0.3rem' }}
              id={`dropdown-${counter++}`}
              onChange={ev => {
                setRestrictions(
                  restrictions.map((r, j) =>
                    i === j ? { ...restriction, operation: ev.selectedItem } : r
                  )
                );
              }}
              placeholder='Operation'
              selectedItem={restrictions[i].operation}
              items={['distance from', 'angle formed with']}></Dropdown>
            <div style={{ marginRight: '0.3rem' }}>
              <ComboBox
                light
                style={{ marginRight: '0.3rem' }}
                onChange={ev => {
                  setRestrictions(
                    restrictions.map((r, j) =>
                      i === j
                        ? { ...restriction, landmark2: ev.selectedItem }
                        : r
                    )
                  );
                }}
                selectedItem={restrictions[i].landmark2}
                id={`combobox-${counter++}`}
                items={items}
                placeholder='Landmark 2'
              />
            </div>
            <Dropdown
              style={{ width: '6rem', marginRight: '0.3rem' }}
              id={`dropdown-${counter++}`}
              onChange={ev => {
                setRestrictions(
                  restrictions.map((r, j) =>
                    i === j ? { ...restriction, equality: ev.selectedItem } : r
                  )
                );
              }}
              placeholder='Equality'
              selectedItem={restrictions[i].equality}
              items={['>', '>=', '<', '<=', '=']}></Dropdown>
            <TextInput
              placeholder='Result'
              onBlur={ev => {
                setRestrictions(
                  restrictions.map((r, j) =>
                    i === j ? { ...restriction, result: ev.target.value } : r
                  )
                );
              }}
              value={restrictions[i].result}
              id={`result-${counter++}`}
            />
            <Button
              renderIcon={Delete}
              onClick={() => {
                setRestrictions(restrictions.filter((_, j) => j != i));
              }}
              hasIconOnly
              kind='ghost'
              size='sm'
            />
          </div>
        ))}
      </ModalBody>
      <ModalFooter>
        <Button
          kind='secondary'
          onClick={() => {
            handleClose();
          }}>
          Cancel
        </Button>
        <Button
          kind='primary'
          onClick={() => {
            handleSaveConstraint();
          }}>
          Save
        </Button>
      </ModalFooter>
    </ComposedModal>
  );
};
