function Router(SammyContext) {

	let config = [
		{
			url: '#/',
			template: './routes/home/home.template.mustache',
			controller: './routes/home/home.controller',
			controllerAs: 'home'
		},
		{
			url: '#/login',
			template: './routes/login/login.template.mustache',
			controller: './routes/login/login.controller'
		},
		{
			url: '#/devices',
			template: './routes/device/device.template.mustache',
			controller: './routes/device/device.controller'
		}
	];

  config.forEach(function(r){
  	var req = require.context('./', true, /^\.\/.*\.controller$/);
  	
  	// Fetch template
  	SammyContext.get(r.url, function(context){
			Promise.all([
  			// Load template
  			context.load(r.template),
  			// Execute controller
  			req(r.controller)
			]).then(function(res){
				// Instanciate controller
				let ctrl = new res[1](context.params);

				// Running init() to execute async functions
				return Promise.all([
					ctrl.init()
				]).then(function(){
					return ctrl;
				});

			}).then(function(ctrl){
				// Extending context with controller return
				if(r.controllerAs){
					context[r.controllerAs] = {};
					Object.assign(context[r.controllerAs], ctrl);
				} else {
					Object.assign(context, ctrl);
				}

				// Render parcial and show in wrapper.
				context.partial(r.template).then(function(){
					// Execute link after render in order to bind elements.
					ctrl.link();
				});
			}).catch(function(err){
				console.error('Fail executing route: ', err);
			});

  	});
  });
}

module.exports = Router
