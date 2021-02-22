import React from "react";

// reactstrap components
import { Card, CardHeader, CardBody, CardTitle, Row, Col } from "reactstrap";

function Search() {
  return (
    <>
      <div className="content">
      <div class="modal modal-search fade show" role="dialog" tabindex="-1" >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                <input placeholder="SEARCH" type="text" class="form-control"/>
                  <button aria-label="Close" class="close">
                    <i class="tim-icons icon-simple-remove"></i>
                  </button>
              </h5>
                </div></div></div></div>
      </div>
    </>
  );
}

export default Search;
