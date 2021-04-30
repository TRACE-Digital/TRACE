import Auth from "@aws-amplify/auth";
import { useEffect, useState } from "react";
import { Badge, Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { destroyDb, destroyRemoteDb, getDb, getRemoteDb, setRemoteUser, exportToJson, exportToCsv } from "trace-search";

function Settings() {
  const [currentUser, setCurrentUser] = useState(null);
  const [localDbInfo, setLocalDbInfo] = useState(null);
  const [remoteDbInfo, setRemoteDbInfo] = useState(null);
  const [currentSettings, setCurrentSettings] = useState(null);
  const [refreshData, setRefreshData] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const user = await Auth.currentUserPoolUser();
        setCurrentUser(user);

        await setRemoteUser(user);
        const db = await getRemoteDb();
        const dbInfo = await db.info();

        setRemoteDbInfo(dbInfo);

      } catch (e) {
        console.error(e);
      }

      try {
        const db = await getDb();
        const dbInfo = await db.info();
        const settings = await db.get('settings');

        console.log(dbInfo);
        console.log(settings);

        setLocalDbInfo(dbInfo);
        setCurrentSettings(settings);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [refreshData]);

  const isChrome = window.navigator.userAgent.includes('Chrome');
  const isFirefox = window.navigator.userAgent.includes('Firefox');

  let extensionUrl = 'https://github.com/TRACE-Digital/TRACE-ext';
  if (isChrome) extensionUrl = 'https://chrome.google.com/webstore/detail/trace/klhmocgplcpemcdfeefpaikihedmikgk';
  if (isFirefox) extensionUrl = 'https://addons.mozilla.org/en-US/firefox/addon/trace-digital/';

  const downloadJson = async () => {
    const text = await exportToJson();
    openBlob(text, '.json', 'application/json');
  };

  const downloadCsv = async () => {
    const text = await exportToCsv();
    openBlob(text, '.csv', 'text/plain');
  };

  const openBlob = (text, extension, contentType) => {
    const fileName = `trace-${new Date().toJSON()}${extension}`;
    const props = { type: contentType };

    let blob;
    try {
      // Use File in newer browsers so we can specify a name
      blob = new File([text], fileName, props);
    } catch (e) {
      console.log(e);
      blob = new Blob([text], props);
    }

    const url = URL.createObjectURL(blob);
    console.log(url);

    // Trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.target = 'blank';
    link.click();

    // Also show the content
    window.open(url, 'blank');
  };

  const closeAccount = async () => {
    if (!window.confirm('Are you sure you want to permanently close your account? ALL account data will be deleted.')) {
      return;
    }

    await destroyDb();
    await destroyRemoteDb();

    try {
      const remoteDb = await getRemoteDb();
      const settings = {
        _id: 'settings',
        accountClosed: true
      };
      await remoteDb.put(settings);
    } catch (e) {
      alert(`Could not close account!\n${e}`);
    }

    setRefreshData(prev => !prev);

    await Auth.signOut();
    window.location.href = '/login';
  };

  const deleteLocalData = async () => {
    if (!confirmDelete()) {
      return;
    }

    try {
      await destroyDb();
    } catch (e) {
      alert(`Could not delete local data!\n${e}`);
    }

    setRefreshData(prev => !prev);
  };

  const deleteRemoteData = async () => {
    if (!confirmDelete()) {
      return;
    }

    try {
      if (currentUser) {
        await destroyRemoteDb();
      }
    } catch (e) {
      alert(`Could not delete remote data!\n${e}`);
    }

    setRefreshData(prev => !prev);
  };

  const confirmDelete = () => {
    const confirmation = window.confirm('Are you sure? This action is irreversible.');
    return confirmation;
  }

  return (
    <div className="content" style={{ lineHeight: '2.3' }}>
      <div className="header">
        <h1>Settings</h1>
      </div>
      <Card>
        <CardHeader>TRACE</CardHeader>
        <CardBody>
          <Row>
            <Col>Account name:</Col>
            <Col>{currentUser ? currentUser.attributes.email : 'None (local only)'}</Col>
          </Row>
          <Row>
            <Col>Account ID:</Col>
            <Col>{currentUser ? currentUser.attributes.sub : 'None (local only)'}</Col>
          </Row>
          <Row>
            <Col>Version:</Col>
            <Col>{currentSettings?.version}</Col>
          </Row>
          <Row>
            <Col>Browser extension:</Col>
            <Col>
              <a href={extensionUrl} target='blank'>
                {window.__TRACE_EXTENSION_HOOK__ ?
                  'v' + window.__TRACE_EXTENSION_HOOK__.getVersionStr() :
                  'Install the extension'
                }
              </a>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Your Data</CardHeader>
        <CardBody>
          <Row>
            <Col>Local data:</Col>
            <Col>
              {localDbInfo && localDbInfo.doc_count + ' document' + (localDbInfo.doc_count === 1 ? '' : 's')}
            </Col>
          </Row>
          <Row>
            <Col>Sync enabled:</Col>
            <Col>
              {currentSettings?.syncEnabled ? 'Yes' : 'No'}
            </Col>
          </Row>
          <Row>
            <Col>Remote data:</Col>
            <Col>
              {remoteDbInfo && remoteDbInfo.doc_count + ' document' + (remoteDbInfo.doc_count === 1 ? '' : 's')}
            </Col>
          </Row>
          <Row>
            <Col>Export:</Col>
            <Col>
              <Badge href="#" color="info" onClick={downloadJson}>Export to JSON</Badge>
              <Badge href="#" color="info" onClick={downloadCsv}>Export to CSV</Badge>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Danger Zone</CardHeader>
        <CardBody>
          <Row>
            <Col>Local data:</Col>
            <Col>
              <Badge href="#" color="danger" onClick={deleteLocalData}>Delete local data</Badge>
            </Col>
          </Row>
          {currentUser &&
          <>
            <Row>
              <Col>Remote data:</Col>
              <Col>
                <Badge href="#" color="danger" onClick={deleteRemoteData}>Delete remote data</Badge>
              </Col>
            </Row>
            <Row>
              <Col>Close your account:</Col>
              <Col>
                <Badge href="#" color="danger" onClick={closeAccount}>Close account</Badge>
              </Col>
            </Row>
          </>
          }
        </CardBody>
      </Card>
    </div>
  );
}

export default Settings;
