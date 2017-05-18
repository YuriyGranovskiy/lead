require('../less/main.less');
'use strict';

require('fs');

import React from 'react';
import ReactDOM from 'react-dom';
import fs from 'fs';

function getData() {
    let path = 'notes.json';
    fs.openSync(path, 'r+');
    let data = fs.readFileSync(path);
    return JSON.parse(data);
}

class NoteList extends React.Component {
    renderItemOrEditField(item) {
        return (<li style={{padding: 10}}
            key={item.id}
            className="list-group-item">
            {item.text}
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

ReactDOM.render(<NoteList items={getData()} />, document.getElementById('note-list'));
