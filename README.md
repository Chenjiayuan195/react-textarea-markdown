# react-textarea-markdown
> A simpler react-markdown

### Install
```
npm i react-textarea-markdown
```
### For example
```
import React, { Component } from "react";
import Markdown from "react-textarea-markdown";
class App extends Component {
  render () {
    return (
      <div className="App">
	<Markdown textarea={true} customWidth={[50,50]} callback={func} source={value}/>
      </div>
    );
  }
}
```

### Support property

| property | type | effect|
| --- | --- | ---- |
|textarea|bool| Display is built into textarea|
|source|string|External to data sources|
|callback|func|Get the value of the real time return of the internal textarea|
|customWidth|array|Customize the width of textarea and markdown, of which 0 represents markdown 1 for textarea|

### Support grammar

- [x] Title
- [x] Checkbox
- [x] Table
- [x] Code
- [x] List
- [x] Font Style
- [x] Quote
- [x] Segmenting line
- [x] Image
- [x] Hyperlink

### Why do you choose it？
+ Can be used to render markdown alone
+ Bring the textarea editor
+ A more flexible layout
+ Real-time Preview
+ Closer to the encoding style of vscode
+ Real time back propagation of internal textarea data
+ Easy to use
