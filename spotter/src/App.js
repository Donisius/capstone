import { useState } from 'react';
import { Tab, Tabs } from 'carbon-components-react';

import { ConstraintsEditor } from './components/ConstraintsEditor/ConstraintsEditor';
import { MovementTracker } from './components/MovementTracker/MovementTracker';
import './App.css';

const App = () => {
  const [constraints, setConstraints] = useState([]);

  return (
    <div className='App'>
      <h1 className='title'>Spotter</h1>
      <Tabs style={{ width: 'auto' }}>
        <Tab id='tracking' label='Track movements'>
          <MovementTracker constraints={constraints} />
        </Tab>
        <Tab id='constraints-editor' label='Edit constraints'>
          <ConstraintsEditor
            constraints={constraints}
            setConstraints={setConstraints}
          />
        </Tab>
      </Tabs>
    </div>
  );
};

export default App;
