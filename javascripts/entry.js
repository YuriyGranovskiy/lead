require('../less/main.less');
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

class NoteList extends React.Component {
    renderItemOrEditField(item) {
        return (<li
            key={item.id}
            className="list-group-item">
            {item.value}
        </li>);
    };
    render() {
        return (<ul className="list-group" style={{ listStyleType: "none" }}>{this.props.items.map((item) => {
            return this.renderItemOrEditField(item);
        })}</ul>);
    };
};

ReactDOM.render(<div className="myDiv"><div>Enter your notes</div>
    <div id="note-list"></div></div>, document.getElementById('content'));

ReactDOM.render(<NoteList items={[{ id: 1, value: "Value1" }, { id: 2, value: "Value2" }]} />, document.getElementById('note-list'));
