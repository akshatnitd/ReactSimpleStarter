import React , { Component } from 'react';
import ReactDOM from 'react-dom';
import YTSearch from 'youtube-api-search';

import VideoList from './components/VideoList';
import VideoDetail from './components/VideoDetail';
import axios from 'axios';
import _ from 'lodash';

const API_KEY = 'AIzaSyAdCWoFmz-UIioVjVV_ipNoPlHsNoaYCcI';
const ROOT_URL = 'https://www.googleapis.com/youtube/v3/search';

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			selectedVideo: null,
			videos : [],
            nextToken: '',
            term: ''
		};
	};

	componentDidMount() {
		this.videoSearch('surfboard');
	}

	videoSearch = (term) => {

        let params = {
            part: 'snippet',
            key: API_KEY,
            q: term,
            type: 'video'
        };
        if(this.state.nextToken) {
            params.pageToken = this.state.nextToken;
        } else if(params["pageToken"]) {
            delete params.pageToken;
        }

        console.log(params);



	   axios.get(ROOT_URL, { params: params })
	    .then( (response) => {
          this.setState(prevState =>({
                videos : [...prevState.videos, ...response.data.items],
                nextToken: response.data.nextPageToken
            }));
	    })
        .then(() => {
            this.setState({
               selectedVideo: this.state.videos[0],
            });
        })
	    .catch(function(error) {
	      console.error(error);
	    });
	}

	render() {
        const videoSearch = _.debounce((term) => {
            this.setState({term});
            this.videoSearch(term)
        }, 300);
		return (
			<div>
				<div className="search-bar">
                <input
                    value={this.state.term}
                    onChange={event => videoSearch(event.target.value)}
                    />
                </div>
				<VideoDetail video={this.state.selectedVideo} />
				<VideoList
					onVideoSelect={ selectedVideo => this.setState({selectedVideo})}
					videos={this.state.videos} />
                <button onClick={event => videoSearch(this.state.term)} className="btn btn-primary">More</button>
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('container'));