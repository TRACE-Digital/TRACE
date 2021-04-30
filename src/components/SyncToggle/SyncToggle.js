import { useEffect, useState, useRef } from 'react';
import ToggleButton from 'react-toggle-button';
import { getDb, setRemoteUser, enableSync, disableSync, teardownReplication } from 'trace-search';
import Auth from "@aws-amplify/auth";
import NotificationAlert from "react-notification-alert";

const getSyncEnabled = async () => {
  const db = await getDb();
  const settings = await db.get('settings');
  return settings.syncEnabled;
}

const setInitialSync = async (setIsLoggedIn, setSync) => {
  try {
    await Auth.currentUserPoolUser();

    setIsLoggedIn(true);
    setSync(await getSyncEnabled());
  }
  catch {
    setIsLoggedIn(false);
  }
};

function SyncToggle() {
  const [sync, setSync] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const notificationAlertRef = useRef(null);
  const toast = (message, type) => {
    var options = {};
    options = {
      place: "tc",
      message: (<span>{message}</span>),
      type: type,
      autoDismiss: 7,
    };
    notificationAlertRef.current.notificationAlert(options);
  }

  const permaToast = (message, type) => {
    var options = {};
    options = {
      place: "tc",
      message: (<span>{message}</span>),
      type: type,
      autoDismiss: -1,
    };
    notificationAlertRef.current.notificationAlert(options);
  }

  useEffect(() => {
    setInitialSync(setIsLoggedIn, setSync);

    // Wait for the initial log in to finish and check again
    setTimeout(() => {
      setInitialSync(setIsLoggedIn, setSync);
    }, 2000);

    // Prevent a replication error on reload
    const handleUnload = async () => { await teardownReplication(); }
    window.addEventListener('beforeunload', handleUnload)
    return () => { window.removeEventListener('beforeunload', handleUnload); }
  }, []);

  /** This is the user's actual intention. This is the only time disableSync should be called. */
  const handleToggle = async () => {
    // We're interested in the effect of the toggle
    // It hasn't happened yet
    const willSync = !sync;

    if (!isLoggedIn && willSync) {
      toast('You must sign in to use sync!', "danger");
      setSync(false);
      return;
    }

    if (!willSync) {
      try {
        console.log('Disabling sync');
        await disableSync();
        permaToast(`CAUTION: You are now editing locally. Your changes will not be synced!`, 'danger')
      } catch (e) {
        console.error(e);
        return;
      }
    }

    setSync(prev => !prev);
  }

  /** This changes frequently with errors, sign in/out, etc */
  useEffect(() => {
    (async () => {
      if (!isLoggedIn && sync) {
        toast('You must sign in to use sync!', "danger");
        setSync(false);
        return;
      }

      if (sync) {
        try {
          await setRemoteUser(await Auth.currentUserPoolUser());

          const obj = await enableSync();
          const replicator = obj.TODO_replication;

          replicator.on('error', (e) => {
            toast(`Replication error: ${e.message || e}`, "danger");
            console.error(e);
            setSync(false);
          });
        } catch (e) {
          toast(`Replication error: ${e.message || e}`, "danger");
          console.error(e);
          setSync(false);
          return;
        }
      } else {
        try {
          // Only tear down, don't disable
          // This isn't necessarily the user telling us to disable sync, just stop it
          // Could be page reload or an error
          await teardownReplication();
        } catch (e) {
          console.error(e);
          return;
        }
      }
    })();
  }, [sync, isLoggedIn]);

  return (
    <>
      <div className="react-notification-alert-container">
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <div style={{ textAlign: 'center' }}>
        Sync
          <ToggleButton
          inactiveLabel={<span>Off</span>}
          activeLabel={<span>On</span>}
          value={sync}
          onToggle={() => handleToggle()}
        />
      </div>
    </>
  );
}

export default SyncToggle;
