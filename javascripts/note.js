require('../less/main.less');
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

export class Note extends React.Component {

    getBorderClassByDate(date) {
        var now = new Date();
        date = date ? new Date(date) : new Date();
        var diffHours = Math.ceil((now.getTime() - date.getTime())) / (1000 * 3600);
        if (diffHours < 3) {
            return "date-neutral"
        }

        if (diffHours < 12) {
            return "date-warn"
        }

        return "date-fire"
    }

    render() {
        let item = this.props.item;
        if (this.props.isEditable) {
            return (<div style={{ padding: 10 }}
                contentEditable="true"
                suppressContentEditableWarning="true"
                key={item.id}
                className={"selected-note " + this.getBorderClassByDate(item.date)}
                id={item.id}
                onBlur={this.props.onBlur}
            >
                {item.text}
            </div>);
        }
        else {
            return (<div style={{ padding: 10 }}
                onClick={this.props.onClick}
                key={item.id}
                className={"neutral-note " + this.getBorderClass(item.date)}>
                {item.text}
            </div>);
        }
    }
}