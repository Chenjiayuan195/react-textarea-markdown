import * as React from "react";
import matchColor from "./_matchColor";
import matchFontstyle from "./_matchFontStyle";
import ob from "./_PubSub";

/*translate textarea to markdown*/
function toHtmlElement ( node,key ){
	let state,
		props = {
			node,
			key
		};
	state = FindTitle( props );
	if( state ) return state;
	state = FindCode( props );
	if( state ) return state;
	state = FindTable( props );
	if( state ) return state;
	state = FindCheckbox( props );
	if( state ) return state;
	state = FindList( props );
	if( state ) return state;
	state = FindNumList( props );
	if( state ) return state;
	state = FindGuide( props );
	if( state ) return state;
	state = FindLine( props );
	if( state ) return state;
	state = FindImage( props );
	if( state ) return state;
	return <p key={key}>{matchFontstyle( node.value )}</p>;

}

/*search # */
function FindTitle ( {node,key} ){
	let val = node.value,
		index,
		reg = /^[\s]*[#]{1,6}/,
		firstTab,
		string;

	index = val.search( reg );
	if( index == -1 ) return false;
	firstTab = val.match( reg )[0].trim(),
	string = val.split( reg )[1];
	node.hasTrans = true;
	switch( firstTab ){
	case "#":
		return <h1 key={key}  className='markdown-h'>{matchFontstyle( string )}</h1>;
	case "##":
		return <h2 key={key}  className='markdown-h'>{matchFontstyle( string )}</h2>;
	case "###":
		return <h3 key={key}  className='markdown-h'>{matchFontstyle( string )}</h3>;
	case "####":
		return <h4 key={key}  className='markdown-h'>{matchFontstyle( string )}</h4>;
	case "#####":
		return <h5 key={key}  className='markdown-h'>{matchFontstyle( string )}</h5>;
	case "######":
		return <h6 key={key}  className='markdown-h'>{matchFontstyle( string )}</h6>;
	default:
		return false;
	}
}

/*search ```*/
function FindCode ( {node,key} ){
	let val = node.value,
		content = [],
		current = node.next,
		index = 0;
	if( val.search( /^`{3}/ ) != -1 ){
		node.hasTrans = true;
		while( current ){
			if( current.value.search( /^`{3}/ ) != -1 ){
				current.hasTrans = true;
				break;
			}
			content.push( <p key={key + index}>{matchColor( current.value )}</p> );
			current.hasTrans = true;
			current = current.next;
			index++;
		}
		return ( <pre className='markdown-pre' key={key}>
			<code className='markdown-code'>{
				content
			}</code>
		</pre> );
	}
	return false;
}

/*search table*/
function FindTable ( {node,key} ){
	let val = node.value,
		isTable = val.search( /^(\|[\s]*:?[-]+):?[\s]*\|/ ) != -1,
		tableArr = [],
		headerTh = [],
		bodyTh = [],
		fontPos = [],
		preNode = node.pre;
	if( isTable ){
		tableArr = val.split( "|" );
		for( let i = 0,l = tableArr.length;i < l;i++ ){
			if( i != 0 && i != l - 1 && tableArr[i].search( /^([\s]*:?[-]+:?[\s]*)$/ ) == -1 ){
				return false;
			}else{
				tableArr[i].search( /^([\s]*:[-]+:[\s]*)$/ ) != -1 && fontPos.push( "center" );
				tableArr[i].search( /^([\s]*[-]+:[\s]*)$/ ) != -1 && fontPos.push( "right" );
				tableArr[i].search( /^([\s]*[:]*[-]+[\s]*)$/ ) != -1 && fontPos.push( "left" );
			}
		}
	}else{
		return false;
	}
	if( preNode && !preNode.hasTrans ){
		headerTh = tableForOtherNode( node,"pre",fontPos );
		if( !headerTh )return false;
		ob.publish( "preNodeChange",key - 1 );
		let currentNode = node,
			i = 0,
			th;
		while( currentNode.next ){
			th = tableForOtherNode( currentNode,"next",fontPos,i );
			if( !th ){
				break;
			}else{
				bodyTh = bodyTh.concat( th );
				currentNode = currentNode.next;
			}
			i++;
		}
		node.hasTrans = true;
		return (
			<table key={key} className='markdown-table'>
				<thead>
					<tr key={key} className={"markdown-td-1"}>
						{headerTh}
					</tr>
				</thead>
				<tbody>
					{bodyTh}
				</tbody>
			</table>
		);
	}else{
		return false;
	}
}

function tableForOtherNode ( node,dir,fontPos,key ){
	let strArr = node[dir].value.split( "|" ),
		thArr = [];
	if( node[dir].value.search( /^(\|[\s]*.*[\s]*\|)/ ) == -1 ){
		return false;
	}
	thArr = strArr.map( ( item,index ) => {
		if( item ) {
			return ( fontPos[index - 1] !== undefined
				? <td key={index} className={`markdown-td-${fontPos[index - 1]}`}>{matchFontstyle( item )}</td>
				: <td key={index} className={"markdown-td-left"}>{matchFontstyle( item )}</td> );	
		}
	} );
	node[dir].hasTrans = true;
	if( dir == "next" ){
		return ( <tr key={key} className={`markdown-td-${key % 2}`}>{thArr}</tr> );
	}else{
		return thArr;
	}
}

/*search list*/
function FindList ( {node,key} ){
	let val = node.value,
		listArr = [],
		current,
		newValue,
		reg = /^[\s]*[-+*]{1}[\s]+/,
		index = 0;
	if( val.search( reg ) == -1 ){
		return false;
	}
	node.hasTrans = true;
	newValue = val.replace( reg,"" );
	listArr.push( <li key={index}>{matchFontstyle( newValue )}</li> );
	let matchIcon = val.match( reg )[0].trim();
	current = node;
	while( current.next ){
		index++;
		if( current.next.value.search( reg ) == -1 ){
			break;
		}else{
			let icon = current.next.value.match( reg )[0].trim();
			if( icon == matchIcon ){
				let newNextValue = current.next.value.replace( reg,"" );
				listArr.push( <li key={index}>{matchFontstyle( newNextValue )}</li> );
				current.next.hasTrans = true;
				current = current.next; 
			}else{
				break;
			}
		}  
	}
	return ( <ul key={key}>{listArr}</ul> );
}

/*search numberList*/
function FindNumList ( {node,key} ){
	let val = node.value,
		listArr = [],
		current,
		newValue,
		reg = /^[\s]*[0-9]{1}.[\s]+/,
		index = 0;
	if( val.search( reg ) == -1 ){
		return false;
	}
	node.hasTrans = true;
	newValue = val.replace( reg,"" );
	listArr.push( <li key={index}>{matchFontstyle( newValue )}</li> );
	current = node;
	while( current.next ){
		index++;
		if( current.next.value.search( reg ) == -1 ){
			break;
		}else{
			let newCurrentValue = current.next.value.replace( reg,"" );
			listArr.push( <li key={index}>{matchFontstyle( newCurrentValue )}</li> );
			current.next.hasTrans = true;
			current = current.next;
		}  
	}
	return ( <ol key={key}>{listArr}</ol> );
}

/*search >>*/
function FindGuide ( {node,key} ){
	let value = node.value,
		reg = /^>+/,
		matchArr,
		i = 0,
		l,
		newValue = [],
		current,
		nowData;
	if( value.search( reg ) == -1 )return false;
	matchArr = value.match( reg )[0];
	l = matchArr.length;
	newValue .push( matchFontstyle( value.split( reg )[1] ) );
	current = node.next;
	while( current ){
		if( current.value.search( reg ) == -1 ){
			break;
		}
		newValue.push( <br key={++key}/>,matchFontstyle( current.value.split( reg )[1] ) );
		current.hasTrans = true;
		current = current.next;
	}
	nowData = Guide( newValue ,key );
	while( i < l - 2 ){
		i++;
		nowData = Guide( nowData,i );
	}
	node.hasTrans = true;
	if( l == 1 ){
		return nowData;	
	}
	return <blockquote key={key}>{nowData}</blockquote>;
    
}
/*for >> */
function Guide ( props,i ){
	return <blockquote key={i}>{props}</blockquote>;
}

/*search ---|*** */
function FindLine ( {node,key} ){
	let value = node.value,
		reg = /^([-]{3,}|[=]{3,}|[*]{3,})$/,
		matchIcon;
	if( value.search( reg ) == -1 )return false;
	matchIcon = value.match( reg )[0].search( /-|=/ );
	node.hasTrans = true;
	if( matchIcon != -1 ){
		if( node.pre && !node.pre.hasTrans && node.pre.value != "" && node.pre.value.search( /[^\s]/ ) != -1 ){
			node.pre.hasTrans = true;
			ob.publish( "preNodeChange",key - 1 );
			return <h1 key={key}>{matchFontstyle( node.pre.value )}</h1>;
		}else{
			return <hr key={key}/>;
		}
	}else{
		return <hr key={key}/>;
	}
    
}

/*search image */
function FindImage ( {node,key} ){
	let value = node.value,
		reg = /^!(\[.*\])(\(.+\))/,
		alt,
		url,
		title,
		urlArr;
	if( value.search( reg ) == -1 )return false;
	value.replace( reg,( $1,$2,$3 ) => {
		alt = $2.match( /(\[).*(?=\])/ )[0].split( "[" )[1];
		urlArr = $3.match( /(\().+(?=\))/ )[0].split( " " );
		url = urlArr[0].split( "(" )[1];
		title = urlArr[1]
			? urlArr[1].split( "\"" )[1]
			: "";
	} );
	node.hasTrans = true;
	return ( <div key={key} className="markdown-image-div">
		<img className="markdown-image" key={key} src={url} alt={alt} title={title} data-original-src={url}/>
		<br />
		<div className="markdown-image-text">{alt}</div>
	</div> );
}

/*search checkbox */
function FindCheckbox ( {node,key} ){
	let value = node.value,
		regFalse = /^-\s\[\s\]/,
		regTrue = /^-\s\[x\]/,
		index = 0,
		newValue,
		current,
		checkboxList = [];
	if( value.search( regFalse ) == -1 && value.search( regTrue ) == -1 )return false;
	if( value.search( regFalse ) != -1 ){
		newValue = value.replace( regFalse,"" );
		checkboxList.push( <li key={index}>
			<input type="checkbox" disabled="true" checked={false} className="markdown-checkbox"/>{newValue}
		</li> );
	}
	if( value.search( regTrue ) != -1 ){
		newValue = value.replace( regTrue,"" );
		checkboxList.push( <li key={index}>
			<input type="checkbox" disabled="true" checked={true} className="markdown-checkbox"/>{newValue}
		</li> );
	}
	node.hasTrans = true;
	current = node.next;
	while( current ){
		index++;
		let nextValue = current.value,
			newNextValue;
		if( nextValue.search( regFalse ) != -1 ){
			newNextValue = nextValue.replace( regFalse,"" );
			checkboxList.push( <li key={index}>
				<input type="checkbox" disabled="true" checked={false} className="markdown-checkbox"/>{newNextValue}
			</li> );
		}else if( nextValue.search( regTrue ) != -1 ){
			newNextValue = nextValue.replace( regTrue,"" );
			checkboxList.push( <li key={index}>
				<input type="checkbox" disabled="true" checked={true} className="markdown-checkbox"/>{newNextValue}
			</li> );
		}else{
			break;
		}
		current.hasTrans = true;
		current = current.next;
	}
	return ( <ul key={key} className='markdown-checkbox-ul'>
		{checkboxList}
	</ul> );

}

export default toHtmlElement;