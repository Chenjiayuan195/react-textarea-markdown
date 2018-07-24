import * as React from "react";
import PropTypes from "prop-types";
import toHtmlElement from "../_plugin/_translate";
import ob from "../_plugin/_PubSub";


export default class Content extends React.Component{
	constructor ( props ){
		super( props );
		this.state = {
			nodeList:this.props ? this.transferred( this.props ) : null
		};
	}
	componentWillReceiveProps ( nextProps ){
		let nodeList = this.transferred( nextProps );
		this.setState( {nodeList} );
	}
	transferred ( nextProps ){
		if( !nextProps.StrList ){
			return;
		}
		let current = nextProps.StrList.head,
			nodeList = [],
			index = 0,
			keyQueue = [];
		ob.subscribe( "preNodeChange",( key ) => {
			keyQueue.push( key );
		} );
		while( current ){
			if( !current.hasTrans ){
				nodeList.push( toHtmlElement( current,index ) );
			}
			current = current.next;
			index++;
		}
		nodeList = nodeList.reduce( ( pre,cur ) => {
			for( let i = 0,l = keyQueue.length;i < l;i++ ){
				if( cur.key == keyQueue[i] ){
					return pre;
				}
			}
			pre.push( cur );
			return pre;
		},[] );
		return nodeList;
	}
	
	render (){
		return (
			<div className="markdown-div">{this.state.nodeList}</div>
		);
	}
}

Content.propTypes = {
	source: PropTypes.object
};