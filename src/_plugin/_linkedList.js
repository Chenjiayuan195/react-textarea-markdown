class linkedList{
	constructor (){
		this.head = null;
		this.length = 0;
	}
	insert ( value ){
		const node = new Node( value );
		let current;
		if( this.head === null ){
			this.head = node;
		}else{
			current = this.head;
			while( current.next ){
				current = current.next;
			}
			current.next = node;
			node.pre = current;
		}
		this.length++;
	}
}

/**
 * struct Node
 */
class Node{
	constructor ( value = "" ){
		this.pre = null;
		this.next = null;
		this.value = value;
		this.hasTrans = false;
	}
}

export default linkedList;

