import { useEffect, useState } from 'react';
import { Tab, Tabs } from 'carbon-components-react';

import { CustomConstraintsEditor } from './routes/CustomConstraintsEditor/CustomConstraintsEditor';
import { MovementTracker } from './routes/MovementTracker/MovementTracker';
import { allCoreConstraints } from './constraints';
import './App.css';
import spotterLogo from './assets/spotter-logo.png';

const App = () => {
  const [constraints, setConstraints] = useState([]);

  // Initialize constraints with all core constraints.
  // NOTE: In the future, initialize all constraints saved in local storage here.
  useEffect(() => {
    setConstraints(allCoreConstraints);
  }, []);

  return (
    <div className='App'>
      <img className='spotter-logo' src={spotterLogo} alt='spotter' />
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
