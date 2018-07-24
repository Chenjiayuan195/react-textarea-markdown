import * as React from "react";
import PropTypes from "prop-types";
import linkedList from "../_plugin/_linkedList";
import Content from "./Content";


export default class MarkShow extends React.Component {
	constructor ( props ){
		super( props );
		this.state = {
            linked:this.props 
            ? this.lineList( this.props ) 
            : null
		};
	}
	componentWillReceiveProps ( nextProps ){
		let linked = this.lineList( nextProps );
		this.setState( {linked} );
	}
	lineList = ( nextProps ) => {
		const StringArr = nextProps.source.split( "\n" );
		const linked = new linkedList();
		StringArr.forEach( string => {
			linked.insert( string );
		} );
		return linked;
	}

	render () {
		return (
			<Content StrList={this.state.linked}/>
		);
	}
}

MarkShow.propTypes = {
	source: PropTypes.string
};