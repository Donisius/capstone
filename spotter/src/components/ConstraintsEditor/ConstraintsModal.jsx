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
import './ConstraintsModal.css';

const items = Object.keys(POSE_LANDMARKS);

// Used to generate unique ids.
let counter = 0;

export const ConstraintsModal = ({
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
    if (constraint) {
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
    if (constraint) {
      setConstraints(
        constraints.map((c) =>
          c === constraint
            ? {
                ...constraint,
                exercise: constraintName,
                restrictions,
                dateAdded,
              }
            : c
        )
      );
    } else {
      setConstraints([
        ...constraints,
        { exercise: constraintName, restrictions, dateAdded },
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
      size='lg'
    >
      <ModalHeader>
        <h3>Add/Edit constraint</h3>
        <Button
          className='add-restriction-btn'
          kind='ghost'
          renderIcon={Add}
          onClick={() => handleAddRestriction()}
        >
          Add another restriction
        </Button>
      </ModalHeader>
      <ModalBody hasForm style={{ height: '60vh' }}>
        <TextInput
          labelText='Constraint name'
          placeholder='What exercise is this for?'
          onBlur={(ev) => {
            setConstraintName(ev.target.value);
          }}
          style={{ width: '30%', marginBottom: '2rem' }}
          id={`name-${counter++}`}
        />
        {restrictions.map((restriction, i) => (
          <div className='restriction' key={`restriction-${counter++}`}>
            <ComboBox
              light
              onChange={(ev) => {
                setRestrictions(
                  restrictions.map((r, j) =>
                    i === j ? { ...restriction, landmark1: ev.selectedItem } : r
                  )
                );
              }}
              selectedItem={restrictions[i].landmark1}
              id={`combobox-${counter++}`}
              items={items}
              placeholder='Landmark 1'
            />
            <Dropdown
              style={{ width: '15rem' }}
              id={`dropdown-${counter++}`}
              onChange={(ev) => {
                setRestrictions(
                  restrictions.map((r, j) =>
                    i === j ? { ...restriction, operation: ev.selectedItem } : r
                  )
                );
              }}
              placeholder='Operation'
              selectedItem={restrictions[i].operation}
              items={['distance from', 'angle formed with']}
            ></Dropdown>
            <ComboBox
              light
              onChange={(ev) => {
                setRestrictions(
                  restrictions.map((r, j) =>
                    i === j ? { ...restriction, landmark2: ev.selectedItem } : r
                  )
                );
              }}
              selectedItem={restrictions[i].landmark2}
              id={`combobox-${counter++}`}
              items={items}
              placeholder='Landmark 2'
            />
            <div className='equal-sign'>=</div>
            <TextInput
              placeholder='Result'
              onBlur={(ev) => {
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
          }}
        >
          Cancel
        </Button>
        <Button
          kind='primary'
          onClick={() => {
            handleSaveConstraint();
          }}
        >
          Save
        </Button>
      </ModalFooter>
    </ComposedModal>
  );
};
