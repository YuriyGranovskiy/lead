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

function makeId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 11; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

class NoteList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editable: null,
            templateEditable: false,
            items: readNotesFromFile()
        };
    };

    saveNotes(id, value) {
        let data = readNotesFromFile();
        if (id == null) {
            data.unshift({ "id": makeId(), "text": value })
        }
        else {
            data.forEach(function (item, i) {
                if (item.id === id) {
                    data[i] = { "id": id, "text": value }
                }
            });
        }

        let path = 'notes.json';
        fs.openSync(path, 'r+');
        fs.writeFileSync(path, JSON.stringify(data));
        this.toggleEditing(null);
        this.setState({
            editing: null,
            templateEditable: false,
            items: readNotesFromFile()
        });
    };

    toggleEditing(itemId) {
        this.setState({ editing: itemId });
    };

    setTemplateEditing() {
        this.setState({ templateEditable: true });
    };

    createTemplateItem() {
        if (this.state.templateEditable) {
            return (<div
                className="neutral-note"
                style={{ padding: 10 }}
                contentEditable="true"
                suppressContentEditableWarning="true"
                onBlur={evt => this.saveNotes(null, evt.target.firstChild.data)}
            >
            </div>);
        }
        else {
            return (<div
                className="empty-note"
                style={{ padding: 10 }}
                onClick={this.setTemplateEditing.bind(this)}>
                Enter your notes
            </div>);
        }
    };

    renderItemOrEditField(item) {
        if (this.state.editing === item.id) {
            return (<div style={{ padding: 10 }}
                contentEditable="true"
                suppressContentEditableWarning="true"
                key={item.id}
                className="neutral-note"
                id={item.id}
                onBlur={evt => this.saveNotes(item.id, evt.target.firstChild.data)}>
                {item.text}
            </div>);
        }
        else {
            return (<div style={{ padding: 10 }}
                onClick={this.toggleEditing.bind(this, item.id)}
                key={item.id}
                className="neutral-note">
                {item.text}
            </div>);
        }
    };
    render() {
        return (
            <div>
                {this.createTemplateItem()}
                {this.state.items.map((item) => {
                    return this.renderItemOrEditField(item);
                })}
            </div>);
    };
};

ReactDOM.render(<NoteList />, document.getElementById('content'));
