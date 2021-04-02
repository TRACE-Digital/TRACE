import React, { useEffect, useState } from 'react';
import { Button } from 'reactstrap';
import { SearchDefinition } from 'trace-search';
import './History.css';

const History = (props) => {
  const [maxVisible, setMaxVisible] = useState(props.initialMax);
  const [sortedHistory, setSortedHistory] = useState([]);

  const sortHistory = () => {
    const items = Object.values(SearchDefinition.cache.items);
    items.sort((a, b) => {
      if (a.lastEditedAt < b.lastEditedAt) return 1;
      if (a.lastEditedAt > b.lastEditedAt) return -1;
      return 0;
    });
    setSortedHistory(items);
  }

  useEffect(() => {
    const loadHistory = async () => {
      try {
        // Load what we need from the database into memory
        await SearchDefinition.loadAll();
      } catch (e) {
        console.error('Failed to load history from the database!');
        console.error(e);
      }

      sortHistory();
      SearchDefinition.cache.events.on('change', sortHistory);
    };

    loadHistory();

    const cleanup = () => {
      SearchDefinition.cache.events.removeListener('change', sortHistory);
    };

    return cleanup;
  }, []);

  return (
    <>
      <div className='dropdownVis history'>
        <h3>Recent Searches</h3>

        {sortedHistory.length === 0 && <h4>None yet!</h4>}
        {sortedHistory.slice(0, maxVisible).map((definition) => {
          return (
            <div key={definition.id}>
              <Button
                style={{ textAlign: 'left', width: '100%' }}
                onClick={() => props.onSelect(definition.lastRun)}
              >

              <h4>
                {definition.name} – {definition.lastEditedAt.toLocaleDateString()} {definition.lastEditedAt.toLocaleTimeString()} – {definition.lastRun?.results.length || 0} results
              </h4>

              <p>User names:   {definition.userNames.slice(0, 5).join(', ')}</p>

              </Button>
            </div>
          );
        })}

        {maxVisible < sortedHistory.length &&
          <Button onClick={() => setMaxVisible(prev => Math.min(prev + 5, sortedHistory.length))}>
            Load More
          </Button>
        }
      </div>
    </>
  );
};

History.defaultProps = {
  initialMax: 5,
  onSelect: () => {},
}

export default History;
