import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import { DataManipulator } from './DataManipulator';
import './Graph.css';

interface IProps {
  data: ServerRespond[],
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}
class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer');
  }

  componentDidMount() {
    // Get element from the DOM.
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;
    // changed the schema since we wanted to track their ratio 
    const schema = {
      price_abc: "string",
      price_def: "string",
      ratio: "float",
      upper_bound: "string",
      lower_bound: "string",
      trigger_alert: "float",
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      // Load the `table` in the `<perspective-viewer>` DOM reference.
      elem.load(this.table);
      elem.setAttribute('view', 'y_line');
      elem.setAttribute('row-pivots', '["timestamp"]');
      elem.setAttribute('columns', '["ratio", "lower_bound", "upper_bound", "trigger_alert"]'); //changed to emphasis the particular part
      elem.setAttribute('aggregates', JSON.stringify({
        price_abc: "avg",
      price_def: "avg",
      ratio: "avg",
      upper_bound: "avg",
      lower_bound: "avg",
      trigger_alert: "disnict count",
      }));
    }
  }

  componentDidUpdate() {
    if (this.table) {
      const row: Row = DataManipulator.generateRow(this.props.data);
      this.table.update([row]);
    }
  }
}

export default Graph;
