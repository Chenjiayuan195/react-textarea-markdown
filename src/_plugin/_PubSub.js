class PubSub {

	constructor () {
		this.subscribers = {};
	}
  
	subscribe ( type, fn ) {
		if ( !this.subscribers[type] ){
			this.subscribers[type] = [];
		}
		this.subscribers[type].push( fn );
		// todo subscribe
	}
  
	unsubscribe ( type, fn ) {
		if ( !this.subscribers[type] ){
			return;
		}
		this.subscribers[type] = this.subscribers[type].filter( items => {
			return items != fn;
		} );
      
		// todo unsubscribe
	}
  
	publish ( type, ...args ) {
		if ( !this.subscribers[type] ) {
			return;
		}
		this.subscribers[type].forEach( items => {
			items.apply( this,args );
		} );
		// todo publish
	}  
}
const ob = new PubSub();
export default ob;