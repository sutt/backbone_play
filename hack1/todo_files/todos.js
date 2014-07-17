
var maxResults = 5;
var arr2 = ["#f7fbff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#08519c","#08306b"];

$(function(){
	var searchList;
	$.getJSON("gl0.json", function(json) {
		searchList = json.map( function(x) { 
			return x.geneName;
			});
	});
  
  var Todo = Backbone.Model.extend({

	defaults: function() {
      return {
        title: "empty todo...",
        order: Todos.nextOrder(),
        done: false,
		currentSearch: ""
      };
    },

    toggle: function() {
      this.save({done: !this.get("done")});
    }

  });

  var Gene = Backbone.Model.extend({
  
	defaults: function() {
		return {
			geneName: "gene name"
			,geneStart: 0
			,geneEnd: 0
			,geneLen: 0
			,searchSelected: false
			,holdingStr: ""
			,holdingBool: true
			,title: "empty todo..."
			,order: Genes.nextOrder()
			,done: false
			,currentSearch: ""
			
			}
		},
		
	selectedToggle: function() {
	  console.log('in model');
      this.save({searchSelected: !this.get("searchSelected")});
    }
	});

	
  var TodoList = Backbone.Collection.extend({

    model: Todo,

    localStorage: new Backbone.LocalStorage("todos-backbone"),

    done: function() {
      return this.where({done: true});
    },

    remaining: function() {
      return this.where({done: false});
    },

   
    nextOrder: function() {
      if (!this.length) return 1;
      return this.last().get('order') + 1;
    },


	lastInOrder: function() {
		//this.last().clear(); //model.destroy();
		return this.last();
	},
	
    comparator: 'order'

  });

 
  var GeneList = Backbone.Collection.extend({

    model: Gene,

    localStorage: new Backbone.LocalStorage("gene-list"),
	
    done: function() {
      return this.where({done: true});
    },
	
	getSelectedIndex: function() {
		if (this.where({searchSelected:true}).length == 0)
				return 0; 
		return this.findWhere({searchSelected:true})
						.get('order');
		
	},
	
	orderI: function(i) {
		return this.where({order: i});
	},
	
	holdingBool: function() {
      return this.where({holdingBool: true});
    },
	
    remaining: function() {
      return this.where({done: false});
    },

    nextOrder: function() {
      if (!this.length) return 1;
      return this.last().get('order') + 1;
    },

	lastInOrder: function() {
		return this.last();
	},

    comparator: 'order'

  });
  
  // Create our global collections.
  var Todos = new TodoList;
  var Genes = new GeneList;
  
  
  var TodoView = Backbone.View.extend({

    tagName:  "li",

    template: _.template($('#item-template').html()),

    events: {
      "click .toggle"   : "toggleDone",
      "dblclick .view"  : "edit",
      "click a.destroy" : "clear",
      "keypress .edit"  : "updateOnEnter",
      "blur .edit"      : "close",
    },

	initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },

    // Re-render the titles of the todo item.
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.toggleClass('done', this.model.get('done'));
      this.input = this.$('.edit');
      return this;
    },

    // Toggle the `"done"` state of the model.
    toggleDone: function() {
      this.model.toggle();
    },

    // Switch this view into `"editing"` mode, displaying the input field.
    edit: function() {
      this.$el.addClass("editing");
      this.input.focus();
    },
	
	
    close: function() {
      var value = this.input.val();
      if (!value) {
        this.clear();
      } else {
        this.model.save({title: value});
        this.$el.removeClass("editing");
      }
    },

    updateOnEnter: function(e) {
      myKeyCode = e.keyCode;
	  //alert(myKeyCode);
	  //if (e.keyCode == 13) this.close();
	  if (e.keyCode == 13) this.close()
    },

    clear: function() {
      this.model.destroy();
    }

  });
  
  var GeneView = Backbone.View.extend({

    tagName:  "li",

    template: _.template($('#gene-template').html()),

    events: {
      "click"   : "toggleSearch",
    },

	initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.toggleClass('searchSelected', 
							this.model.get('searchSelected'));
      this.input = this.$('.edit');
      return this;
    },

	toggleSearch: function() {
		this.model.selectedToggle();
		console.log('in gene view');
	},

    clear: function() {
      this.model.destroy();
    }

  });


  var AppView = Backbone.View.extend({

    el: $("#todoapp"),

    statsTemplate: _.template($('#stats-template').html()),

    events: {
      "keypress #new-todo":  "inputType",
	  "keydown":  			  "commandType",  
      "click #clear-completed": "clearCompleted",
      "click #toggle-all": "toggleAllComplete"
    },
			
    initialize: function() {

      this.input = this.$("#new-todo");
      //this.allCheckbox = this.$("#toggle-all")[0];

      this.listenTo(Todos, 'add', this.addOne);
      this.listenTo(Todos, 'reset', this.addAll);
      this.listenTo(Todos, 'all', this.render);
	  
	  this.listenTo(Genes, 'add', this.renderSearchBox);

      this.footer = this.$('footer');
      this.main = $('#main');

      Todos.fetch(); 
	  //Genes.fetch();
    },

    render: function() {
      var done = Todos.done().length;
      var remaining = Todos.remaining().length;

      if (Todos.length) {
        this.main.show();
        this.footer.show();
        this.footer.html(this.statsTemplate({done: done, remaining: remaining}));
      } else {
        this.main.hide();
        this.footer.hide();
      }

      //this.allCheckbox.checked = !remaining;
    },

    addOne: function(todo) {
      var view = new TodoView({model: todo});
      this.$("#todo-list").append(view.render().el);
    },
	
	renderSearchBox: function(gene) {
	 var view = new GeneView({model:gene});
	 this.$("#gene-list").append(view.render().el);
	},
	
	intelliFunc: function(s) {
	
		_.invoke(Genes.holdingBool(), 'destroy');
		if (s.length > 0) {
		//Genes.clear();
		var sLen = s.length;
		var matchG = _.filter( 
						searchList
						,function(L) { 
							return (L.slice(0,sLen)
									.toLowerCase()
									.search(s.toLowerCase()
									) > -1); 
						} 
		);
		//console.log('LS1:' + (localStorage['gene-list'].toString()
		//						.split(",").length - 1) );
		
		
		//for (i=0; i<Math.min(5,matchG);i++) {
		matchG.forEach(function(g) { 
			Genes.create( {geneName: g
							});
		});
		}
	},

	popGene: function(g) {
		var arcpop = d3.svg.arc()
			.innerRadius(radius - 60)
			.outerRadius(radius + 5);
	
		//geneList.forEach( function(g) {
		  console.log('pop: ' + g);
			d3.select('#donut')
				.select('#outerWheel')
				//.selectAll('path')
				.selectAll('#'+g)
					.attr("fill", '#000000')
					.attr("d",arcpop);

					//thisguy.transition().duration(1750).styleTween('fill',this.fillTween());
		//});
	},
	
	fillTween: function(a) {
	  
	  console.log('in fill tween' );
	  //this._current = i(0);
	  return function(t) {		
		return arr2[Math.round(t*7)];
	  };
	},
	commandType: function(e) {
		//console.log('commandtype' + e.keyCode);
		
		//DELETE typed in input box
		  //if (document.activeElement.id == 'new-todo' && e.keyCode == 8) {
		  if ( e.keyCode == 8) {
				var s = this.input.val();
				this.intelliFunc(s.slice(0,s.length-1));
			}
		
		//DOWN arrow
		if (e.keyCode == 40) {
		 var ind = Genes.getSelectedIndex();
		 console.log('start ind:' + ind);
		 //turn off last, ind
		 if ((ind != 0) && (ind != 5)) 
			Genes.orderI(ind).forEach(function(g){g.selectedToggle();}); 
		 //turn on next, ind+1
		 if (ind !=5) { 
			Genes.orderI(ind+1).forEach(function(g){g.selectedToggle();});}
		 console.log('end ind:' + Genes.getSelectedIndex());
		}
		
		//UP arrow
		if (e.keyCode == 38) {
			var ind = Genes.getSelectedIndex();
			//turn off old
			if (ind != 0) 
			   Genes.orderI(ind).forEach(function(g){g.selectedToggle();}); 
			//turn on new, ind-1
			if ((ind != 0) && (ind != 1)) 
			   Genes.orderI(ind-1).forEach(function(g){g.selectedToggle();});
		}
		//for both highlight gene on wheel
		if ( ( (e.keyCode == 38) || (e.keyCode ==40) )
				&& (Genes.getSelectedIndex() != 0) ) {
			
			Genes.orderI(Genes.getSelectedIndex())
				 .forEach(function(g){ 
					App.popGene(g.get('geneName'));
				});		 
			}
	},
	
	
    inputType: function(e) {
	
		//ENTER
		if (e.keyCode == 13) {
			
			//typed into box
			if (Genes.getSelectedIndex() == 0) {
			Todos.create({title: this.input.val(), 
						  currentSearch: this.input.val()});
			
			//selected from result-box
			} else {
				var i = Genes.getSelectedIndex();
				Genes.orderI(i).forEach(function(x) {
					Todos.create({title: x.get('geneName'), 
								  currentSearch: x.get('geneName')
								  });
				});
			}
			//finish the same way
			this.input.val('');	
			_.invoke(Genes.holdingBool(),'destroy');
		}
		if (e.keyCode == 13) return;

		//All other typed keys prompt intellisense search
			var mySearch = this.input.val() 
						 + String.fromCharCode(e.keyCode);
			this.intelliFunc(mySearch);
			return;

    },

    // Clear all done todo items, destroying their models.
    clearCompleted: function() {
      _.invoke(Todos.done(), 'destroy');
      return false;
    },

    toggleAllComplete: function () {
      //var done = this.allCheckbox.checked;
      Todos.each(function (todo) { todo.save({'done': done}); });
    }

  });

  // Finally, we kick things off by creating the **App**.
  var App = new AppView;

});
