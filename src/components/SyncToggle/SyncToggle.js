import { useEffect, useState } from 'react';
import ToggleButton from 'react-toggle-button';
import { setRemoteUser, setupReplication, teardownReplication } from 'trace-search';
import Auth from '@aws-amplify/auth';

function SyncToggle() {
  const [replicate, setReplicate] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await Auth.currentUserPoolUser();
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
      }
    })();
  });

  // Setup replication
  useEffect(() => {
    async function handleReplication() {
      if (!isLoggedIn && replicate) {
        alert('You must sign in to use sync!');
        setReplicate(false);
        return;
      }

      if (replicate) {
        try {
          await setRemoteUser(await Auth.currentUserPoolUser());

          const obj = await setupReplication();
          const replicator = obj.TODO_replication;

          replicator.on('error', e => {
            alert(`Replication error: ${e.message || e}`);
            console.error(e);
            setReplicate(false);
          });
        } catch (e) {
          alert(`Replication error: ${e.message || e}`);
          console.error(e);
          setReplicate(false);
          return;
        }
      } else {
        try {
          await teardownReplication();
        } catch (e) {
          console.error(e);
          return;
        }
      }
    }
    handleReplication();
  }, [replicate, isLoggedIn]);

  return (
    <div style={{ textAlign: 'center' }}>
      Sync
      <ToggleButton
        inactiveLabel={<span>Off</span>}
        activeLabel={<span>On</span>}
        value={replicate || false}
        onToggle={() => setReplicate(prev => !prev)}
      />
    </div>
  );
}

export default SyncToggle;
