import React, { useEffect, useState } from "react";
import { SearchDefinition } from "trace-search";
import "./History.css";

const History = (props) => {
  const [plsRender, setPlsRender] = useState(false);

  useEffect(() => {
    const triggerRender = () => {
      setPlsRender((prev) => !prev);
    };

    const loadHistory = async () => {
      try {
        // Load what we need from the database into memory
        const res = await SearchDefinition.loadAll();
        console.log(res);
      } catch (e) {
        console.error("Failed to load history from the database!");
        console.error(e);
      }
      console.log(SearchDefinition.cache.items);
    };

    SearchDefinition.cache.events.on("change", triggerRender);

    loadHistory();

    const cleanup = () => {
      SearchDefinition.cache.events.removeListener("change", triggerRender);
    };

    return cleanup;
  }, []);

  return (
    <div>
      <ul className="dropdownVis history">
        <h1>HISTORY</h1>
        {Object.values(SearchDefinition.cache.items).map((item) => {
          return (
            <li>
              <p onClick={() => {}}> {item.userNames.join(", ")}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default History;
