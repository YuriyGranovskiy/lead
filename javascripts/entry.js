require('../less/main.less');
'use strict';

require('fs');

import React from 'react';
import ReactDOM from 'react-dom';
import fs from 'fs';

function readNotesFromFile() {
    let path = 'notes.json';
    fs.openSync(path, 'r+');
    let data = fs.readFileSync(path);
    return JSON.parse(data);
};

class NoteList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editable: null,
            items: readNotesFromFile()
        };
    };

    saveNotes(id, value) {
        let data = readNotesFromFile();
        data.forEach(function(item, i) {
            if(item.id === id) {
                data[i] = {"id": id, "text": value}
            }
        });

        let path = 'notes.json';
        fs.openSync(path, 'r+');
        fs.writeFileSync(path, JSON.stringify(data));
        this.toggleEditing(null);
        this.state.items = readNotesFromFile();        
    };

    toggleEditing(itemId) {
        this.setState({ editing: itemId });
    };

    renderItemOrEditField(item) {
        if (this.state.editing === item.id) {
            return (<li style={{ padding: 10 }}
                key={item.id}
                className="list-group-item">
                <input 
                    id={item.id}
                    type="text"
                    defaultValue={item.text}
                    onBlur={evt => this.saveNotes(item.id, evt.target.value)}>
                </input>
                <input 
                    type="button" 
                    value="Save"
                    onClick={this.saveNotes.bind(this, item.id, item.text)}/>
            </li>);
        }
        else {
            return (<li style={{ padding: 10 }}
                onClick={this.toggleEditing.bind(this, item.id)}
                key={item.id}
                className="list-group-item">
                {item.text}
            </li>);
        }
    };
    render() {
        return (<ul className="list-group" style={{ listStyleType: "none" }}>{this.state.items.map((item) => {
            return this.renderItemOrEditField(item);
        })}</ul>);
    };
};

ReactDOM.render(<div className="myDiv"><div style={{ padding: 10 }}>Enter your notes</div>
    <div id="note-list"></div></div>, document.getElementById('content'));

ReactDOM.render(<NoteList />, document.getElementById('note-list'));
