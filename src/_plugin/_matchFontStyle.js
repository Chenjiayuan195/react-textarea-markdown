import * as React from "react";
import processString from "react-process-string";

function matchFontStyle ( props ){
	let newStr = props; 
	const regMap = {
			fontWeight:/\*\*.+\*\*/g,
			fontLean:/\*.+\*/g,
			fontLeanWeight:/\*\*\*.+\*\*\*/g,
			delete:/~~.+~~/g,
			url:/(\[.*\])(\(.+\))/g
		},
		config = [{
			regex:regMap.url,
			fn:( key,result ) => <a key={key} className="markdown-url-a" target="_blank" href={
				result[2].match( /(\()(.+(?=\)))/ )[0].split( " " )[0].split( "(" )[1]
			}
			title={
				result[2].match( /(\()(.+(?=\)))/ )[0].split( " " )[1]
					? result[2].match( /(\()(.+(?=\)))/ )[0].split( " " )[1].split( "\"" )[1] 
					: ""
			}>{matchFontStyle( result[1].match( /(\[).*(?=\])/ )[0].split( "[" )[1] )}</a>
		},{
			regex:regMap.fontLeanWeight,
			fn:( key,result ) => ( <strong key={key}>
				<em>{result[0].split( "***" )[1]}</em>
			</strong> ) 
		},{
			regex:regMap.fontWeight,
			fn:( key,result ) => <strong key={key}>{result[0].split( "**" )[1]}</strong>
		},{
			regex:regMap.fontLean,
			fn:( key,result ) => <em key={key}>{result[0].split( "*" )[1]}</em>
		},{
			regex:regMap.delete,
			fn:( key,result ) => <del key={key}>{result[0].split( "~~" )[1]}</del>
		}];
	return processString( config )( newStr );
}

export default matchFontStyle;