require('../less/main.less');
require('fs');

import React from 'react';
import ReactDOM from 'react-dom';
import fs from 'fs';
import os from 'os';
import {Note} from './note';
import {NewNote} from './new_note';

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

export class NoteList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editableItemId: null,
            newNoteIsEditable: false,
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
                        data[i] = { "id": id, "text": value, "date": data[i].date };
                    } else {
                        data.splice(i, 1);
                    }
                }
            });
        }

        let path = os.homedir() + '/.lead/notes.json';
        fs.openSync(path, 'r+');
        fs.writeFileSync(path, JSON.stringify(data));
        this.setState({
            editableItemId: null,
            newNoteIsEditable: false,
            items: readNotesFromFile()
        });
    };

    toggleEditableItem(itemId) {
        this.setState({ editableItemId: itemId });
    };

    setNewNoteEditable() {
        this.setState({
            editableItemId: null,
            newNoteIsEditable: true
        });
    };

    render() {
        var notes = this.state.items.map(function (item) {
            return <Note key={item.id}
                isEditable={this.state.editableItemId === item.id}
                item={item}
                onClick={this.toggleEditableItem.bind(this, item.id)}
                onBlur={evt => this.saveNotes(item.id, evt.target.firstChild ? evt.target.firstChild.data : null)} />;
        }.bind(this));

        return (
            <div>
                {<NewNote 
                    isEditable={this.state.newNoteIsEditable}
                    onClick={this.setNewNoteEditable.bind(this)} 
                    onBlur={evt => this.saveNotes(null, evt.target.firstChild ? evt.target.firstChild.data : null)} />}
                {notes}
            </div>);
    };
};