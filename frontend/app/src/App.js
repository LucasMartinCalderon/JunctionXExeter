import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { connect } from 'react-redux';
import './App.scss';

import { updateStaticContent } from './redux/staticcontent/actions';
import { updateDynamicContent } from './redux/dynamiccontent/actions';

import Header from './components/Header';
import EditorTools from './components/EditorTools';

import HomePage from './pages/Home';
import burgerMenu from './components/Header';

class App extends Component {
    async componentDidMount() {
        this.props.updateStaticContent();
        this.props.updateDynamicContent();
    }

    render() {
        return (
            <Router>
                <div className="App">
                    <Header />
                    <main className="App--main">
                        <HomePage />
                    </main>
                    <EditorTools />
                </div>
            </Router>
        );
    }
}

export default connect(
    null,
    { updateStaticContent, updateDynamicContent }
)(App);
