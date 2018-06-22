import React , { Component } from 'react';
import ReactDOM from 'react-dom';
import YTSearch from 'youtube-api-search';
import SearchBar from './components/SearchBar';
import VideoList from './components/VideoList';
import VideoDetail from './components/VideoDetail';
import _ from 'lodash';

const API_KEY = 'AIzaSyAdCWoFmz-UIioVjVV_ipNoPlHsNoaYCcI';

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			selectedVideo: null,
			videos : []
		};
	};

	componentDidMount() {
		this.videoSearch('surfboard');
	}

	videoSearch = (term) => {
		YTSearch( {key :'AIzaSyAdCWoFmz-UIioVjVV_ipNoPlHsNoaYCcI', term : term }, (videos) => {
			this.setState({
				videos : videos,
				selectedVideo: videos[0]
			});
		});
	}

	render() {
		const videoSearch = _.debounce((term) => { this.videoSearch(term) }, 300);
		return (
			<div>
				<SearchBar onSearchTermChange={videoSearch}/>
				<VideoDetail video={this.state.selectedVideo} />
				<VideoList
					onVideoSelect={ selectedVideo => this.setState({selectedVideo})}
					videos={this.state.videos} />
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('container'));