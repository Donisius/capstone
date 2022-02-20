import { useEffect, useState } from 'react';
import { Tab, Tabs } from 'carbon-components-react';

import { CustomConstraintsEditor } from './routes/CustomConstraintsEditor/CustomConstraintsEditor';
import { MovementTracker } from './routes/MovementTracker/MovementTracker';
import { allCoreConstraints } from './constraints';
import './App.css';

const App = () => {
  const [constraints, setConstraints] = useState([]);

  // Initialize constraints with all core constraints.
  // NOTE: In the future, initialize all constraints saved in local storage here.
  useEffect(() => {
    setConstraints(allCoreConstraints);
  }, []);

  return (
    <div className='App'>
      <h1 className='title'>Spotter</h1>
      <Tabs style={{ width: 'auto' }}>
        <Tab id='tracking' label='Track movements'>
          <MovementTracker constraints={constraints} />
        </Tab>
        <Tab id='constraints-editor' label='Custom constraints'>
          <CustomConstraintsEditor
            constraints={constraints}
            setConstraints={setConstraints}
          />
        </Tab>
      </Tabs>
    </div>
  );
};

export default App;
