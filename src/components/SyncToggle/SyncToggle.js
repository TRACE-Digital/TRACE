import { useEffect, useState } from 'react';
import ToggleButton from 'react-toggle-button';
import { setupReplication, teardownReplication } from 'trace-search';

function SyncToggle() {
  const [replicate, setReplicate] = useState(false);

  // Setup replication
  useEffect(() => {
    async function handleReplication() {
      if (replicate) {
        try {
          const obj = await setupReplication();
          const replicator = obj.TODO_replication;

          replicator.on('error', (e) => {
            alert(`Replication error!\n\n${e}`);
            console.error(e);
            setReplicate(false);
          });
        } catch(e) {
          alert(`Replication error!\n\n${e}`);
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
  }, [replicate]);

  return(
    <div style={{ textAlign: 'center' }}>
      Sync
        <ToggleButton
          inactiveLabel={<span>Off</span>}
          activeLabel={<span>On</span>}
          value={replicate || false}
          onToggle={() => setReplicate(prev => !prev) }
          />
    </div>
  );
}

export default SyncToggle;
