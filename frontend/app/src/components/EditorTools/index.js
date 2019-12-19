import React, { Component } from 'react';
import './style.scss';
import 'react-toggle/style.css';

import Toggle from 'react-toggle';
import { connect } from 'react-redux';

import * as StaticContentActions from '../../redux/staticcontent/actions';

class EditorTools extends Component {
    constructor(props) {
        super(props);

        this.state = {
            expanded: false
        };

        this.toggleExpand = this.toggleExpand.bind(this);
    }

    toggleExpand() {
        this.setState({
            expanded: !this.state.expanded
        });
    }

    render() {
        const { expanded } = this.state;
        const { editorMode, toggleEditorMode } = this.props;

        return (
            <div className={`EditorOverlay ${expanded ? 'EditorOverlay-expanded' : ''}`}>
                <div className="EditorOverlay--inner">
                    <p className="EditorOverlay--title" onClick={this.toggleExpand}>
                        Editor options
                    </p>
                    <div className="EditorOverlay--tools">
                        <div className="EditorOverlay--option">
                            <span>Editor mode</span>
                            <Toggle checked={editorMode} onChange={() => toggleEditorMode(!editorMode)} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    editorMode: state.staticContent.editorMode
});

const mapDispatchToProps = dispatch => ({
    toggleEditorMode: value => dispatch(StaticContentActions.toggleEditorMode(value))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditorTools);
