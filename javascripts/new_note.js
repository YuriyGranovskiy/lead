'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

export class NewNote extends React.Component {
    componentDidUpdate(prevProps, prevState) {
        if (this.editableEntry) {
            this.editableEntry.focus();
        }
    }

    render() {
        if (this.props.isEditable) {
            return (<div
                ref={(editableEntry) => { this.editableEntry = editableEntry; }}
                className="selected-note"
                style={{ padding: 10 }}
                contentEditable="true"
                suppressContentEditableWarning="true"
                onBlur={this.props.onBlur}
            >
            </div>);
        }
        else {
            return (<div
                className="empty-note"
                style={{ margin: 10 }}
                onClick={this.props.onClick}>
                Enter your notes
            </div>);
        }
    }
}