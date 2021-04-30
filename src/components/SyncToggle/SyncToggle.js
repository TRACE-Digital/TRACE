import { useEffect, useState, useRef } from 'react';
import ToggleButton from 'react-toggle-button';
import { setRemoteUser, setupReplication, teardownReplication } from 'trace-search';
import Auth from "@aws-amplify/auth";
import NotificationAlert from "react-notification-alert";

function SyncToggle() {
  const [replicate, setReplicate] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const notificationAlertRef = useRef(null);
  const toast = (message, type) => {
    var options = {};
    options = {
      place: "bc",
      message: (<span>{message}</span>),
      type: type,
      autoDismiss: 7,
    };
    notificationAlertRef.current.notificationAlert(options);
  }

  useEffect(() => {
    (async () => {
      try {
        await Auth.currentUserPoolUser();
        setIsLoggedIn(true);
      }
      catch {
        setIsLoggedIn(false);
      }
    })();
  });

  // Setup replication
  useEffect(() => {
    async function handleReplication() {
      if (!isLoggedIn && replicate) {
        toast('You must sign in to use sync!', "danger");
        setReplicate(false);
        return;
      }

      if (replicate) {
        try {
          await setRemoteUser(await Auth.currentUserPoolUser());

          const obj = await setupReplication();
          const replicator = obj.TODO_replication;

          replicator.on('error', (e) => {
            toast(`Replication error: ${e.message || e}`, "danger");
            console.error(e);
            setReplicate(false);
          });
        } catch(e) {
          toast(`Replication error: ${e.message || e}`, "danger");
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

  return(
    <>
      <div className="react-notification-alert-container">
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <div style={{ textAlign: 'center' }}>
        Sync
          <ToggleButton
            inactiveLabel={<span>Off</span>}
            activeLabel={<span>On</span>}
            value={replicate || false}
            onToggle={() => setReplicate(prev => !prev) }
            />
      </div>
    </>
  );
}

export default SyncToggle;
