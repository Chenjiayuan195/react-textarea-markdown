import * as React from "react";
import processString from "react-process-string";

function matchColor ( props ){
	let newStr = props; 
	const regMap = {
			pink:/(function|document|let|var|const|if|do|while|swich|break|continue|Symbol|return|import|export|default|for|from|case|this|catch|instanceof|try|interface|as)(?![a-zA-Z0-9])/g,
			red:/(function)(\s*\S*)\b/g,
			blue:/(<[/]*)([\s*[a-zA-Z0-9]+)(?=[>\s])/g,
			gray1:/\/\/.*/g,
			gray2:/\/\*.*\*\//g,
			yellow:/[&!|@$^?~]/g,
			lightblue1:/[\w]+\s*(?==)/g,
			lightblue2:/[\w]+(?=.)/g,
			orange1:/[\w]+\s*(?=:)/g,
			orange2:/["'`]\s*.+\s*["'`]/g,

		},
		config = [{
			regex:regMap.red,
			fn:( key,result ) => [result[1],<span className="markdown-red" key={key}>{result[2]}</span>] 
		},{
			regex:regMap.pink,
			fn:( key,result ) => [<span className="markdown-pink" key={key}>{result[1]}</span>]
		},{
			regex:regMap.blue,
			fn:( key,result ) => [result[1],
				<span className="markdown-blue" key={key}>{result[2]}</span>,
				result[3]]
		},{
			regex:regMap.gray1,
			fn:( key,result ) => <span className="markdown-gray" key={key}>{result}</span>
		},{
			regex:regMap.gray2,
			fn:( key,result ) => <span className="markdown-gray" key={key}>{result}</span>
		},{
			regex:regMap.yellow,
			fn:( key,result ) => <span className="markdown-yellow" key={key}>{result}</span>
		},{
			regex:regMap.lightblue1,
			fn:( key,result ) => <span className="markdown-lightblue" key={key}>{result}</span>
		},{
			regex:regMap.orange1,
			fn:( key,result ) => <span className="markdown-orange" key={key}>{result}</span>
		},{
			regex:regMap.orange2,
			fn:( key,result ) => <span className="markdown-orange" key={key}>{result}</span>
		},{
			regex:regMap.lightblue2,
			fn:( key,result ) => <span className="markdown-lightblue" key={key}>{result}</span>
		}];
	return processString( config )( newStr );
}

export default matchColor;