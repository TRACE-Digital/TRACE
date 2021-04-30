import { useEffect, useState } from "react";
import { Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import { Search, SearchState, ThirdPartyAccount } from "trace-search";

function NowPlayingSearch() {
  const [, setPlsRender] = useState(false);

  const getInProgressSearches = () => {
    return Object.values(Search.cache.items)
      .filter(search => search.state === SearchState.IN_PROGRESS)
      .sort((a, b) => a.id.localeCompare(b.id));
  }

  useEffect(() => {
    const triggerRender = () => setPlsRender(prev => !prev);
    const handleUnload = (e) => {
      if (getInProgressSearches().length > 0) {
        console.warn('Leaving page with searches in progress!');
        const msg = 'There are searches in progress! Are you sure you want to leave the page?';
        (e || window.event).returnValue = msg;
        return msg;
      }
    }

    window.addEventListener('beforeunload', handleUnload);

    Search.cache.events.on('change', triggerRender);
    ThirdPartyAccount.resultCache.events.on('change', triggerRender);
    const interval = setInterval(triggerRender, 60 * 1000);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      Search.cache.events.removeListener('change', triggerRender);
      ThirdPartyAccount.resultCache.events.removeListener('change', triggerRender);
      clearInterval(interval);
    }
  }, []);

  const onSearchPage = window.location.href.includes('/search');

  return (
    <div style={{ position: 'absolute', width: '100%', bottom: '0', margin: 'auto' }}>
      {!onSearchPage && getInProgressSearches().slice(0, 2).map(search => (
        <div key={search.id} style={{ width: '90%', margin: 'auto' }}>
          <Link to={`/search#${search.id}`} style={{ color: 'inherit' }}>
            <Card>
              <CardBody>
                <h4>{search.definition.name}</h4>
                <div>State: {search.state}</div>
                <div>Elapsed: {Math.round((new Date() - search.startedAt) / 1000 / 60)} minutes</div>
                <div>Results: {search.results.length}</div>
              </CardBody>
            </Card>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default NowPlayingSearch;
