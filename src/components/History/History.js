import React, { useEffect, useState } from 'react';
import { Button } from 'reactstrap';
import { Search, SearchDefinition, SearchState } from 'trace-search';
import './History.css';

const History = (props) => {
  const [maxVisible, setMaxVisible] = useState(props.initialMax);
  const [sortedHistory, setSortedHistory] = useState([]);

  const sortHistory = () => {
    const definitions = Object.values(SearchDefinition.cache.items);

    let executions = [];
    for (const def of definitions) {
      executions = executions.concat(def.history);
    }

    executions.sort((a, b) => {
      if (a.startedAt < b.startedAt) return 1;
      if (a.startedAt > b.startedAt) return -1;
      return 0;
    });
    console.log(executions)
    setSortedHistory(executions);
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
        {sortedHistory.slice(0, maxVisible).map((execution) => {
          return (
            <HistoryObject execution={execution}/>
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

const HistoryObject = (props) => {

  const execution = props.execution;

  const name = execution.definition.name;
  // If state is CREATED, user probably refreshed or did something unintended. Mark as COMPLETED for now.
  const state = (execution.state !== SearchState.CREATED) ? execution.state : SearchState.COMPLETED;
  
  const startDate = execution.startedAt?.toLocaleDateString();
  const startTime = execution.startedAt?.toLocaleTimeString();
  const numResults = execution.results.length;

  return (
    <div key={execution.id}>
    <Button
      style={{ textAlign: 'left', width: '100%' }}
      onClick={() => props.onSelect(execution)}
    >

    <h4>
      {name} – {state} {startDate} {startTime} – {numResults} results
    </h4>

    <p>User names:   {execution.definition.userNames.slice(0, 5).join(', ')}</p>

    </Button>
  </div>
  );
}

export default History;
