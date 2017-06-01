require('../less/main.less');
'use strict';

require('fs');

import React from 'react';
import ReactDOM from 'react-dom';
import fs from 'fs';
import os from 'os';

function readNotesFromFile() {
    let path = os.homedir() + '/.lead/notes.json';
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
            if (value) {
                data.unshift({ "id": makeId(), "text": value, "date": new Date() });
            }
        }
        else {
            data.forEach(function (item, i) {
                if (item.id === id) {
                    if (value) {
                        data[i] = { "id": id, "text": value , "date": data[i].date};
                    } else {
                        data.splice(i, 1);
                    }
                }
            });
        }

        let path = os.homedir() + '/.lead/notes.json';
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
                className="selected-note"
                style={{ padding: 10 }}
                contentEditable="true"
                suppressContentEditableWarning="true"
                onBlur={evt => this.saveNotes(null, evt.target.firstChild ? evt.target.firstChild.data : null)}
            >
            </div>);
        }
        else {
            return (<div
                className="empty-note"
                style={{ margin: 10 }}
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
                className="selected-note"
                id={item.id}
                onBlur={evt => this.saveNotes(item.id, evt.target.firstChild ? evt.target.firstChild.data : null)}>
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
