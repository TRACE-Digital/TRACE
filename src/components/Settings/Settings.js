import Auth from "@aws-amplify/auth";
import { useEffect, useState } from "react";
import { Badge, Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { getDb, getRemoteDb, setRemoteUser, exportToJson, exportToCsv } from "trace-search";

function Settings() {
  const [currentUser, setCurrentUser] = useState(null);
  const [localDbInfo, setLocalDbInfo] = useState(null);
  const [remoteDbInfo, setRemoteDbInfo] = useState(null);
  const [currentSettings, setCurrentSettings] = useState(null);

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
  }, []);

  const isChrome = window.navigator.userAgent.includes('Chrome');
  const isFirefox = window.navigator.userAgent.includes('Firefox');

  let extensionUrl = 'https://github.com/TRACE-Digital/TRACE-ext';
  if (isChrome) extensionUrl = 'https://chrome.google.com/webstore/detail/trace/klhmocgplcpemcdfeefpaikihedmikgk';
  if (isFirefox) extensionUrl = 'https://addons.mozilla.org/en-US/firefox/addon/trace-digital/';

  const downloadJson = async () => {
    const text = await exportToJson();
    openBlob(text);
  };

  const downloadCsv = async () => {
    const text = await exportToCsv();
    openBlob(text);
  };

  const openBlob = (text) => {
    const blob = new Blob([text], {
      type: "application/json;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);
    console.log(url);

    window.open(url, 'blank');
  };

  return (
    <div className="content" style={{ lineHeight: '2.3' }}>
      <div className="header">
        <h1>Settings</h1>
      </div>
      <Card>
        <CardHeader>TRACE</CardHeader>
        <CardBody>
          <Row>
            <Col>Account ID:</Col>
            <Col>{currentUser ? currentUser.attributes.sub : 'None (local only)'}</Col>
          </Row>
          <Row>
            <Col>Account name:</Col>
            <Col>{currentUser ? currentUser.attributes.email : 'None (local only)'}</Col>
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
              {localDbInfo && localDbInfo.doc_count + ' document' + (localDbInfo.doc_count > 1 ? 's' : '')}
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
              {remoteDbInfo && remoteDbInfo.doc_count + ' document' + (remoteDbInfo.doc_count > 1 ? 's' : '')}
            </Col>
          </Row>
          <Row>
            <Col>Export:</Col>
            <Col>
              <Badge href="#" color="primary" onClick={downloadJson}>Export to JSON</Badge>
              <Badge href="#" color="primary" onClick={downloadCsv}>Export to CSV</Badge>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  );
}

export default Settings;
