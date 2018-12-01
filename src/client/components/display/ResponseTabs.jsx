import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedDark } from 'react-syntax-highlighter/styles/hljs';
import pretty from 'pretty';

import * as actions from '../../actions/actions';

import Tab from './Tab.jsx';
import SSERow from './SSERow.jsx';
import ResponsePlain from './ResponsePlain.jsx';

const mapStateToProps = store => ({ store });
const mapDispatchToProps = dispatch => ({});

class ResponseTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openTabs: '',
    };
    this.handleTabSelect = this.handleTabSelect.bind(this);
  }

  componentDidMount() {
    this.handleTabSelect('Events');
  }

  handleTabSelect(val) {
    switch (val) {
      case 'Cookies':
        this.setState({
          openTabs: val,
        });
        break;
      case 'Headers':
        this.setState({
          openTabs: val,
        });
        break;
      case 'Events':
        this.setState({
          openTabs: val,
        });
        break;
      default:
        // console.log(`There was an error with ${val}`);
    }
  }

  render() {
    const events = 'Events';
    // let cookies = "Cookies";
    const headers = 'Headers';
    const tabContentShownEvents = [];
    let tabContentShown;

    // Step 1  - Locate responses from store add them to cache array
    const responsesCache = [];
    responsesCache.push(this.props);

    // Step 2  - Increment across all responses in array
    responsesCache.forEach((cur, idx) => {
      const responseEvents = cur.responseContent.events;
      const responseHeaders = cur.responseContent.headers;
      if (responseHeaders) {
        const responseContentType = responseHeaders['content-type'];

        let tabState = this.state.openTabs;

        // console.log('CURRENT OBJ', cur);
        // console.log('~~~~~~RE', responseEvents);
        // console.log('~~~~~~RH', responseHeaders);
        // console.log('~~~~~~RCT', responseContentType);
        // console.log('~~~~~~TABSTATE', tabState);

        // Step 3  - Check content type of each response
        if (tabState === 'Events') { 
          switch (responseContentType) {
            case 'text/event-stream':
              responseEvents.forEach((cur, idx) => {
                tabContentShownEvents.push(<SSERow key={idx} content={cur} />);
              });
              break;
            case 'text/event-stream; charset=utf-8':
              responseEvents.forEach((cur, idx) => {
                tabContentShownEvents.push(<SSERow key={idx} content={cur} />);
              });
              break;
            case 'text/html; charset=UTF-8':
              // console.log('single response');
              responseEvents.forEach((cur, idx) => {
                tabContentShownEvents.push(
                  <SyntaxHighlighter key={idx} language="htmlbars" style={solarizedDark}>
                    {pretty(cur, { ocd: true })}
                  </SyntaxHighlighter>,
                );
              });
              break;
            default:
          }
        }
        else if (this.state.openTabs === 'Headers') {
          const headerObj = this.props.responseContent.headers;
          if (!Array.isArray(headerObj) && headerObj) {
            for (const key in headerObj) {
              if (!Array.isArray(cur)) {
                tabContentShownEvents.push(
                  <div className="nested-grid-2">
                    <span className="tertiary-title title_offset">{key}</span>
                    <span className="tertiary-title title_offset">
                      {headerObj[key]}
                    </span>
                  </div>,
                );
              }
            }
          }
        }
      }
    });

    return (
      <div>
        <ul className="tab_list">
          <Tab onTabSelected={this.handleTabSelect} tabName={events} />
          {/* <Tab onTabSelected={this.handleTabSelect} tabName={cookies} /> */}
          <Tab onTabSelected={this.handleTabSelect} tabName={headers} />
        </ul>
        <div className="tab_content">{tabContentShownEvents}</div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ResponseTabs);