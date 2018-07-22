import * as React from "react";
import PropTypes from "prop-types";
import MarkShow from "./markShow";

export default class Markdown extends React.Component{
	constructor ( props ){
		super( props );
		this.state = {
			text:""
		};
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.source){
            this.setState({text:nextProps.source});
        }
    }
    handleTab = (e) => {
        let node=e.target,
        position;
        if(e.keyCode==9){
            e.preventDefault();
            position=node.selectionStart+4;
            this.setState((preState)=>({
                text:preState.text.substr(0,node.selectionStart)+'    '+preState.text.substr(node.selectionStart)
            }),()=>{
                node.selectionStart=position;
                node.selectionEnd=position;
            })
        }
    }
    handleChange = (e) => {
        if(this.props.callback){
            this.props.callback(e.target.value);
        }
        this.setState({text:e.target.value});
    }
	render (){
        const hasTextArea=!!this.props.textarea;
        let markdown;
        if(hasTextArea){
            markdown=<div className='markdown-clearfloat'>
            <div className='markdown-textarea-div'>
                <textarea className="markdown-textarea" onKeyDown={this.handleTab} value={this.state.text} onChange={this.handleChange}></textarea>
            </div>
            <div className='markdown-show'>
                <MarkShow source={this.state.text}/>
            </div>
            </div>
        }else{
            markdown=<div className='markdown-show'>
            <MarkShow source={this.state.text}/>
        </div>
        }
		return markdown;
	}
}
Markdown.propTypes = {
    source: PropTypes.string,
    textarea:PropTypes.bool,
    callback:PropTypes.func
}